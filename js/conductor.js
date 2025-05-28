import { Vehiculo } from '/js/vehiculo.js'
import { Persona } from '/js/persona.js';   

 export class Conductor extends Persona {
    constructor({ nombres, apellidos, celular, documento, usuario, contrasena, email,licencia,vehiculoASignado,huella,fechaVencimiento }) {
        super({ nombres, apellidos, celular, documento, usuario, contrasena, email });
        this._licencia = licencia;
        this._vehiculoASignado = vehiculoASignado;  
        this._huella = huella;
        this._fechaVencimiento = fechaVencimiento;
    }

 
    set setLicencia(licencia) {
        this._licencia = licencia;
    }
    get getLicencia() {
        return this._licencia;
    }   
    set setVehiculoASignado(vehiculoASignado) {
        this._vehiculoASignado = vehiculoASignado;
    }
    get getVehiculoASignado() {
        return this._vehiculoASignado;
    }
    set setHuella(huella) {
        this._huella = huella;
    }
    get getHuella() {
        return this._huella;
    }
    set setFechaVencimiento(fechaVencimiento) {
        this._fechaVencimiento = fechaVencimiento;
    }
    get getFechaVencimiento() {
        return this._fechaVencimiento;
    }
    

}