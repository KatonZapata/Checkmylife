import  Persona  from './persona.js';   

 export class Conductor extends Persona {
    constructor( nombres, apellidos, celular, documento, usuario, contrasena, email,licencia) {
        super( nombres, apellidos, celular, documento, usuario, contrasena, email );
        this._licencia = licencia;  
    }

    set licencia(licencia) {
    this._licencia = licencia;
    }
    get licencia() {
    return this._licencia;
    }

    claveErrada (tipo = "error", duracion = 3000){
        return super.claveErrada(tipo , duracion) ;
    }
    mensajelogin (tipo = "exito", duracion = 3000){
        return super.mensajelogin(tipo, duracion ) ;
    }

}