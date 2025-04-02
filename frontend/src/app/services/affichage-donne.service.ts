import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LogData {
  IP: string;
  Count: string;
  Pays: string;
  Ville: string;
  Région: string;
  "VirusTotal Positives": string;
  "VirusTotal Total": string;
}

@Injectable({
  providedIn: 'root'
})
export class AffichageDonneService {
  private apiUrl = 'http://localhost:3000/affichage';

  constructor(private http: HttpClient) { }

  uploadCsv(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.apiUrl, {});
  }
}
