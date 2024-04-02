import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login, User } from '../interfaces';
import baseUrl from './helper';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public register(user: User) {
    return this.http.post(`${baseUrl}/auth/register`, user);
  }

  public login(user: Login) {
    return this.http.post(`${baseUrl}/auth/login`, user);
  }

  public validateAdmin(): boolean {
    const token = localStorage.getItem('token');

    try {
      const helper = new JwtHelperService();
      const decodedToken = token ? helper.decodeToken(token) : null;

      if (decodedToken?.role !== 'ROLE_ADMIN') {
        return false;
      }
      
      return true;
    } catch (error) {
      Error('Error al obtener el token');
      console.log(error);
    }

    return true;
  }
}
