import { Conductor } from "/js/conductor.js";
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const formRegistro = document.getElementById('formRegistroCoordinador');
    const botonIniciarSesion = document.getElementById('iniciarSesion');
    const botonRegistrarse = document.getElementById('registrarse');
    const btnVolver = document.getElementById('volver');
    const btnVolver1 = document.getElementById('volver1');

    // Alternar a formulario de registro
    if (botonRegistrarse) {
        botonRegistrarse.addEventListener('click', () => {
            contenedor.classList.add('activo');
        });
    }

    // Alternar a formulario de inicio de sesión
    if (botonIniciarSesion) {
        botonIniciarSesion.addEventListener('click', () => {
            contenedor.classList.remove('activo');
        });
    }

    // Registro de usuario
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const contrasena = document.getElementById('contrasena').value;
            const repitaContrasena = document.getElementById('repitaContrasena').value;

            if (contrasena !== repitaContrasena) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const nuevoUsuario = new Conductor({
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                celular: document.getElementById('celular').value,
                documento: document.getElementById('documento').value,
                usuario: document.getElementById('usuario').value,
                email: document.getElementById('correo').value,
                contrasena: contrasena
            });

            console.log(nuevoUsuario);
            // Aquí puedes agregar lógica para guardar el usuario o mostrar un mensaje de éxito
        });
    }

    // Botón regresar en registro
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            window.location.href = '/html/index.html';
        });
    }

    // Botón regresar en login
    if (btnVolver1) {
        btnVolver1.addEventListener('click', function() {
            window.location.href = '/html/index.html';
        });
    }
});