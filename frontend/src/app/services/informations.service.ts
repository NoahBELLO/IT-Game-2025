import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformationsService {
  constructor(private http: HttpClient) { }

  informationsIP(ip: string): Observable<any> {
    const apiUrl: string = `https://localhost:3000/`;
    return this.http.get(apiUrl, {});
  }
}
