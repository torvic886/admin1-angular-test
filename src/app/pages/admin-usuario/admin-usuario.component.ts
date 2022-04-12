import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from 'src/app/interfaces/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css']
})
export class AdminUsuarioComponent implements OnInit {
  public usuarioForm: FormGroup;
  public btnText: string = '';
  private id: string = '';
  public roles: Rol[] = [];
  public estados = [{activo: true, nombre: 'Activo'},{activo: false, nombre: 'inactivo'}];
  
  constructor(private form: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioServices: UsuarioService,
              private rolServices: RolService,
              private alert: AlertService) {

    this.usuarioForm = this.form.group({
      id: [{value: '', disabled: true},  ],
      nombre: ['', Validators.required],
      rol: ['', Validators.required ],
      activo: [ true , Validators.required ],
    });

  }

  ngOnInit(): void {
    this.obtenerRoles();

    this.activatedRoute.params.subscribe(({id}) => {
      if(id !== 'crear') {
        this.id = id;
        this.obtenerUsuario(id);
      } else {
        this.btnText = 'Guardar';
      }
    });
  }

  public obtenerRoles() {
    this.rolServices.getRoles().subscribe((resp: any) => {
      if(resp.length !== 0) {
        this.roles = resp;
        console.log(this.roles);
      }
    }, error => {
      this.alert.showAlert('Listar Roles',error.error, 'error');
    });
  }

  public obtenerUsuario(id: string) {
    this.usuarioServices.ObtenerUsuarioById(id).subscribe((resp: any) => {
      if(resp) {
        this.usuarioForm.setValue({
          id: resp.id,
          nombre: resp.nombre,
          rol: resp.rol.id,
          activo: resp.activo,
        });
        this.btnText = 'Actualizar';
      } else {
        this.alert.showAlert('Usuario','No existe el usuario', 'error');
        this.btnText = 'Guardar';
      }
    }, error => {
      this.btnText = 'Guardar';
      if(error.status === 400) {
        this.alert.showAlert('Usuario',error.error.result, 'error');
      } else {
        this.alert.showAlert('usuario',error.error.error.message, 'error');
      }
    });
  }

  public accionUsuario() {
    if(this.btnText === 'Guardar') {
      this.guardarUsuario();
    } else {
      this.actualizarUsuario();
    }
  }

  public guardarUsuario() {
    const usuario = {
      nombre: this.usuarioForm.value.nombre,
      rol: {id: this.usuarioForm.value.rol},
      activo: this.usuarioForm.value.activo,
    }
    this.usuarioServices.GuardarUsuario(usuario).subscribe((resp: any) => {
        this.alert.showAlert('Crear Usuario', 'Registro creado', 'success');
        this.usuarioForm.setValue({
          id: resp.id,
          nombre: resp.nombre,
          rol: resp.rol.id,
          activo: resp.activo,
        });
        this.router.navigate(['/home']);
    }, error => {
      this.alert.showAlert('Crear Usuario', error.error, 'error');
    });
  }

  public actualizarUsuario() {
    const usuario = {
      id: this.id,
      nombre: this.usuarioForm.value.nombre,
      rol: {id: this.usuarioForm.value.rol},
      activo: this.usuarioForm.value.activo,
    }
    console.log(usuario);debugger
    this.usuarioServices.GuardarUsuario(usuario).subscribe((resp: any) => {
        this.alert.showAlert('Actualizar usuario', 'Registro Actualizado', 'success');
    }, error => {
      this.alert.showAlert('Actualizar usuario', error.error, 'error');
    });
  }

  public cancelar() {
    this.router.navigate(['/home']);
  }

}
