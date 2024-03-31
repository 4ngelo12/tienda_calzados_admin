import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpdateUser, UserLs } from 'src/app/core/interfaces';
import { LocalstorageService, ThemeService, UserService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  updateForm !: FormGroup;
  userId!: number;

  // User data
  userUpdData: UpdateUser = {} as UpdateUser;
  userData: UserLs = {} as UserLs;
  isDarkTheme: boolean = false;

  constructor(private userService: UserService, private lsService: LocalstorageService,
    private themeService: ThemeService, private router: Router, private fb: FormBuilder, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.userData = this.lsService.getUser();

    this.updateForm = this.fb.group({
      name: [this.userData.name, [Validators.minLength(3), Validators.maxLength(45)]],
      lastname: [this.userData.lastname, [Validators.minLength(3), Validators.maxLength(45)]],
      birthdate: [this.userData.birthdate, [Validators.required]],
      email: [this.userData.email, [Validators.email]],
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  showAlert(): void {
    // Muestra la alerta
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      text: 'Estás a punto de eliminar tu cuenta',
      color: this.isDarkTheme ? '#C5C5C5' : '#514E4E',
      background: this.isDarkTheme ? '#2d2d2d' : '#f2f2f2',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario confirmó la acción
        this.deleteUser();
      } else if (result.isDenied) {
        // El usuario negó la acción
      }
    });
  }

  deleteUser() {
    this.userId = this.lsService.getUser().id;
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.lsService.deleteToken();
        this.lsService.deleteUser();
        this.router.navigate(['/']);
      }
    });
  }

  updateUser() {
    if (this.updateForm.valid) {
      this.userUpdData = this.updateForm.value;
      this.userUpdData.id = this.lsService.getUser().id;
      this.userService.updateUser(this.userUpdData).subscribe({
        next: () => {
          this.snack.open('Datos Actualizados', 'Cerrar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
          });
        },
        complete: () => {
          this.lsService.deleteUser();
          this.lsService.setUser(this.userUpdData);
        }
      });
    }
  }

  // Forms errors messages
  getErrorMessageName() {
    if (this.updateForm.get('name')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.updateForm.get('name')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageLastName() {
    if (this.updateForm.get('lastname')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.updateForm.get('lastname')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageEmail() {
    return this.updateForm.get('email')!.hasError('email') ? 'Formato de correo invalido' : '';
  }

}
