import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRouterModule } from './auth-router.module';
import { LoginComponent } from './login';
import { RecoveryPasswordComponent } from './recovery-password';
import { ChangePasswordComponent } from './change-password';
import { AuthService, LocalstorageService, UserService } from 'src/app/core/services';
import { ExternalModule, FormModule, MaterialModule } from 'src/app/modules';



@NgModule({
  declarations: [
    LoginComponent,
    RecoveryPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ExternalModule,
    MaterialModule,
    FormModule,
    AuthRouterModule,
  ],
  exports: [
    LoginComponent,
    RecoveryPasswordComponent,
    ChangePasswordComponent
  ],
  providers: [
    UserService,
    AuthService,
    LocalstorageService
  ]
})
export class AuthModule { }
