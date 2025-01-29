import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';


const formModules = [ReactiveFormsModule, MatFormFieldModule]

@NgModule({
  imports: [formModules],
  exports: [formModules]
})
export class FormsModule { }
