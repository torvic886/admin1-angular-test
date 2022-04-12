import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = environment.url;

  constructor(private http: HttpClient) { }

  public getUsuarios(limite: number, pagina: number) {
    return this.http.get(`${this.url}/usuario?limite=${limite}&pagina=${pagina}`);
  }

  public buscarUsuario(busqueda: string) {
    return this.http.get(`${this.url}/usuario/buscar?nombre=${busqueda}`);
  }

  public ObtenerUsuarioById(id: string) {
    return this.http.get(`${this.url}/usuario/${id}`);
  }

  public GuardarUsuario(usuario: any) {
    return this.http.post(`${this.url}/usuario`, usuario);
  }
  

  public eliminarUsuario(id: string){
    return this.http.post(`${this.url}/usuario/${id}`, null);
  }
}
