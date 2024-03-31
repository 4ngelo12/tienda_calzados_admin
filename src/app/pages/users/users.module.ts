import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list';
import { CreateComponent } from './create';
import { UsersRouterModule } from './users-router.module';
import { ExternalModule, FormModule, MaterialModule } from 'src/app/modules';
import { UserService } from 'src/app/core/services';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormModule,
    MaterialModule,
    ExternalModule,
    UsersRouterModule
  ],
  exports: [
    ListComponent,
    CreateComponent
  ], 
  providers: [
    UserService
  ]
})
export class UsersModule { }
