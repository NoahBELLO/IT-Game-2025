import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApivirustotalService {

  private apiKey: string = "9896edffe19fb69138b00792d7435b83e9bb177cd53a5e2396a64ba72fa8e6e3";

  constructor(private http: HttpClient) { }

  virusTotalRequete(ip: string): Observable<any> {
    const apiUrl: string = `https://www.virustotal.com/api/v3/ip_addresses/${ip}`;
    return this.http.get(apiUrl, {
      headers: {
        'x-apikey': this.apiKey
      }
    });
  }
}