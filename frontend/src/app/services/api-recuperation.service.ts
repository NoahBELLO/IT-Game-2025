import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://votre-api.com/maj';

  constructor(private http: HttpClient) { }

  MAJLogs(): Observable<any> {
    return this.http.get(this.apiUrl, {});
  }
}