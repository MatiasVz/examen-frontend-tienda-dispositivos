import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contactos',
  imports: [FormsModule],
  templateUrl: './contactos.html'
})
export class Contactos {


  nombre = '';
  email = '';
  mensaje = '';
  telefono='';

  enviarCorreo() {
    const templateParams = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje,
      telefono:this.telefono
    };
    emailjs.send(
      'jvelasquezucacue',
      'templatemv',
      templateParams,
      '-h0E_WcHFa6CZYdHX'
    ).then(
      (response) => {
        console.log('Correo enviado', response.status, response.text);
        alert('¡Correo enviado con éxito!');
      },
      (error) => {
        console.error('Error al enviar el correo', error);
        alert('Hubo un error al enviar el correo.');
      }
    );
  }

}
