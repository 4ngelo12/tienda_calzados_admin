import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalstorageService, UserService } from 'src/app/core/services';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  token: any;
  navbar!: ElementRef;
  themeMode: boolean = false;

  constructor(private router: Router, private user: UserService, private ls: LocalstorageService,
    private renderer: Renderer2, private el: ElementRef,
    private cdr: ChangeDetectorRef, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.navbar = this.el.nativeElement.querySelector('#navbar');
    this.tokenAvailable();

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
    }
  }

  showNavbar() {
    if (this.navbar) {
      this.rechargeComponent();
      this.renderer.removeClass(this.navbar, 'hidden');
    }
  }

  // Redirecciones

  showHome() {
    this.router.navigate(['/home']);
  }

  showLogin() {
    this.router.navigate(['/auth/login']);
  }

  showPerfil() {
    this.router.navigate(['/users/perfil']);
  }

  logout() {
    this.ls.logout();
    this.rechargeComponent();
    this.router.navigate(['/home']);
  }

  // Funciones de la barra de navegación
  toggleTheme(): void {
    this.themeService.setDarkTheme(!this.themeMode); // Cambia a tema oscuro
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
