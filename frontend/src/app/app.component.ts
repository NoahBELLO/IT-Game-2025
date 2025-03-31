import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet/*,  AccueilComponent */, NavigationComponent/* , TableauDeBordComponent */], //RouterOutlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AegisSécurité';
}
