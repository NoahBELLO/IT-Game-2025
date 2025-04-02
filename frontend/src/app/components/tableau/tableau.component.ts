import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api-recuperation.service';
import { ApivirustotalService } from '../../services/apivirustotal.service';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [NgFor, CommonModule, MatButtonModule],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.scss'
})
export class TableauComponent {
  constructor(private dialog: MatDialog, private virusTotalService: ApivirustotalService) { }

  @Input() data: any;

  openVirusTotal(ip: string) {
    this.virusTotalService.virusTotalRequete(ip).subscribe({
      next: (response) => {
        this.dialog.open(PopupComponent, {
          width: '500px',
          height: '400px',
          data: response.data
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête VirusTotal :", error);
      }
    })
  }
}
