import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogData } from '../interfaces/log-data';
import { GeoLocation } from '../interfaces/geo-location';

@Injectable({
  providedIn: 'root'
})
export class AffichageDonneService {
  private apiUrl = 'http://localhost:3000/affichage';
  private apiKey = 'ca1ddc5f5d544b97a5c55eaf6f57dcb3';
  private apiLocalisation = 'http://api_logs:5001/logs/localisation';
  private apiUrlCount = 'http://localhost:3000/count';
  private apiUrlFlag = 'http://localhost:3000/flag';

  constructor(private http: HttpClient) { }

  uploadCsv(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.apiUrl, {});
  }

  countApi(): Observable<any> {
    return this.http.get<{ IP: string, Count: string, "Total Paquets": string, Protocoles: string, Pays: string, Ville: string, "Région": string, Drapeau: string }[]>(this.apiUrlCount, {});
  }

  informationFlag(): Observable<any> {
    return this.http.get<LogData[]>(this.apiUrlFlag, {});
  }

  getIpLocation(ipList: string[]): Observable<GeoLocation[]> {
    return this.http.post<GeoLocation[]>(this.apiLocalisation, { ips: ipList });
  }
}
