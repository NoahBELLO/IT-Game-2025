import { Component } from '@angular/core';
import { ApiService } from '../../services/api-recuperation.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private apiService: ApiService) { }

  messageVisible: boolean = false;

  maj() {
    this.apiService.MAJLogs().subscribe({
      next: (response) => {
        console.log("Logs mis à jour avec succès", response);
        this.afficheMessage();
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour des logs", error);
      }
    });
  }

  afficheMessage(): void {
    this.messageVisible = true;
    setTimeout(() => { this.messageVisible = false; }, 1800);
  }
}