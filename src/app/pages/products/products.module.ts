import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list';
import { CreateComponent } from './create';
import { UpdateComponent } from './update';
import { ProductsRouterModule } from './products-router.module';
import { ExternalModule, MaterialModule } from 'src/app/modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRouterModule } from '../auth/auth-router.module';
import { ProductsService } from 'src/app/core/services';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    ProductsRouterModule,
    ExternalModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRouterModule,
  ],
  exports: [
    ListComponent,
    CreateComponent,
    UpdateComponent
  ],
  providers: [
    ProductsService
  ]
})
export class ProductsModule { }