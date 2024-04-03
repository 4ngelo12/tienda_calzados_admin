import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CanExit } from 'src/app/core/guards';
import { Login } from 'src/app/core/interfaces';
import { AuthService, LocalstorageService, ThemeService, UserService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, CanExit {
  Loginform!: FormGroup;
  loginData: Login = {} as Login;
  isDarkTheme: boolean = true;
  action: boolean | undefined;
  hide = true;

  constructor(private user: UserService, private auth: AuthService, private lsService: LocalstorageService,
    private themeService: ThemeService, private router: Router, private snack: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.Loginform = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  async onExit(): Promise<boolean> {
    this.action = undefined;

    if (this.Loginform.dirty) {
      const result = await this.showAlert();
      if (result === undefined || !result) {
        return false;
      }
      return true;
    }
    return true;
  }

  // Mensaje de confirmación de salida

  showAlert(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      Swal.fire({
        title: '¿Seguro  que deseas salir?',
        icon: 'warning',
        text: 'Aún hay cambios sin guardar en el formulario',
        color: this.isDarkTheme ? '#C5C5C5' : '#514E4E',
        background: this.isDarkTheme ? '#2d2d2d' : '#f2f2f2',
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.action = true;
          resolve(true);
        }
        if (result.isDenied) {
          this.action = false;
          resolve(false);
        }
      });
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  // Login
  loginSubmit() {
    if (this.Loginform.valid) {
      this.loginData = this.Loginform.value;
      this.lsService.logout();
      this.auth.login(this.loginData).subscribe({
        next: (res: any) => {
          this.lsService.setToken(res.jwTtoken);
        },
        complete: () => {
          this.Loginform.reset();
          if (!this.auth.validateAdmin()) {
            this.snack.open('No tienes permisos para acceder a esta página', 'Cerrar', {
              horizontalPosition: 'end',
              duration: 5000,
              panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
            });
            this.lsService.logout();
            return;
          }
          this.user.getCurrentUser().subscribe(
            (user: any) => {
              this.lsService.setUser(user);
              this.router.navigate(['/home'])
            }
          )
        },
        error: (err: any) => {
          this.snack.open(err.error.message ? err.error.message : "Hubo un error al autenticar su cuenta", 'Cerrar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
          });
        }
      }
      );
    }
  }

  // Redirecciones
  showRecoveryPassword() {
    this.router.navigate(['/auth/recovery-password']);
  }

  // Validaciones de formulario

  getErrorMessageEmail() {
    if (this.Loginform.get('username')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.Loginform.get('username')!.hasError('email') ? 'Formato de correo invalido' : '';
  }

  getErrorMessagePassword() {
    if (this.Loginform.get('password')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.Loginform.get('password')!.hasError('minlength') ? 'Longitud de contraseña insuficiente' : '';
  }
}
