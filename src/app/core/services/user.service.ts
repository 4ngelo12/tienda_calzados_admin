import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../interfaces/helper';
import { AllUsers, RecoveryPassword, ResetPassword, UpdateUser, UsersResponse } from '../interfaces';
import { Observable, map } from 'rxjs';

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

  public getUsers(id: number): Observable<AllUsers[]> {
    return this.http.get<UsersResponse>(`${baseUrl}/user/all?id=${id}`)
      .pipe(
        map(this.transformData)
      );
  }

  private transformData(resp: UsersResponse) {
    const users: AllUsers[] = resp.content.map(users => {
      return {
        id: users.id,
        name: users.name,
        lastname: users.lastname,
        email: users.email,
        birthdate: users.birthdate,
        active: users.active,
        role: users.role
      }
    })
    return users;
  }


  // Actualizar datos del User
  public updateUser(user: UpdateUser) {
    return this.http.patch(`${baseUrl}/user/${user.id}`, user);
  }

  public updatePassword(user: ResetPassword) {
    return this.http.patch(`${baseUrl}/user/reset-password`, user);
  }

  // Activar User
  public activateUser(id: number) {
    return this.http.patch(`${baseUrl}/user/activate/${id}`, null);
  }

  // Eliminar User
  public deleteUser(id: number) {
    return this.http.delete(`${baseUrl}/user/${id}`);
  }
}
