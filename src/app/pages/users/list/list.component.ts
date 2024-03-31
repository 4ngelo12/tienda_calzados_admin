import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AllUsers } from 'src/app/core/interfaces';
import { LocalstorageService, ThemeService, UserService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  columnNamesDisplay: string[] = ['name', 'lastname', 'email', 'birthdate', 'active', 'Actions'];
  columnsToDisplay: string[] = this.columnNamesDisplay.slice();
  columnMapping: { [key: string]: string } = {
    'name': 'Nombre',
    'lastname': 'Apellido',
    'email': 'Correo',
    'birthdate': 'Fecha de Nacimiento',
    'active': 'Activo',
  };
  dataSource!: MatTableDataSource<AllUsers>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isDarkTheme: boolean = false;

  userId!: number;

  constructor(private userService: UserService, private lsService: LocalstorageService, private themeService: ThemeService,
    private router: Router, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.lsService.validateToken();
    this.userId = this.lsService.getUser().id;
    this.userService.getUsers(this.userId).subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }


  // Redirecciones

  showCreate() {
    this.router.navigate(['/users/create']);
  }

  // Funciones

  showAlert(id: number, active: boolean): void {
    Swal.fire({
      title: '¿Estas seguro?',
      icon: 'warning',
      text: active ? 'Estas a punto de desactivar un usuario' : 'Estas a punto de activar un usuario',
      color: this.isDarkTheme ? '#C5C5C5' : '#514E4E',
      background: this.isDarkTheme ? '#2d2d2d' : '#f2f2f2',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (active) {
          this.deleteUser(id);
        } else {
          this.activateUser(id);
        }
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.userService.getUsers(this.userId).subscribe(users => {
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
        });
      },
      complete: () => {
        this.snack.open('Usuario Desactivado', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
        });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('No se pudo eliminar el usuario', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
        });
      }
    });
  }

  activateUser(id: number): void {
    this.userService.activateUser(id).subscribe({
      next: () => {
        this.userService.getUsers(this.userId).subscribe(users => {
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
        });
      },
      complete: () => {
        this.snack.open('Usuario Activado', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
        });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('No se pudo eliminar el usuario', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
