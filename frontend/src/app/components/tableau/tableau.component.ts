import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from '../popup/popup.component';
import { PopupInformationComponent } from '../popup-information/popup-information.component';
import { MatDialog } from '@angular/material/dialog';
import { ApivirustotalService } from '../../services/apivirustotal.service';
import { InformationsService } from '../../services/informations.service';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [NgFor, CommonModule, MatButtonModule],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.scss'
})
export class TableauComponent {
  constructor(private dialog: MatDialog, private virusTotalService: ApivirustotalService, private informations: InformationsService) { }

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

  openInformationIP(ip: string) {
    console.log("Ouverture de l'IP :", ip);
    this.informations.informationsIP(ip).subscribe({
      next: (response) => {
        this.dialog.open(PopupInformationComponent, {
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
