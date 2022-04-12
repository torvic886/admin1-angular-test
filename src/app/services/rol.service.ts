import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = environment.url;
  
  constructor(private http: HttpClient) { }

  public getRoles() {
    return this.http.get(`${this.url}/rol`);
  }
}
