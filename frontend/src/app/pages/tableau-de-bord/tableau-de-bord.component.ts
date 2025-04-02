import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeComponent } from '../../components/resume/resume.component';
import { TableauComponent } from '../../components/tableau/tableau.component';
import { GraphiqueComponent } from '../../components/graphique/graphique.component';
import { CarteComponent } from '../../components/carte/carte.component';
import { AffichageDonneService } from '../../services/affichage-donne.service';

interface LogData {
  IP: string;
  Count: string;
  Pays: string;
  Ville: string;
  Région: string;
  "VirusTotal Positives": string;
  "VirusTotal Total": string;
}

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ResumeComponent, TableauComponent, GraphiqueComponent, CarteComponent],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.scss'
})
export class TableauDeBordComponent implements OnInit {
  constructor(private affichageDonneService: AffichageDonneService) { }
  views = [
    { label: 'Graphique', value: 'chart' },
    { label: 'Carte', value: 'map' },
    { label: 'Tableau', value: 'table' },
    { label: 'Résumé', value: 'summary' }
  ];
  dataSources = [
    { label: 'Source A', value: 'sourceA' },
    { label: 'Source B', value: 'sourceB' },
    { label: 'Source C', value: 'sourceC' }
  ];

  selectedView = 'chart';
  selectedData = 'sourceA';

  chartData: { labels: string[], values: number[] } = { labels: [], values: [] };
  mapData: { ip: string, location: string }[] = [];
  tableData: { source_ip: string, dest_ip: string, protocol: string, timestamp: string }[] = [];
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
    this.affichageDonneService.uploadCsv().subscribe((data: LogData[]) => {
      // Mappage des données reçues dans le format que vous voulez
      this.chartData = {
        labels: data.map(item => item.Pays),
        values: data.map(item => parseInt(item.Count, 10))
      };

      this.mapData = data.map(item => ({
        ip: item.IP,
        location: `${item.Ville}, ${item.Pays}`
      }));

      this.tableData = data.map(item => ({
        source_ip: item.IP,
        dest_ip: '',  // Ajoutez une logique si vous avez un champ "dest_ip"
        protocol: 'TCP',  // Fixé à 'TCP' ici, mais à adapter
        timestamp: new Date().toISOString()
      }));

      this.summaryData = {
        total_packets: data.reduce((acc, item) => acc + parseInt(item.Count, 10), 0),
        unique_ips: data.length,
        top_protocol: 'TCP',  // Fixé à 'TCP', à adapter si besoin
        malicious_ips_detected: data.filter(item => parseInt(item['VirusTotal Positives'], 10) > 0).length
      };
    });
  }
}