import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIbanDeComponent } from './mat-iban-de/mat-iban-de.component';



@NgModule({
  declarations: [MatIbanDeComponent],
  exports: [
    MatIbanDeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MatIbanModule { }
