import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './shared';
import { HomeComponent } from './pages';
import { AuthorizationGuard } from './core/guards';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', canActivate: [AuthorizationGuard], component: HomeComponent, pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages').then(m => m.ProductsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users').then(m => m.UsersModule)
  },
  {
    path: '**', component: NotfoundComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRouterModule { }
