import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeComponent } from '../../components/resume/resume.component';
import { TableauComponent } from '../../components/tableau/tableau.component';
import { GraphiqueComponent } from '../../components/graphique/graphique.component';
import { CarteComponent } from '../../components/carte/carte.component';
import { AffichageDonneService } from '../../services/affichage-donne.service';
import { LogData } from '../../interfaces/log-data';

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
    // { label: 'Carte', value: 'map' },
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
  // mapData: { ip: string, location: string, latitude: number, longitude: number }[] = [];
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

  // isPrivateIp(ip: string): boolean {
  //   return /^10\./.test(ip) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) || /^192\.168\./.test(ip);
  // }


  fetchData(): void {
    this.affichageDonneService.uploadCsv().subscribe((data: LogData[]) => {
      // Mappage des données reçues dans le format que vous voulez
      this.chartData = {
        labels: data.map(item => item.IP),
        values: data.map(item => parseInt(item.Count, 10))
        // labels: filteredData.map(item => item.IP),
        // values: filteredData.map(item => parseInt(item.Count, 10))
      };

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

      // this.tableData = filteredData.map(item => ({
      //   source_ip: item.IP,
      //   protocol: item.Protocol || 'Inconnu',
      //   timestamp: new Date().toISOString(),
      //   pays: item.Pays || 'Inconnu',
      //   ville: item.Ville || 'Inconnu',
      //   region: item.Region || 'Inconnu',
      //   gravite: item.Gravite || 'Inconnu',
      //   dns: item.DNS || 'Inconnu',
      //   mitre_attack: item['MITRE ATT&CK'] || 'Inconnu',
      // }));

      this.summaryData = {
        total_packets: data.reduce((acc, item) => acc + parseInt(item.Count, 10), 0),
        // total_packets: filteredData.reduce((acc, item) => acc + parseInt(item.Count, 10), 0),
        unique_ips: data.length,
        // unique_ips: filteredData.length,
        top_protocol: "TCP",
        malicious_ips_detected: data.filter(item => parseInt(item['VirusTotal Positives'], 10) > 0).length
        // malicious_ips_detected: filteredData.filter(item => parseInt(item['VirusTotal Positives'], 10) > 0).length
      };

      // this.mapData = [];
      // data.forEach(item => {
      //   // if (!this.isPrivateIp(item.IP)) {
      //   this.affichageDonneService.getIpLocation(item.IP).subscribe(response => {
      //     if (response.latitude && response.longitude) {
      //       this.mapData.push({
      //         ip: item.IP,
      //         location: `${response.city}, ${response.country_name}`,
      //         latitude: response.latitude,
      //         longitude: response.longitude
      //       })
      //     }
      //   });
      //   // }
      // });

      // filteredData.forEach(item => {
      //   if (!this.isPrivateIp(item.IP)) {
      //     this.affichageDonneService.getIpLocation(item.IP).subscribe(response => {
      //       if (response.latitude && response.longitude) {
      //         this.mapData.push({
      //           ip: item.IP,
      //           location: `${response.city}, ${response.country_name}`,
      //           latitude: response.latitude,
      //           longitude: response.longitude
      //         })
      //       }
      //     });
      //   }
      // });
    })
  }

  informationsFlag(): void {
    console.log("Informations sur le flag");
    //Fonction qui permet de vérifier dans tout le tableau les ips adress, avec les informations suivant : 
    // mac adress, ip adress, hostname et windows user
  }
}