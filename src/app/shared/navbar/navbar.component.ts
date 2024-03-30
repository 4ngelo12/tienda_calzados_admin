import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalstorageService, ThemeService } from 'src/app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  token: any;
  navbar!: ElementRef;
  themeMode: boolean = true;
  isMinimized: boolean = false;

  constructor(private router: Router, private ls: LocalstorageService, private renderer: Renderer2,
    private el: ElementRef, private cdr: ChangeDetectorRef, private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.navbar = this.el.nativeElement.querySelector('#navbar');
    this.tokenAvailable();
    // this.visibility = this.visibleService.getVisibility();
    // this.ejm();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const rutaActual = this.router.url;
        (rutaActual.includes("/auth")) ? this.hiddenNavbar() : this.showNavbar();
      }
    });
  }

  // Mostras/Ocultar barra de navegación
  hiddenNavbar() {
    if (this.navbar) {
      this.rechargeComponent();
      this.renderer.addClass(this.navbar, 'hidden');
      document.querySelector('#dark-colors')?.classList.remove('gap-6');
    }
  }

  showNavbar() {
    if (this.navbar) {
      this.rechargeComponent();
      this.renderer.removeClass(this.navbar, 'hidden');
      document.querySelector('#dark-colors')?.classList.add('gap-6');
    }
  }

  minimizeNavbar() {
    this.isMinimized = !this.isMinimized;
    const span = document.querySelectorAll('.nav-text');
    document.querySelector('#navbar')?.classList.toggle('min-sidebar');

    span.forEach((element) => {
      element.classList.toggle('hidden');
    });
  }

  showSidebar() {
    document.querySelector('#navbar')?.classList.toggle('nav');
  }

  // Redirecciones

  showHome() {
    this.router.navigate(['/home']);
  }

  showProducts() {
    this.router.navigate(['/products/list']);
  }

  showPerfil() {
    this.router.navigate(['/admin/profile']);
  }

  logout() {
    this.ls.logout();
    this.rechargeComponent();
    this.router.navigate(['/auth/login']);
  }

  // Funciones de la barra de navegación
  toggleTheme(): void {
    this.themeService.setDarkTheme(!this.themeMode);
  }

  tokenAvailable() {
    this.token = this.ls.getToken();
  }

  darkMode() {
    this.toggleTheme();
    this.themeService.darkTheme.subscribe((isDark: boolean) => {
      this.themeMode = isDark;
    });

    document.querySelector('html')?.classList.toggle('dark');
  }

  rechargeComponent() {
    this.token = ""
    this.tokenAvailable();
    this.cdr.detectChanges();
  }
}
