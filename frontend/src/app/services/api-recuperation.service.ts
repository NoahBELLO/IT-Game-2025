import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/logs/';

  constructor(private http: HttpClient) { }

  MAJLogs(): Observable<any> {
    return this.http.get(this.apiUrl, {});
  }
}