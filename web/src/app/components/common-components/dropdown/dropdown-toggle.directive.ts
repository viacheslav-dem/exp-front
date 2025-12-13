import { Directive, ElementRef, HostListener, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[data-bs-toggle="dropdown"], [data-toggle="dropdown"]',
  standalone: false
})
export class DropdownToggleDirective implements OnInit, OnDestroy {
  private documentClickListener?: () => void;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Добавляем обработчик клика на документ при инициализации
    this.documentClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.handleDocumentClick(event);
    });
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = this.el.nativeElement.closest('.dropdown');
    if (!dropdown) return;

    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) return;

    const isOpen = dropdown.classList.contains('show');
    
    // Закрыть все другие dropdown
    document.querySelectorAll('.dropdown.show').forEach((el: HTMLElement) => {
      if (el !== dropdown) {
        this.renderer.removeClass(el, 'show');
        const otherMenu = el.querySelector('.dropdown-menu');
        if (otherMenu) {
          this.renderer.removeClass(otherMenu, 'show');
        }
      }
    });

    // Переключить текущий dropdown
    if (isOpen) {
      this.renderer.removeClass(dropdown, 'show');
      this.renderer.removeClass(menu, 'show');
    } else {
      this.renderer.addClass(dropdown, 'show');
      this.renderer.addClass(menu, 'show');
    }
  }

  private handleDocumentClick(event: MouseEvent) {
    const dropdown = this.el.nativeElement.closest('.dropdown');
    if (!dropdown) return;

    const target = event.target as HTMLElement;
    
    // Закрыть dropdown при клике на dropdown-item
    const clickedItem = target.closest('.dropdown-item');
    if (clickedItem && dropdown.contains(clickedItem)) {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu && dropdown.classList.contains('show')) {
        this.renderer.removeClass(dropdown, 'show');
        this.renderer.removeClass(menu, 'show');
        // Обновляем aria-expanded
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
        return;
      }
    }
    
    // Закрыть при клике вне dropdown
    if (!dropdown.contains(target)) {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu && dropdown.classList.contains('show')) {
        this.renderer.removeClass(dropdown, 'show');
        this.renderer.removeClass(menu, 'show');
      }
    }
  }
}

