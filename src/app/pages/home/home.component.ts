import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public cargando = false;
  public isUsuarios = true;
  public pagina = 1;
  private limite = 5;
  public totalRegistros = 0;
  public usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService,
              private alert: AlertService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  private obtenerUsuarios(){
    this.cargando = true;
    this.usuarioService.getUsuarios(this.limite, this.pagina).subscribe((resp: any) => {
      this.cargando = false;
      if(resp.ok) {
        this.totalRegistros = resp.registros;
        if(resp.results === 0) {
          this.isUsuarios = false;
          this.pagina--;
        } else {
          this.isUsuarios = true;
          this.usuarios = resp.usuarios;
        }
      }
    }, error => {
      this.cargando = false;
      this.alert.showAlert('Usuarios',error.error, 'error');
    });
  }

  public buscarUsuario(busqueda: string) {
    if(busqueda !== '') {
      this.cargando = true;
      this.usuarioService.buscarUsuario(busqueda).subscribe((resp: any) => {
        this.cargando = false;
        if(resp.length !== 0) {
          this.usuarios = resp;
          this.totalRegistros = resp.length;
          this.pagina = 1;
        }
      }, error => {
        this.cargando = false;
        this.alert.showAlert('Usuarios',error.error, 'error');
      });
    } else {
      this.obtenerUsuarios();
    }
  }

  public crearUsuario(){    
    this.router.navigate(['/usuario', 'crear']);
  }

  public actualizarUsuario(id: string) {    
    this.router.navigate(['/usuario', id]);
  }

  public eliminarUsuario(usuario: Usuario){
    this.alert.showCuestion(`Desea eliminar a ${usuario.nombre}`).then((result: any) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe((resp: any) => {
          console.log(resp);
          if(resp.includes('elimino')) {
            this.alert.showAlert('Eliminar', resp, 'success');
            this.obtenerUsuarios();
          } else {
            this.alert.showAlert('Eliminar', resp, 'error');
          }
        }, error => {
          if(error.status === 200) {
            if(error.error.text.includes('elimino')) {
              this.alert.showAlert('Eliminar', error.error.text, 'success');
              this.obtenerUsuarios();
            } else {
              this.alert.showAlert('Eliminar', error.error.text, 'error');
            }
          } else {
            if(error.error.mensaje) {
              this.alert.showAlert('Eliminar',error.error.mensaje, 'error');
            } else {
              this.alert.showAlert('Error','Hubo un problema', 'error');
            }
          }
        });
      }
    });
  }

  public adelantarPagina() {
    if(this.isUsuarios) {
      this.pagina++;
      this.obtenerUsuarios();
    }
  };

  public atrasPagina() {
    if(this.pagina > 1) {
      this.pagina--;
      this.obtenerUsuarios();
    }
  }

}
