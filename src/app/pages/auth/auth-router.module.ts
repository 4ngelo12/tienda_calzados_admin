import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ChangePasswordComponent } from './change-password';
import { RecoveryPasswordComponent } from './recovery-password';
import { WithoutSaveGuard } from 'src/app/core/guards';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', canDeactivate: [WithoutSaveGuard], component: LoginComponent },
      { path: 'register',  canDeactivate: [WithoutSaveGuard], component: RegisterComponent },
      { path: 'change-password/:id', component: ChangePasswordComponent },
      { path: 'recovery-password', canDeactivate: [WithoutSaveGuard], component: RecoveryPasswordComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRouterModule { }
