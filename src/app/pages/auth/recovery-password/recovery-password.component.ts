import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CanExit } from 'src/app/core/guards';
import { RecoveryPassword } from 'src/app/core/interfaces';
import { UserService, ThemeService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit, CanExit {
  recoveryPasswordForm!: FormGroup;
  recoveryPasswordData: RecoveryPassword = {} as RecoveryPassword;
  userId!: number;
  isDarkTheme: boolean = false;
  action: boolean | undefined;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder,
    private themeService: ThemeService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.recoveryPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  async onExit(): Promise<boolean> {
    this.action = undefined;

    if (this.recoveryPasswordForm.dirty) {
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

  // Redireccionar a la pagina de login
  showLogin() {
    this.router.navigate(['/auth/login']);
  }

  // Enviar correo de recuperacion de contraseña
  sendEmail() {
    if (this.recoveryPasswordForm.valid) {
      this.userService.getUserByEmail(this.recoveryPasswordForm.get('username')!.value).subscribe({
        next: (data: any) => {
          this.userId = data.id;
          this.recoveryPasswordData.to = this.recoveryPasswordForm.get('username')!.value;
          this.recoveryPasswordData.subject = 'Recuperación de contraseña';
          this.recoveryPasswordData.template = 1;
          this.recoveryPasswordData.metaData = [
            {
              "key": "name",
              "value": "Angelo"
            },
            {
              "key": "lastname",
              "value": "Casapaico"
            },
            {
              "key": "email",
              "value": this.recoveryPasswordForm.get('username')!.value
            },
            {
              "key": "url",
              "value": `http://localhost:4200/auth/change-password/${this.userId}`
            }
          ];

          this.userService.sendEmail(this.recoveryPasswordData).subscribe({
            next: (data: any) => {
              this.snack.open(data.mensaje, 'Cerrar', {
                horizontalPosition: 'end',
                duration: 5000,
                panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
              });
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.recoveryPasswordForm.reset();
              this.router.navigate(['/auth/login']);
            }
          })
        },
        error: (error) => {
          console.log(error);
        },
      });

    }
  }

  // Form Validation
  getErrorMessageEmail() {
    if (this.recoveryPasswordForm.get('username')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.recoveryPasswordForm.get('username')!.hasError('email') ? 'Formato de correo invalido' : '';
  }

}
