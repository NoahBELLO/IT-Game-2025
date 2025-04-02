// import { Component, Input, OnInit } from '@angular/core';
// import * as L from 'leaflet';

// @Component({
//   selector: 'app-carte',
//   standalone: true,
//   imports: [],
//   templateUrl: './carte.component.html',
//   styleUrl: './carte.component.scss'
// })
// export class CarteComponent implements OnInit {
//   @Input() data: any;
//   ngOnInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     const map = L.map('map', {
//       center: [51.505, -0.09], // Coordonnées initiales (latitude, longitude)
//       zoom: 13
//     });

//     // Ajouter une couche de tuiles (par exemple, OpenStreetMap)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);

//     // Ajouter un marqueur
//     L.marker([51.505, -0.09]).addTo(map)
//       .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//       .openPopup();
//   }
// }
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [],
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.scss'
})
export class CarteComponent implements OnInit, OnChanges {
  @Input() data: { ip: string, location: string, latitude: number, longitude: number }[] = [];

  private map!: L.Map;
  private markersLayer = L.layerGroup(); // Pour gérer les marqueurs

  ngOnInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.map) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [48.8566, 2.3522], // Coordonnées de départ (Paris)
      zoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map); // Ajouter la couche des marqueurs
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers();

    this.data.forEach(entry => {
      if (entry.latitude && entry.longitude) {
        const marker = L.marker([entry.latitude, entry.longitude])
          .bindPopup(`<b>${entry.ip}</b><br>${entry.location}`);
        this.markersLayer.addLayer(marker);
      }
    });
  }
}
