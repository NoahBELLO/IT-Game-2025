import { Component, Input, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-graphique',
  standalone: true,
  imports: [],
  templateUrl: './graphique.component.html',
  styleUrl: './graphique.component.scss'
})
export class GraphiqueComponent implements AfterViewInit {
  @Input() data: any;

  ngAfterViewInit() {
    new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: this.data.labels,
        datasets: [{
          label: 'Nombre de paquets',
          data: this.data.values,
          backgroundColor: 'rgba(0, 255, 204, 0.5)',
          borderColor: '#00ffcc',
          borderWidth: 1
        }]
      }
    });
  }
}