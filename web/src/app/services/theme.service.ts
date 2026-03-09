import {Injectable, signal} from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';

@Injectable({providedIn: 'root'})
export class ThemeService {

  /** Reactive signal for current theme */
  readonly theme = signal<Theme>(this.loadTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}
