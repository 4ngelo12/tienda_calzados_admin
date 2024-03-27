import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create';
import { ListComponent } from './list';
import { UpdateComponent } from './update';
import { AuthorizationGuard, WithoutSaveGuard } from 'src/app/core/guards';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create', canActivate: [AuthorizationGuard], canDeactivate: [WithoutSaveGuard],
        component: CreateComponent
      },
      { path: 'list', canActivate: [AuthorizationGuard], component: ListComponent },
      { path: 'update/:id', canActivate: [AuthorizationGuard], component: UpdateComponent }
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
export class ProductsRouterModule { }
