import  Persona  from './persona.js';   

export class Coordinador extends Persona {
    constructor(nombres, apellidos, celular, documento, usuario, contrasena, email) {
        super(nombres, apellidos, celular, documento, usuario, contrasena, email);
    }

    claveErrada (tipo = "error", duracion = 3000){
    return super.claveErrada(tipo , duracion) ;
    }
    mensajelogin (tipo = "exito", duracion = 3000){
    return super.mensajelogin(tipo, duracion ) ;
    }

 
}