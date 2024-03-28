import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CanExit } from 'src/app/core/guards';
import { Category } from 'src/app/core/interfaces';
import { Products, ProductsDataUpdate } from 'src/app/core/interfaces/product';
import { CateoryService, ProductsService, ThemeService } from 'src/app/core/services';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, CanExit {
  newProductForm!: FormGroup;

  allowedImageTypes: string[] = ['image/jpeg', 'image/png'];
  categories: Category[] = [];
  productData: ProductsDataUpdate = {} as ProductsDataUpdate;

  selectedFileName: string = '';
  selectedFile: File | null = null;
  action: boolean | undefined;
  isDarkTheme: boolean = false;

  constructor(private productService: ProductsService, private categoryService: CateoryService,
    private themeService: ThemeService, private router: Router, private snack: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProductData(parseInt(this.router.url.split('/')[3]));

    this.themeService.darkTheme.subscribe(darkTheme => {
      this.isDarkTheme = darkTheme;
    });

    this.newProductForm = this.fb.group({
      name: ['', [Validators.minLength(3), Validators.maxLength(60)]],
      description: ['', [Validators.minLength(8)]],
      image: [''],
      size: [''],
      brand: [''],
      purchase_price: ['', [Validators.min(1), Validators.max(10000)]],
      sale_price: ['', [Validators.min(1), Validators.max(10000)]],
      stock: [''],
      categoryId: [''],
    });
  }

  async onExit(): Promise<boolean> {
    this.action = undefined;

    if (this.newProductForm.dirty) {
      const result = await this.showAlert();
      if (result === undefined || !result) {
        return false;
      }
      return true;
    }
    return true;
  }

  // Validacion de salida
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

  getCategories() {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data.body;
    });
  }

  getProductData(id: number) {
    this.productService.getProductById(id).subscribe((data: any) => {
      this.newProductForm.patchValue({
        name: data.name,
        description: data.description,
        size: data.size,
        brand: data.brand,
        purchase_price: data.purchase_price,
        sale_price: data.sale_price,
        stock: data.stock,
        categoryId: data.categoryId,
      });
    });
  }

  //Redirecciones
  showProducts() {
    this.router.navigate(['/products/list']);
  }

  // Funciones para el formulario

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  submitProduct() {
    if (this.newProductForm.valid) {
      this.newProductForm.value.image = this.selectedFile;

      if (this.imageTypeValidator(this.selectedFile)) {
        this.snack.open('El tipo de archivo no es una imagen válida. Los formatos permitidos son JPEG y PNG.', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 9000,
          panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
        });
        return;
      }

      const formData = { ...this.newProductForm.value };

      // Eliminar los campos vacíos
      Object.keys(formData).forEach(key => {
        if (formData[key] === null || formData[key] === '') {
          delete formData[key];
        }
      });

      this.productData = formData;

      this.productService.updateProduct(this.productData, parseInt(this.router.url.split('/')[3])).subscribe({
        next: () => {
          this.newProductForm.reset();
          this.router.navigate(['/products/list']);
        },
        complete: () => {
          this.snack.open('Producto actualizado', 'Aceptar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800'],
          });
        },
        error: (err) => {
          this.snack.open(err.error != null ? err.error.message : 'Hubo un error en la operación', 'Cerrar', {
            horizontalPosition: 'end',
            duration: 6000,
            panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
          });
        }
      });
    }

  }

  // Validaciones de formulario

  imageTypeValidator(control: any) {
    if (control) {
      const fileType = control.type;
      if (fileType && !this.allowedImageTypes.includes(fileType)) {
        return { invalidImageType: true };
      }
    }
    return null;
  }

  getErrorMessageName() {
    if (this.newProductForm.get('name')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('name')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageDescription() {
    return this.newProductForm.get('description')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessagePurchasePrice() {
    if (this.newProductForm.get('purchase_price')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('purchase_price')!.hasError('minlength') ? 'El valor ingresado no supera el mínimo' : '';
  }

  getErrorMessageSalePrice() {
    if (this.newProductForm.get('sale_price')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('sale_price')!.hasError('minlength') ? 'El valor ingresado no supera el mínimo' : '';
  }
}
