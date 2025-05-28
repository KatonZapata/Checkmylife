export class Vehiculo {
    constructor({ placa, marca, modelo }) {
        this._placa = placa;
        this._marca = marca;
        this._modelo = modelo;
    }

    get getPlaca() {
        return this._placa;
    }
    get getMarca() {
        return this._marca;
    }
    get getModelo() {
        return this._modelo;
    }
}