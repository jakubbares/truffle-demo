import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DataComponent} from "./pages/data/data.page";


export const router: Routes = [
  { path: '', redirectTo: 'data', pathMatch: 'full' },
  { path: 'data', component: DataComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
