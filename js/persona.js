 export class Persona {
  constructor({nombres, apellidos, celular, documento, usuario, contrasena,email}){
    this._nombres = nombres;
    this._apellidos = apellidos;    
    this._celular = celular;
    this._documento = documento;
    this._usuario = usuario;  
    this._contrasena = contrasena;
    this._email = email;  

  }
  set setnombres(nombres) {
    this._nombres = nombres;
  }
  get getnombres() {
    return this._nombres;
  }
  set setapellidos(apellidos) {
    this._apellidos = apellidos;
  }
  get getapellidos() {
    return this._apellidos;
  } 
  set setcelular(celular) {
    this._celular = celular;
  } 
  get getcelular() {
    return this._celular;
  }
  set setdocumento(documento) {
    this._documento = documento;
  }
  get getdocumento() {
    return this._documento;
  }
  set setusuario(usuario) {
    this._usuario = usuario;
  }
  get getusuario() {
    return this._usuario;
  }
  set setcontrasena(contrasena) {
    this._contrasena = contrasena;
  }
  get getcontrasena() {
    return this._contrasena;
  }
  set setemail(email) {
    this._email = email;
  } 
  get getemail() {
    return this._email;
  } 

}