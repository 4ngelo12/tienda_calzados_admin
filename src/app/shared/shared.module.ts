import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound';
import { NavbarComponent } from './navbar/navbar.component';
import { UnauthorizedComponent } from './unauthorized';
import { MaterialModule } from '../modules';



@NgModule({
  declarations: [
    NotfoundComponent,
    UnauthorizedComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NotfoundComponent,
    NavbarComponent,
  ]
})
export class SharedModule { }
