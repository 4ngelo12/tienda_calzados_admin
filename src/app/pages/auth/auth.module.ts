import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRouterModule } from './auth-router.module';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { RecoveryPasswordComponent } from './recovery-password';
import { ChangePasswordComponent } from './change-password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, LocalstorageService, UserService } from 'src/app/core/services';
import { ExternalModule, MaterialModule } from 'src/app/modules';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoveryPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ExternalModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRouterModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    RecoveryPasswordComponent,
    ChangePasswordComponent
  ],
  providers: [
    UserService,
    AuthService,
    LocalstorageService,
    
  ]
})
export class AuthModule { }
