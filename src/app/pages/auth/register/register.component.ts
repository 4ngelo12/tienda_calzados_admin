import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CanExit } from 'src/app/core/guards';
import { User } from 'src/app/core/interfaces';
import { AuthService } from 'src/app/core/services';
import { ThemeService } from 'src/app/core/services/theme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, CanExit {
  registerForm!: FormGroup;
  RegisterData: User = {} as User;
  hidePass = true;
  isDarkTheme: boolean = false;
  action: boolean | undefined;
  hidePassConfirm = true;

  constructor(private auth: AuthService, private router: Router, private themeService: ThemeService,
    private snack: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  async onExit(): Promise<boolean> {
    this.action = undefined;
    
    if (this.registerForm.dirty) {
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
    this.hidePass = !this.hidePass;
  }

  togglePasswordVisibilityConfirm() {
    this.hidePassConfirm = !this.hidePassConfirm;
  }

  // Ejecucion de la funcion registerSubmit
  registerSubmit() {
    if (this.registerForm.valid) {
      this.RegisterData = this.registerForm.value;
      this.RegisterData.idRole = 1;

      if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
        this.snack.open('Las contraseñas no coinciden', 'Aceptar', {
          duration: 5000
        });
        return;
      }
      if (this.registerForm.value.birthdate < '1/1/2005') {
        this.snack.open('Debes ser mayor de 18 años para registrarte', 'Aceptar', {
          duration: 5000
        });
        return;
      }

      this.auth.register(this.RegisterData).subscribe({
        next: (res: any) => {
          this.snack.open('Usuario registrado', 'Aceptar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
          });

          this.registerForm.reset();
        },
        error: (err) => {
          console.log(err);
          this.snack.open('Error al registrar User', 'Aceptar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
          });
        },
        complete: () => {
          this.router.navigate(['/auth/login']);
        }
      })
    }
  }

   // Redirecciones
   showLogin() {
    this.router.navigate(['auth/login']);
  }

  // Validaciones de formulario

  getErrorMessageName() {
    if (this.registerForm.get('name')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    if (this.registerForm.get('name')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.registerForm.get('name')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageLastName() {
    if (this.registerForm.get('lastname')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    if (this.registerForm.get('lastname')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.registerForm.get('lastname')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageEmail() {
    if (this.registerForm.get('email')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.registerForm.get('email')!.hasError('email') ? 'Formato de correo invalido' : '';
  }

  getErrorMessagePassword() {
    if (this.registerForm.get('password')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.registerForm.get('password')!.hasError('minlength') ? 'Longitud de contraseña insuficiente' : '';
  }

  getErrorMessagePasswordConfirm() {
    if (this.registerForm.get('passwordConfirm')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.registerForm.get('passwordConfirm')!.hasError('minlength') ? 'Longitud de contraseña insuficiente' : '';
  }
}
