import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';



@NgModule({
  declarations: [
    NotfoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotfoundComponent
  ]
})
export class SharedModule { }
