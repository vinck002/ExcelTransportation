import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExcelCalculatorComponent } from './excel-calculator/excel-calculator.component';


const routes: Routes = [
  { path: '', component:ExcelCalculatorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
