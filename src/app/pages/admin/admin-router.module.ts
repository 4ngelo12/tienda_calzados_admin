import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/core/guards';
import { ProfileComponent } from './profile';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile', canActivate: [AuthorizationGuard], component: ProfileComponent
      }
    ]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRouterModule { }
