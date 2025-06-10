 export default class Persona {
  constructor(nombres, apellidos, celular, documento, usuario, contrasena,email){
    this._nombres = nombres;
    this._apellidos = apellidos;
    this._celular = celular;
    this._documento = documento;
    this._usuario = usuario;
    this._contrasena = contrasena;
    this._email = email;

  }
   get nombres() { return this._nombres; }
  set nombres(nombres) { this._nombres = nombres; }

  get apellidos() { return this._apellidos; }
  set apellidos(apellidos) { this._apellidos = apellidos; }

  get celular() { return this._celular; }
  set celular(celular) { this._celular = celular; }

  get documento() { return this._documento; }
  set documento(documento) { this._documento = documento; }

  get usuario() { return this._usuario; }
  set usuario(usuario) { this._usuario = usuario; }

  get contrasena() { return this._contrasena; }
  set contrasena(contrasena) { this._contrasena = contrasena; }

  get email() { return this._email; }
  set email(email) { this._email = email; }



claveErrada(tipo = "error", duracion = 3000) {
    const mensajeDiv = document.getElementById('mensaje');
    if (mensajeDiv) {
        mensajeDiv.textContent = `${this._nombres} la clave ingresada es incorrecta ... verifique por favor`;
        mensajeDiv.className = "mensaje " + tipo;
        mensajeDiv.style.display = "block";  // 👈 Necesario
        setTimeout(() => {
            mensajeDiv.textContent = "";
            mensajeDiv.className = "mensaje";
            mensajeDiv.style.display = "none";
        }, duracion);
    }
}

mensajelogin(tipo = "exito", duracion = 3000) {
    const mensajeDiv = document.getElementById('mensaje');
    if (mensajeDiv) {
        mensajeDiv.textContent = `${this._nombres} ha iniciado sesión correctamente`;
        mensajeDiv.className = "mensaje " + tipo;
        mensajeDiv.style.display = "block";  // 👈 Esto es clave
        setTimeout(() => {
            mensajeDiv.textContent = "";
            mensajeDiv.className = "mensaje";
            mensajeDiv.style.display = "none";  // 👈 Ocultamos al terminar
        }, duracion);
    }
}

 }