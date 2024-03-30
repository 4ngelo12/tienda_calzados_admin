import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { AdminRouterModule } from './admin-router.module';
import { ExternalModule, MaterialModule } from 'src/app/modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ExternalModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRouterModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class AdminModule { }
