   import { Conductor } from "/js/conductor.js";
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const formRegistro = document.getElementById('formRegistroCoordinador');
    const botonIniciarSesion = document.getElementById('iniciarSesion');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const contrasena = document.getElementById('contrasena').value;
            const repitaContrasena = document.getElementById('repitaContrasena').value;

            const nuevoUsuario = new Conductor({
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                celular: document.getElementById('celular').value,
                correo: document.getElementById('correo').value,
                documento: document.getElementById('documento').value,
                usuario: document.getElementById('usuario').value,
                email: document.getElementById('correo').value, // Usar 'correo' como 'email'
                contrasena: contrasena === repitaContrasena ? contrasena : null,
            });

            console.log(nuevoUsuario);

            contenedor.classList.add("activo");
        });
    }

    if (botonIniciarSesion) {
        botonIniciarSesion.addEventListener('click', () => {
            contenedor.classList.remove("activo");
        });
    }

    document.getElementById('volver').addEventListener('click', function() {
        window.location.href = '/html/index.html';
    });
    document.getElementById('volver1').addEventListener('click', function() {
        window.location.href = '/html/index.html';
    });

const btnVolver = document.getElementById('volver');
if (btnVolver) {
    btnVolver.addEventListener('click', function() {
        window.location.href = '/html/index.html';
    });
}

const btnVolver1 = document.getElementById('volver1');
if (btnVolver1) {
    btnVolver1.addEventListener('click', function() {
        window.location.href = '/html/index.html';
    });
}

});