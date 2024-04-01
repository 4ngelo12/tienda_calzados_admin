import { Component, OnInit } from '@angular/core';
import { BestSellingProduct, TotalSalesByMonth } from 'src/app/core/interfaces';
import { Products } from 'src/app/core/interfaces/product';
import { ProductsService, SalesService } from 'src/app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sellingProducts: BestSellingProduct = {} as BestSellingProduct;
  totalSalesByMonth: TotalSalesByMonth = {} as TotalSalesByMonth;
  productbyId: Products = {} as Products;
  lowStockProducts: Products[] = [];
  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;

  constructor(private saleService: SalesService, private productService: ProductsService) { }

  ngOnInit(): void {
    this.currentMonth = this.currentDate.getMonth() + 1;
    this.currentYear = this.currentDate.getFullYear();

    this.getBestSellingProduct();
    this.getTotalSalesByMonth();
    this.getLowStockProducts();
  }

  // Funciones para mostrar los datos en la vista
  getBestSellingProduct() {
    this.saleService.getBestSellingProduct().subscribe((data: any) => {
      this.sellingProducts = data;
      this.productService.getProductById(this.sellingProducts.productId).subscribe((product: any) => {
        this.productbyId = product;
      });
    });
  }

  getTotalSalesByMonth() {
    this.saleService.getTotalSalesByMonth(this.currentMonth, this.currentYear).subscribe((data: any) => {
      this.totalSalesByMonth = data;
    });
  }

  getLowStockProducts() {
    this.productService.getProductsByLowStock().subscribe((data: any) => {
      this.lowStockProducts = data;
    });
  }
}
