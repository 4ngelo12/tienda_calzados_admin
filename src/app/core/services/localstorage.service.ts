import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

    //Guardar token de inicio de sesion
    public setToken(token: any) {
      localStorage.setItem('token', token);
      return true;
    }
  
    // Obtener token de inicio de sesion
    public getToken() {
      return localStorage.getItem('token');
    }
  
    // Guardar datos de la sesion
    public setUser(user: any) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  
    public getUser() {
      return JSON.parse(localStorage.getItem('user')!);
    }
  
    // Eliminar token de inicio de sesion
    public deleteToken() {
      localStorage.removeItem('token');
    }
    
    // Eliminar los datos de la sesion del usuario
  
    public deleteUser() {
  
      localStorage.removeItem('user');
    }
  
    public logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  
    // Validar la vigencia del token
    public validateToken(): boolean {
      const token = localStorage.getItem('token');
  
      if (!token) {
        return false;
      }
  
      try {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        if (helper.isTokenExpired(token)) {
          localStorage.clear();
          return false;
        }
        if (!decodedToken) {
          localStorage.clear();
  
          return false;
        }
      } catch (error) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    }
}
