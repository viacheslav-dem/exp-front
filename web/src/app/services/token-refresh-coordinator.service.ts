import { Injectable } from '@angular/core';
import { EMPTY, Observable, defer, fromEvent, merge, of, race, throwError, timer } from 'rxjs';
import { catchError, filter, finalize, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { StorageService } from '@app/services/storage.service';
import { UserCredentials } from '@app/dto/UserCredentials';

type RefreshLock = {
  ownerId: string;
  expiresAt: number;
};

type RefreshEvent =
  | { type: 'refresh-started'; ownerId: string; at: number }
  | { type: 'refresh-succeeded'; ownerId: string; at: number }
  | { type: 'refresh-failed'; ownerId: string; at: number; status?: number; message?: string };

/**
 * Координирует обновление токенов между вкладками браузера.
 * 
 * Проблема: если открыто несколько вкладок и access-токен истёк, все вкладки одновременно
 * пытаются обновить токены через /refresh-token. Это вызывает гонку на сервере (500 ошибка).
 * 
 * Решение: только одна вкладка делает запрос на обновление, остальные ждут результата.
 * После успешного обновления все вкладки получают новые токены через BroadcastChannel или storage events.
 */
@Injectable({ providedIn: 'root' })
export class TokenRefreshCoordinatorService {
  private static readonly LOCK_KEY = 'exp_refresh_lock_v1';
  private static readonly EVENT_KEY = 'exp_refresh_event_v1';
  private static readonly CHANNEL_NAME = 'exp_auth_refresh_v1';

  // Максимальное время ожидания обновления токенов от другой вкладки (15 секунд)
  private static readonly WAIT_TIMEOUT_MS = 15_000;
  // Время жизни блокировки (20 секунд). Если вкладка-лидер упала, блокировка автоматически истечёт
  private static readonly LOCK_TTL_MS = 20_000;

  private readonly tabId: string;
  private readonly bc?: BroadcastChannel;

  /**
   * Single-flight внутри одной вкладки.
   * Если два места в приложении одновременно инициируют refresh (guard + interceptor),
   * второй вызов должен ждать тот же запрос, а не уходить в cross-tab ожидание с таймаутом.
   */
  private inFlight$?: Observable<UserCredentials>;

  constructor(private storage: StorageService) {
    this.tabId = this.getOrCreateTabId();
    if (typeof BroadcastChannel !== 'undefined') {
      this.bc = new BroadcastChannel(TokenRefreshCoordinatorService.CHANNEL_NAME);
    }
  }

  /**
   * Выполняет обновление токенов с координацией между вкладками.
   * 
   * Если эта вкладка становится "лидером" - делает запрос на сервер.
   * Если другая вкладка уже обновляет токены - ждёт результата.
   * 
   * refreshFn функция, которая делает запрос /refresh-token на сервер
   */
  refreshOnce(refreshFn: () => Observable<UserCredentials>): Observable<UserCredentials> {
    return defer(() => {
      // Если refresh уже выполняется в этой вкладке — просто ждём его результат.
      if (this.inFlight$) {
        return this.inFlight$;
      }

      // Проверяем: может токены уже обновлены другой вкладкой?
      if (this.storage.isAccessTokenValidNow()) {
        // Токены валидны - возвращаем их из localStorage
        console.log('[TokenRefreshCoordinator] Токены уже валидны, refresh не нужен');
        return of({
          accessToken: this.storage.getAccessToken(),
          refreshToken: this.storage.getRefreshToken(),
        } as any as UserCredentials);
      }

      // Проверяем, есть ли активная блокировка (другая вкладка уже обновляет токены)
      const lock = this.readLock();
      const now = Date.now();
      const lockIsActive = !!lock && lock.expiresAt > now;

      // Если блокировка принадлежит этой же вкладке, но второй вызов пришёл чуть позже,
      // возвращаем inFlight$ (если он уже установлен). Это решает кейс "guard + interceptor" в одном tab.
      if (lockIsActive && lock?.ownerId === this.tabId && this.inFlight$) {
        return this.inFlight$;
      }

      // Если блокировки нет - пытаемся стать "лидером" и обновить токены сами
      if (!lockIsActive && this.tryAcquireLock()) {
        // Стали лидером: делаем запрос на сервер и уведомляем другие вкладки
        console.log('[TokenRefreshCoordinator] Стали лидером, отправляем refresh запрос');
        this.broadcast({ type: 'refresh-started', ownerId: this.tabId, at: Date.now() });

        // Запоминаем "полёт" refresh внутри вкладки (single-flight).
        // ВАЖНО: notifyRefreshSucceeded() должен вызываться после сохранения токенов в localStorage (делает caller).
        this.inFlight$ = refreshFn().pipe(
          shareReplay(1),
          catchError((err: any) => {
            // Если обновление не удалось - уведомляем другие вкладки и освобождаем блокировку
            this.broadcast({
              type: 'refresh-failed',
              ownerId: this.tabId,
              at: Date.now(),
              status: err?.status,
              message: err?.message,
            });
            this.releaseLock();
            return throwError(() => err);
          }),
          finalize(() => {
            this.inFlight$ = undefined;
          })
        );

        return this.inFlight$;
      }

      // Блокировка занята - ждём, пока лидер обновит токены
      console.log('[TokenRefreshCoordinator] Блокировка занята, ждём лидера...');
      return this.waitForTokensOrEvent().pipe(
        switchMap(() => {
          // Проверяем: токены обновлены?
          if (this.storage.isAccessTokenValidNow()) {
            // Да, берём их из localStorage
            console.log('[TokenRefreshCoordinator] Лидер обновил токены, используем их');
            return of({
              accessToken: this.storage.getAccessToken(),
              refreshToken: this.storage.getRefreshToken(),
            } as any as UserCredentials);
          }
          // Токены не обновились (таймаут или ошибка лидера) - пробуем сами
          console.log('[TokenRefreshCoordinator] Лидер не обновил токены (таймаут/ошибка), пробуем сами');
          if (this.tryAcquireLock()) {
            this.broadcast({ type: 'refresh-started', ownerId: this.tabId, at: Date.now() });
            return refreshFn().pipe(
              catchError((err: any) => {
                this.broadcast({
                  type: 'refresh-failed',
                  ownerId: this.tabId,
                  at: Date.now(),
                  status: err?.status,
                  message: err?.message,
                });
                this.releaseLock();
                return throwError(() => err);
              })
            );
          }
          return throwError(() => new Error('Token refresh coordination failed'));
        })
      );
    });
  }

  /**
   * Уведомляет другие вкладки об успешном обновлении токенов.
   * 
   * Вызывать ПОСЛЕ того, как новые токены сохранены в localStorage.
   * Другие вкладки получат уведомление и возьмут токены из localStorage.
   */
  notifyRefreshSucceeded(): void {
    this.broadcast({ type: 'refresh-succeeded', ownerId: this.tabId, at: Date.now() });
    // Освобождаем блокировку, чтобы другие вкладки могли обновлять токены в будущем
    this.releaseLock();
  }

  /**
   * Ждёт, пока лидер обновит токены в localStorage.
   * 
   * Слушает два источника:
   * 1. BroadcastChannel - быстрое уведомление между вкладками
   * 2. Storage event - срабатывает при изменении localStorage (fallback)
   * 
   * Если за 15 секунд токены не обновились - возвращает управление (таймаут).
   */
  private waitForTokensOrEvent(): Observable<void> {
    // Storage event срабатывает только в других вкладках (не в той, что изменила localStorage)
    const storage$ = fromEvent<StorageEvent>(window, 'storage').pipe(
      filter((e) => e.storageArea === localStorage),
      filter((e) => e.key === 'access_token' || e.key === TokenRefreshCoordinatorService.EVENT_KEY),
      filter(() => this.storage.isAccessTokenValidNow()),
      take(1),
      map(() => void 0)
    );

    // BroadcastChannel - быстрый способ уведомления между вкладками (если поддерживается)
    const bc$ = this.bc
      ? fromEvent<MessageEvent>(this.bc as any, 'message').pipe(
          map((e) => e.data as RefreshEvent),
          filter((evt) => evt?.type === 'refresh-succeeded'),
          take(1),
          map(() => void 0)
        )
      : EMPTY; // Если BroadcastChannel не поддерживается - используем только storage events

    // Ждём либо сигнал об обновлении, либо таймаут (15 секунд)
    const signal$ = merge(storage$, bc$).pipe(take(1));
    const timeout$ = timer(TokenRefreshCoordinatorService.WAIT_TIMEOUT_MS).pipe(map(() => void 0));
    return race(signal$, timeout$).pipe(take(1));
  }

  /**
   * Отправляет уведомление другим вкладкам об обновлении токенов.
   * 
   * Использует два способа для надёжности:
   * 1. BroadcastChannel - быстрый и надёжный (если поддерживается)
   * 2. localStorage event - работает во всех браузерах (fallback)
   */
  private broadcast(evt: RefreshEvent): void {
    // Способ 1: BroadcastChannel (быстро и надёжно)
    try {
      this.bc?.postMessage(evt);
    } catch {
      // Игнорируем ошибки (например, если канал закрыт)
    }
    // Способ 2: localStorage event (fallback для старых браузеров)
    try {
      localStorage.setItem(TokenRefreshCoordinatorService.EVENT_KEY, JSON.stringify(evt));
      // Удаляем сразу, чтобы сработал storage event в других вкладках
      localStorage.removeItem(TokenRefreshCoordinatorService.EVENT_KEY);
    } catch {
      // Игнорируем ошибки (например, если localStorage переполнен)
    }
  }

  /**
   * Пытается захватить блокировку (стать "лидером" для обновления токенов).
   * 
   * true если блокировка захвачена, false если уже занята другой вкладкой
   */
  private tryAcquireLock(): boolean {
    const now = Date.now();
    const next: RefreshLock = {
      ownerId: this.tabId,
      expiresAt: now + TokenRefreshCoordinatorService.LOCK_TTL_MS,
    };

    // Проверяем: есть ли активная блокировка от другой вкладки?
    const current = this.readLock();
    if (current && current.expiresAt > now && current.ownerId !== this.tabId) {
      return false; // Блокировка занята другой вкладкой
    }

    // Пытаемся установить свою блокировку
    try {
      localStorage.setItem(TokenRefreshCoordinatorService.LOCK_KEY, JSON.stringify(next));
      // Проверяем, что блокировка действительно установлена (на случай гонки)
      const confirmed = this.readLock();
      return !!confirmed && confirmed.ownerId === this.tabId;
    } catch {
      // Если не удалось (например, localStorage недоступен) - не стали лидером
      return false;
    }
  }

  /**
   * Освобождает блокировку (если мы её владельцы).
   * Позволяет другим вкладкам стать лидерами в будущем.
   */
  private releaseLock(): void {
    const lock = this.readLock();
    // Освобождаем только свою блокировку
    if (lock?.ownerId !== this.tabId) return;
    try {
      localStorage.removeItem(TokenRefreshCoordinatorService.LOCK_KEY);
    } catch {
      // Игнорируем ошибки
    }
  }

  /**
   * Читает текущую блокировку из localStorage.
   * 
   * информация о блокировке или null, если блокировки нет
   */
  private readLock(): RefreshLock | null {
    try {
      const raw = localStorage.getItem(TokenRefreshCoordinatorService.LOCK_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Проверяем корректность данных
      if (!parsed || typeof parsed.ownerId !== 'string' || typeof parsed.expiresAt !== 'number') return null;
      return parsed as RefreshLock;
    } catch {
      // Если ошибка парсинга - считаем, что блокировки нет
      return null;
    }
  }

  /**
   * Получает или создаёт уникальный ID для этой вкладки.
   * 
   * Использует sessionStorage, который уникален для каждой вкладки браузера.
   * Это позволяет отличать "нашу" вкладку от других при работе с блокировками.
   */
  private getOrCreateTabId(): string {
    const key = 'exp_tab_id_v1';
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    // Генерируем уникальный ID: timestamp + случайное число
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(key, id);
    return id;
  }
}

