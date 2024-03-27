import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../interfaces/helper';

@Injectable({
  providedIn: 'root'
})
export class CateoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(`${baseUrl}/category`);
  }
}
