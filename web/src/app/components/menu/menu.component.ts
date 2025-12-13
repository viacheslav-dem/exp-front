import {Component, OnInit, signal, OnDestroy, input} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter, Subscription} from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: [`
    .main-menu-wrapper {
      background-color: #f8f9fa;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      width: 100%;
    }

    .main-menu {
      padding: 0;
    }

    .navbar-nav {
      gap: 0.25rem;
    }

    .nav-link {
      white-space: nowrap;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
      color: #495057;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: #e9ecef;
      color: #0d6efd;
    }

    .nav-link.active {
      background-color: #0d6efd;
      color: #fff;
      font-weight: 600;
    }

    .nav-item.dropdown {
      position: relative;
    }

    .dropdown-menu {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border-radius: 0.5rem;
      margin-top: 0.25rem;
      padding: 0.5rem 0;
      min-width: 200px;
    }

    .dropdown-item {
      padding: 0.5rem 1rem;
      transition: all 0.2s ease;
      border-radius: 0.25rem;
      margin: 0 0.5rem;
    }

    .dropdown-item:hover {
      background-color: #e7f1ff;
      color: #0d6efd;
    }

    .dropdown-item.active {
      background-color: #0d6efd;
      color: #fff;
    }

    .navbar-toggler {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
    }

    .navbar-toggler:focus {
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    @media (max-width: 991.98px) {
      .navbar-collapse {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #fff;
        border-radius: 0.5rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        margin-top: 0.5rem;
        padding: 1rem;
        z-index: 1000;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
      }

      .navbar-nav {
        flex-direction: column;
        width: 100%;
      }

      .nav-item {
        width: 100%;
      }

      .nav-link {
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
      }

      .dropdown-menu {
        position: static !important;
        transform: none !important;
        width: 100%;
        margin-top: 0.5rem;
        margin-left: 1rem;
        box-shadow: none;
        border-left: 2px solid #dee2e6;
        border-radius: 0;
        padding-left: 1rem;
      }

      .dropdown-item {
        padding: 0.5rem 0.75rem;
      }
    }
  `],
    standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {

  readonly menu = input<MenuItem[]>(undefined);

  // Сигнал для управления видимостью мобильного меню
  isMenuOpen = signal<boolean>(false);
  
  // Отслеживание открытых dropdown меню
  private openDropdowns = new Set<MenuItem>();

  private routerSubscription?: Subscription;

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
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
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
