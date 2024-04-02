import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  public getBestSellingProduct() {
    return this.http.get(`${baseUrl}/sale/best-selling`);
  }

  public getTotalSalesByMonth(month: number, year: number) {
    return this.http.get(`${baseUrl}/sale/total-sales?month=${month}&year=${year}`);
  }
}
