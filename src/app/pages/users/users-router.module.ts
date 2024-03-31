import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard, WithoutSaveGuard } from 'src/app/core/guards';
import { CreateComponent } from './create';
import { ListComponent } from './list';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create', canActivate: [AuthorizationGuard], canDeactivate: [WithoutSaveGuard],
        component: CreateComponent
      },
      { path: 'list', canActivate: [AuthorizationGuard], component: ListComponent },
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
export class UsersRouterModule { }
