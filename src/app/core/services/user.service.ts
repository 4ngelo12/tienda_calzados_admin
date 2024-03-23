import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../interfaces/helper';
import { RecoveryPassword, ResetPassword, UpdateUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient ) { }

  public sendEmail(data: RecoveryPassword) {
    return this.http.post(`${baseUrl}/sendMail`, data);
  }

  public getUserByEmail(email: string) {
    return this.http.get(`${baseUrl}/user/email`, { params: { email } });
  }

  // Obtener datos del User
  public getCurrentUser() {
    return this.http.get(`${baseUrl}/user`);
  }

  // Actualizar datos del User
  public updateUser(user: UpdateUser) {
    return this.http.patch(`${baseUrl}/user/${user.id}`, user);
  }

  public updatePassword(user: ResetPassword) {
    return this.http.patch(`${baseUrl}/user/reset-password`, user);
  }

  // Eliminar User
  public deleteUser(id: number) {
    return this.http.delete(`${baseUrl}/user/${id}`);
  }
}
