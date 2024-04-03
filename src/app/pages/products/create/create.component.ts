import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CanExit } from 'src/app/core/guards';
import { Category } from 'src/app/core/interfaces';
import { Products } from 'src/app/core/interfaces/product';
import { CateoryService, ProductsService, ThemeService } from 'src/app/core/services';
import { MediaService } from 'src/app/core/services/media.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, CanExit {
  newProductForm!: FormGroup;

  allowedImageTypes: string[] = ['image/jpeg', 'image/png'];
  categories: Category[] = [];
  productData: Products = {} as Products;

  selectedFileName: string = '';
  selectedFile: File | null = null;
  action: boolean | undefined;
  isDarkTheme: boolean = false;

  constructor(private productService: ProductsService, private categoryService: CateoryService,
    private mediaService: MediaService, private themeService: ThemeService, private router: Router, 
    private snack: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCategories();

    this.themeService.darkTheme.subscribe(darkTheme => {
      this.isDarkTheme = darkTheme;
    });

    this.newProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.minLength(8)]],
      image: ['', [Validators.required]],
      size: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      purchase_price: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      sale_price: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      stock: ['', [Validators.required]],
      category: ['', [Validators.required]],
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
      this.productData = this.newProductForm.value;
      this.newProductForm.value.image = this.selectedFile;

      if (this.imageTypeValidator(this.selectedFile)) {
        this.snack.open('El tipo de archivo no es una imagen válida. Los formatos permitidos son JPEG y PNG.', 'Cerrar', {
          horizontalPosition: 'end',
          duration: 9000,
          panelClass: ['bg-red-600', 'text-white', 'custom-close-button-text', 'dark:bg-red-800'],
        });
        return;
      }

      this.productService.newProduct(this.newProductForm.value).subscribe({
        next: () => {
          this.newProductForm.reset();
          this.mediaService.uploadImage(this.selectedFile!).subscribe();

          this.router.navigate(['/products/list']);
          this.snack.open('Producto creado', 'Aceptar', {
            horizontalPosition: 'end',
            duration: 5000,
            panelClass: ['bg-green-600', 'text-white', 'custom-close-button-text', 'dark:bg-green-800']
          });
        },
        error: (err) => {
          this.snack.open(err.error.message, 'Cerrar', {
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
    if (this.newProductForm.get('name')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    if (this.newProductForm.get('name')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('name')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageDescription() {
    if (this.newProductForm.get('description')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }

    return this.newProductForm.get('description')!.hasError('minlength') ?
      'El valor ingresado no es lo suficientemente largo' : '';
  }

  getErrorMessageImage() {
    if (this.newProductForm.get('image')!.hasError('required')) {
      return 'Debe seleccionar un archivo';
    } else if (this.newProductForm.get('image')!.hasError('invalidImageType')) {
      return 'El tipo de archivo no es una imagen válida. Los formatos permitidos son JPEG y PNG.';
    }

    return '';
  }

  getErrorMessageSize() {
    return this.newProductForm.get('size')!.hasError('required') ? 'El campo no puede estar vacio' : '';
  }

  getErrorMessageBrand() {
    return this.newProductForm.get('brand')!.hasError('required') ? 'El campo no puede estar vacio' : '';
  }

  getErrorMessagePurchasePrice() {
    if (this.newProductForm.get('purchase_price')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    if (this.newProductForm.get('purchase_price')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('purchase_price')!.hasError('minlength') ? 'El valor ingresado no supera el mínimo' : '';
  }

  getErrorMessageSalePrice() {
    if (this.newProductForm.get('sale_price')!.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    if (this.newProductForm.get('sale_price')!.hasError('maxlength')) {
      return 'El valor ingresado es demasiado largo';
    }

    return this.newProductForm.get('sale_price')!.hasError('minlength') ? 'El valor ingresado no supera el mínimo' : '';
  }

  getErrorMessageStock() {
    return this.newProductForm.get('stock')!.hasError('required') ? 'El campo no puede estar vacio' : '';
  }

  getErrorMessageCategory() {
    return this.newProductForm.get('category')!.hasError('required') ? 'Necesitas seleccionar una categoría' : '';
  }
}
