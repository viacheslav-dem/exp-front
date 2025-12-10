import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit, signal, OnDestroy} from '@angular/core';
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

  @Input()
  menu: MenuItem[];

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
}

export interface MenuItem {
  link: string;
  title: string;
  children: MenuItem[];
}
