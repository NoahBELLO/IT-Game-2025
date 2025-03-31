import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tableau-de-bord',
  imports: [NgFor],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.scss'
})
export class TableauDeBordComponent {
  constructor() {
    setInterval(() => {
      this.data = this.data.map(item => ({
        ...item,
        value: item.value + Math.floor(Math.random() * 5)
      }));

      this.lineChartData[0].series.push({
        name: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 20)
      });

      this.lineChartData = [...this.lineChartData]; // Rafraîchir l'affichage
    }, 5000); // Mise à jour toutes les 5 secondes
  };
  data = [
    { name: 'IP Malveillantes', value: 23 },
    { name: 'Incidents détectés', value: 50 },
    { name: 'Machines ciblées', value: 10 }
  ];

  lineChartData = [
    {
      name: 'Attaques', series: [
        { name: '10:00', value: 5 },
        { name: '11:00', value: 15 },
        { name: '12:00', value: 8 }
      ]
    }
  ];
}
