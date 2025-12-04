import {Component, OnInit, signal, OnDestroy, input} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter, Subscription} from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: [`
    .nav-link {
        white-space: nowrap;
        padding: 0.5rem;
    }
  `],
    standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {

  readonly menu = input<MenuItem[]>(undefined);

  // Сигнал для управления видимостью мобильного меню
  isMenuOpen = signal<boolean>(false);

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
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  private closeAllDropdowns() {
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
