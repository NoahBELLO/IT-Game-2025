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
  messageErreurVisible: boolean = false;
  messageVisibleConversion: boolean = false;
  messageErreurVisibleConversion: boolean = false;

  maj() {
    this.apiService.MAJLogs().subscribe({
      next: (response) => {
        console.log("Logs mis à jour avec succès", response);
        this.afficheMessage();
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour des logs", error);
        this.afficheMessageErreur();
      }
    });
  }

  conversion() {
    this.apiService.convertion().subscribe({
      next: (response) => {
        console.log("Logs converti avec succès", response);
        this.afficheMessageConversion();
      },
      error: (error) => {
        console.error("Erreur lors de la conversion des logs", error);
        this.afficheMessageErreurConversion();
      }
    });
  }

  afficheMessage(): void {
    this.messageVisible = true;
    setTimeout(() => { this.messageVisible = false; }, 1800);
  }

  afficheMessageErreur(): void {
    this.messageErreurVisible = true;
    setTimeout(() => { this.messageErreurVisible = false; }, 1800);
  }

  afficheMessageConversion(): void {
    this.messageVisibleConversion = true;
    setTimeout(() => { this.messageVisibleConversion = false; }, 1800);
  }

  afficheMessageErreurConversion(): void {
    this.messageErreurVisibleConversion = true;
    setTimeout(() => { this.messageErreurVisibleConversion = false; }, 1800);
  }
}