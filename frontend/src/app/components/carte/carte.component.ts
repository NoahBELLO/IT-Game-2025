// import { Component, Input, OnInit } from '@angular/core';
// import { Map, tileLayer, marker, latLng, icon } from 'leaflet';

// @Component({
//   selector: 'app-carte',
//   templateUrl: './carte.component.html',
//   styleUrls: ['./carte.component.scss']
// })
// export class CarteComponent implements OnInit {
//   @Input() data: { ip: string, location: string, latitude: number, longitude: number, gravite: string }[] = [];

//   private map: Map | undefined;

//   // private customIconFaible = icon({
//   //   iconUrl: 'marqueurFaible.ico', // ou ton SVG
//   //   iconSize: [32, 48],
//   //   iconAnchor: [16, 48],
//   //   popupAnchor: [0, -48]
//   // });

//   private customIconMoyenne = icon({
//     iconUrl: 'marqueurMoyenne.ico', // ou ton SVG
//     iconSize: [10, 20],
//     iconAnchor: [16, 20],
//     popupAnchor: [0, -20]
//   });

//   // private customIconHaut = icon({
//   //   iconUrl: 'marqueurHaut.ico', // ou ton SVG
//   //   iconSize: [32, 48],
//   //   iconAnchor: [16, 48],
//   //   popupAnchor: [0, -48]
//   // });

//   ngOnInit(): void {
//     this.initMap();
//   }

//   private initMap(): void {
//     // Initialiser la carte avec les coordonnées par défaut
//     this.map = new Map('map').setView([51.505, -0.09], 2); // Zoom niveau 2 pour voir le monde entier

//     // Ajouter les tuiles OpenStreetMap
//     tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

//     // Ajouter des marqueurs pour chaque localisation
//     this.data.forEach(item => {
//       if (item.latitude && item.longitude) {
//         if (this.map) {
//           marker([item.latitude, item.longitude], { icon: this.customIconMoyenne })
//             .addTo(this.map)
//             .bindPopup(`<b>IP:</b> ${item.ip}<br><b>Location:</b> ${item.location}`);
//         }
//       }
//     });
//   }
// }
import { Component, Input, OnInit } from '@angular/core';
import { Map, tileLayer, marker, latLng, circleMarker } from 'leaflet';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements OnInit {
  @Input() data: { ip: string, location: string, latitude: number, longitude: number, gravite: string }[] = [];

  private map: Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialiser la carte avec les coordonnées par défaut
    this.map = new Map('map').setView([51.505, -0.09], 2); // Zoom niveau 2 pour voir le monde entier

    // Ajouter les tuiles OpenStreetMap
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Ajouter des marqueurs sous forme de cercles pour chaque localisation
    this.data.forEach(item => {
      if (item.latitude && item.longitude) {
        if (this.map) {
          // Définir la couleur en fonction de la gravité (par exemple)
          let circleColor: string;
          switch (item.gravite) {
            case 'Faible':
              circleColor = 'green'; // Couleur pour faible gravité
              break;
            case 'Moyenne':
              circleColor = 'orange'; // Couleur pour moyenne gravité
              break;
            case 'Haute':
              circleColor = 'red'; // Couleur pour haute gravité
              break;
            default:
              circleColor = 'blue'; // Couleur par défaut
          }

          circleMarker([item.latitude, item.longitude], {
            color: circleColor,
            radius: 5, // Taille du cercle
            fillColor: circleColor,
            fillOpacity: 1
          })
            .addTo(this.map)
            .bindPopup(`<b>IP:</b> ${item.ip}<br><b>Location:</b> ${item.location}`);
        }
      }
    });
  }
}
