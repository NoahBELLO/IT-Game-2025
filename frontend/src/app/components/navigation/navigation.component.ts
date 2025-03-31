import { Component } from '@angular/core';
import { ApiService } from '../../services/api-recuperation.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private apiService: ApiService) { }

  maj() {
    console.log("Mise à jour des données...");
    // this.apiService.MAJLogs().subscribe({
    //   next: (response) => {
    //     console.log("Logs mis à jour avec succès", response);
    //   },
    //   error: (error) => {
    //     console.error("Erreur lors de la mise à jour des logs", error);
    //   }
    // });
  }

  dashboard() {
    console.log("Tableau de bord...");
  }
}