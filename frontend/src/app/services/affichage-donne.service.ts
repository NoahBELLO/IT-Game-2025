import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogData } from '../interfaces/log-data';

@Injectable({
  providedIn: 'root'
})
export class AffichageDonneService {
  private apiUrl = 'http://localhost:3000/affichage';
  private apiKey = 'ca1ddc5f5d544b97a5c55eaf6f57dcb3';
  private apiLocalisation = 'https://api.ipgeolocation.io/ipgeo';

  constructor(private http: HttpClient) { }

  uploadCsv(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.apiUrl, {});
  }

  getIpLocation(ip: string): Observable<any> {
    return this.http.get(`${this.apiLocalisation}?apiKey=${this.apiKey}&ip=${ip}`);
  }
}
