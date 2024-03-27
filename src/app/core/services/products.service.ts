import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { NewProducts, Products, ProductsResponse } from '../interfaces/product';
import baseUrl from '../interfaces/helper';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Products[]> {
    return this.http.get<ProductsResponse>(`${baseUrl}/products/all?size=20`)
      .pipe(
        map(this.transformData)
      );
  }

  private transformData(resp: ProductsResponse) {
    const products: Products[] = resp.content.map(product => {
      return {
        id: product.id,
        active: product.active,
        code: product.code,
        name: product.name,
        description: product.description,
        image: product.image,
        size: product.size,
        brand: product.brand,
        purchase_price: product.purchase_price,
        sale_price: product.sale_price,
        stock: product.stock,
        category: product.category
      }
    })
    return products;
  }

  public getProductById(id: number) {
    return this.http.get(`${baseUrl}/products/${id}`)
  }

  public newProduct(product: NewProducts) {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('file', product.image);
    formData.append('size', product.size.toString());
    formData.append('brand', product.brand);
    formData.append('purchase_price', product.purchase_price.toString());
    formData.append('sale_price', product.sale_price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoryId', product.category.toString());

    return this.http.post(`${baseUrl}/products`, formData);
  }

  public updateProduct(product: Products) {
    return this.http.put(`${baseUrl}/products/${product.id}`, product)
  }

  public activateProduct(id: number) {
    return this.http.patch(`${baseUrl}/products/activate/${id}`, null)
  }

  public deleteProduct(id: number) {
    return this.http.delete(`${baseUrl}/products/${id}`)
  }
}
