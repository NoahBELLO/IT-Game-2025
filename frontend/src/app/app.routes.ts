import { Routes } from '@angular/router';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { AccueilComponent } from './pages/accueil/accueil.component';

export const routes: Routes = [
    { path: '', component: AccueilComponent },
    { path: 'tableauDeBord', component: TableauDeBordComponent }
];
