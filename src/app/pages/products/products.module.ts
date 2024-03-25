import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list';
import { CreateComponent } from './create';
import { UpdateComponent } from './update';
import { ProductsRouterModule } from './products-router.module';
import { MaterialModule } from 'src/app/modules';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    ProductsRouterModule,
    MaterialModule
  ],
  exports: [
    ListComponent,
    CreateComponent,
    UpdateComponent
  ]
})
export class ProductsModule { }
