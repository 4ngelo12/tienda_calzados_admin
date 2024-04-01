import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Products } from 'src/app/core/interfaces/product';
import { LocalstorageService, MediaService, ProductsService, ThemeService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListComponent implements OnInit {
  imgURL!: string;
  columnNamesDisplay: string[] = ['code', 'name', 'size', 'stock', 'active', 'Actions'];
  columnsToDisplayWithExpand = [...this.columnNamesDisplay, 'expand'];
  //Nombres para mostrar al usuario
  columnMapping: { [key: string]: string } = {
    'code': 'Código',
    'name': 'Nombre',
    'size': 'Talla',
    'stock': 'Stock',
    'active': 'Activo',
  };
  dataSource!: MatTableDataSource<Products>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  showDetails: boolean = false;
  expandedElement!: Products | null;
  isDarkTheme: boolean = false;
http: any;

  constructor(private lsService: LocalstorageService, private productService: ProductsService,
    public mediaService: MediaService, private themeService: ThemeService, private router: Router,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.lsService.validateToken();
    this.productService.getProducts().subscribe(products => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
    });

    this.themeService.darkTheme.subscribe(isDarkTheme => {
      this.isDarkTheme = isDarkTheme;
    });
  }

  // Redirecciones

  showCreate() {
    this.router.navigate(['/products/create']);
  }

  showUpdate(id: string) {
    this.router.navigate(['/products/update', id]);
  }

  // Funciones

  showAlert(id: number, active: boolean): void {
    Swal.fire({
      title: '¿Estas seguro?',
      icon: 'warning',
      text: active ? 'Estas a punto de desactivar un producto' : 'Estas a punto de activar un producto',
      color: this.isDarkTheme ? '#C5C5C5' : '#514E4E',
      background: this.isDarkTheme ? '#2d2d2d' : '#f2f2f2',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (active) {
          this.deleteProduct(id);
        } else {
          this.activateProduct(id);
        }
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.productService.getProducts().subscribe(products => {
          this.dataSource = new MatTableDataSource(products);
          this.dataSource.paginator = this.paginator;
        });
      },
      complete: () => {
        this.snack.open('Producto Desactivado', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
        });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('No se pudo eliminar el producto', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
        });
      }
    });
  }

  activateProduct(id: number): void {
    this.productService.activateProduct(id).subscribe({
      next: () => {
        this.productService.getProducts().subscribe(products => {
          this.dataSource = new MatTableDataSource(products);
          this.dataSource.paginator = this.paginator;
        });
      },
      complete: () => {
        this.snack.open('Producto Activado', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 5000,
          panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
        });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('No se pudo eliminar el producto', 'Cerrar', {
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
