   import { persona } from "/js/persona.js"; 
const contenedor = document.getElementById('contenedor');
const botonRegistrarse = document.getElementById('registrarse');
const botonIniciarSesion = document.getElementById('iniciarSesion');
const botonRegresar = document.getElementById('regresar');



botonRegistrarse.addEventListener('click', () => {
 
      const nuevoUsuario = new persona({
        
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        celular: document.getElementById('celular').value,
        documento: document.getElementById('documento').value,
        usuario: document.getElementById('usuario').value,
        contrasena: document.getElementById('contrasena').value,
        email: document.getElementById('email').value,  
    
    });
     console.log(nuevoUsuario); 

    contenedor.classList.add("activo");
});

botonIniciarSesion.addEventListener('click', () => {
    contenedor.classList.remove("activo");
});

document.getElementById('regresar').addEventListener('click', function() {
    window.location.href = '/html/index.html';
});