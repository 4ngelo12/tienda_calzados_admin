import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound';
import { NavbarComponent } from './navbar/navbar.component';
import { UnauthorizedComponent } from './unauthorized';
import { MaterialModule } from '../modules';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    NotfoundComponent,
    UnauthorizedComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NotfoundComponent,
    NavbarComponent,
    UnauthorizedComponent,
    FooterComponent
  ]
})
export class SharedModule { }
