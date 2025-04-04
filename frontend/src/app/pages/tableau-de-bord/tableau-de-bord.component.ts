import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeComponent } from '../../components/resume/resume.component';
import { TableauComponent } from '../../components/tableau/tableau.component';
import { GraphiqueComponent } from '../../components/graphique/graphique.component';
import { CarteComponent } from '../../components/carte/carte.component';
import { AffichageDonneService } from '../../services/affichage-donne.service';
import { LogData } from '../../interfaces/log-data';
import { PopupInformationComponent } from '../../components/popup-information/popup-information.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { GeoLocation } from '../../interfaces/geo-location';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ResumeComponent, TableauComponent, GraphiqueComponent, CarteComponent],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.scss'
})
export class TableauDeBordComponent implements OnInit {
  constructor(private affichageDonneService: AffichageDonneService, private dialog: MatDialog) { }
  views = [
    { label: 'Graphique', value: 'chart' },
    { label: 'Carte', value: 'map' },
    { label: 'Tableau', value: 'table' },
    { label: 'Résumé', value: 'summary' }
  ];
  dataSources = [
    { label: 'TCP', value: 'TCP' },
    { label: 'UDP', value: 'UDP' }
    // { label: 'Source C', value: 'sourceC' }
  ];

  selectedView = 'summary';
  selectedData = 'TCP';

  chartData: { labels: string[], values: number[] } = { labels: [], values: [] };
  mapData: { ip: string, location: string, latitude: number, longitude: number, gravite: string }[] = [];
  tableData: { source_ip: string, protocol: string, timestamp: string }[] = [];
  summaryData: { total_packets: number, unique_ips: number, top_protocol: string, malicious_ips_detected: number } = {
    total_packets: 0,
    unique_ips: 0,
    top_protocol: '',
    malicious_ips_detected: 0
  };

  // Méthode pour récupérer les données au démarrage
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    forkJoin({
      logs: this.affichageDonneService.uploadCsv(),
      count: this.affichageDonneService.countApi()
    }).subscribe(({ logs, count }) => {
      this.processData(logs, count);
    });
  }

  processData(data: LogData[], dataCount: { IP: string, Count: string, "Total Paquets": string, Protocoles: string, Pays: string, Ville: string, "Région": string, Drapeau: string }[]) {
    this.tableData = data.map(item => ({
      source_ip: item.IP,
      protocol: item.Protocol || 'Inconnu',
      timestamp: new Date().toISOString(),
      pays: item.Pays || 'Inconnu',
      ville: item.Ville || 'Inconnu',
      region: item["R\u00e9gion"] || 'Inconnu',
      gravite: item["Gravit\u00e9"] || 'Inconnu',
      dns: item.DNS || 'Inconnu',
      mitre_attack: item['MITRE ATT&CK'] || 'Inconnu',
    }));

    const protocolCount: { [key: string]: number } = {};
    dataCount.forEach(item => {
      const protocol = item.Protocoles || 'Inconnu';
      protocolCount[protocol] = (protocolCount[protocol] || 0) + 1;
    });

    const topProtocol = Object.keys(protocolCount).length > 0
      ? Object.keys(protocolCount).reduce((a, b) => protocolCount[a] > protocolCount[b] ? a : b)
      : 'Inconnu';

    this.chartData = {
      labels: data.map(item => item.IP),
      values: dataCount.map(item => parseInt(item.Count, 10) || 0)
    };

    this.summaryData = {
      total_packets: dataCount.reduce((acc, item) => acc + (parseInt(item.Count, 10) || 0), 0),
      unique_ips: data.length,
      top_protocol: topProtocol,
      malicious_ips_detected: data.filter(item => parseInt(item['VirusTotal'], 10) > 0).length
    };

    this.mapData = data.map(item => {
      // Extraire la latitude et la longitude à partir de la chaîne "Localisation"
      const [latitude, longitude] = item.Localisation ? item.Localisation.split(',').map(coord => parseFloat(coord.trim())) : [0, 0];

      return {
        ip: item.IP, // Utiliser l'IP de la ligne de log
        location: `${item.Ville || "Inconnu"}, ${item.Pays || "Inconnu"}`, // Concatenation de la ville et du pays
        latitude: !isNaN(latitude) ? latitude : 0, // Utiliser la latitude extraite, sinon mettre 0
        longitude: !isNaN(longitude) ? longitude : 0, // Utiliser la longitude extraite, sinon mettre 0
        gravite: item["Gravit\u00e9"]
      };
    });
  }

  informationsFlag(): void {
    this.affichageDonneService.informationFlag().subscribe({
      next: (response) => {
        console.log(response);
        this.dialog.open(PopupInformationComponent, {
          width: '500px',
          height: '270px',
          data: response
        });
      },
      error: (error) => {
        console.error("Erreur lors de la requête Flag :", error);
      }
    });
  }
}