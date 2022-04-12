import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private router: Router) { }

  public showAlert(title: string, text: string, icon: SweetAlertIcon, navigate?: string) {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      showClass: {
          popup: 'animate__animated animate__fadeIn'
        }
    }).then(() => {
      if(navigate) {
        this.router.navigateByUrl(navigate);
      }
    });
  }


  public showCuestion(text: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })
    return new Promise((resolve, reject) => {
      
      swalWithBootstrapButtons.fire({
        title: 'Estas seguro?',
        text,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Si',
        reverseButtons: true
      }).then((result: any) => {
        resolve(result);
      });

    });
  }
}
