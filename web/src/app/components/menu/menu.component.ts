import {ChangeDetectionStrategy, Component, OnInit, signal, OnDestroy, input} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter, Subscription} from 'rxjs';
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['menu.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class MenuComponent implements OnInit, OnDestroy {

  readonly menu = input<MenuItem[]>(undefined);

  // Сигнал для управления видимостью мобильного меню
  isMenuOpen = signal<boolean>(false);
  
  // Отслеживание открытых dropdown меню
  private openDropdowns = new Set<MenuItem>();

  private routerSubscription?: Subscription;
  private readonly documentClickHandler = (event: MouseEvent) => this.handleDocumentClick(event);

  constructor(private router: Router) {
  }

  ngOnInit() {
    // Подписываемся на события навигации, чтобы закрывать меню при переходе
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMenuOpen.set(false);
        this.closeAllDropdowns();
      });
    
    // Закрываем меню при клике вне его области
    // Важно: используем стабильную ссылку на handler, иначе removeEventListener не сработает
    document.addEventListener('click', this.documentClickHandler);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.documentClickHandler);
  }

  private handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuElement = document.querySelector('.main-menu');
    const togglerElement = document.querySelector('.navbar-toggler');
    
    if (menuElement && togglerElement) {
      const isClickInsideMenu = menuElement.contains(target) || togglerElement.contains(target);
      if (!isClickInsideMenu && this.isMenuOpen()) {
        this.closeMenu();
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
    if (!this.isMenuOpen()) {
      this.closeAllDropdowns();
    }
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    this.closeAllDropdowns();
  }

  toggleDropdown(item: MenuItem) {
    if (this.openDropdowns.has(item)) {
      this.openDropdowns.delete(item);
    } else {
      // Закрываем все остальные dropdown перед открытием нового
      this.openDropdowns.clear();
      this.openDropdowns.add(item);
    }
  }

  isDropdownOpen(item: MenuItem): boolean {
    return this.openDropdowns.has(item);
  }

  private closeAllDropdowns() {
    this.openDropdowns.clear();
    // Закрываем все открытые dropdown меню на странице
    const allDropdowns = document.querySelectorAll('.dropdown.show');
    allDropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
      }
      // Также обновляем aria-expanded
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  closeDropdown() {
    // Закрываем мобильное меню
    this.closeMenu();
  }
}

export interface MenuItem {
  link: string;
  title: string;
  children: MenuItem[];
}
