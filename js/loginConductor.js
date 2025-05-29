import { Conductor } from "/js/conductor.js";

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const btnMostrarRegistro = document.getElementById('mostrarRegistro');
    const btnMostrarLogin = document.getElementById('iniciarSesion');
    const formRegistro = document.getElementById('formRegistroConductor');

    // Alternar formularios
    if (btnMostrarRegistro) {
        btnMostrarRegistro.addEventListener('click', () => {
            contenedor.classList.add('activo');
        });
    }
    if (btnMostrarLogin) {
        btnMostrarLogin.addEventListener('click', () => {
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

            const nuevoConductor = new Conductor({
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                celular: document.getElementById('celular').value,
                documento: document.getElementById('documento').value,
                licencia: document.getElementById('licencia').value,
                fechaVencimiento: document.getElementById('fechaVencimiento').value,
                usuario: document.getElementById('usuario').value,
                contrasena: contrasena,
                email: document.getElementById('correo').value
            });

            console.log(nuevoConductor);
            // Aquí puedes agregar lógica para guardar el usuario o mostrar un mensaje de éxito
        });
    }

    // Botones regresar
    const regresarBtns = document.querySelectorAll('.btn-regresar');
    regresarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.history.back();
        });
    });

    // Huella digital (ajusta el ID según tu HTML)
    const fingerprintIcon = document.getElementById('huellaLoginConductor');
    let pressTimer;
    const PRESS_DURATION = 3000;
    const TARGET_PAGE = '/html/index.html';

    if (fingerprintIcon) {
        fingerprintIcon.addEventListener('mousedown', startPress);
        fingerprintIcon.addEventListener('touchstart', startPress);

        fingerprintIcon.addEventListener('mouseup', endPress);
        fingerprintIcon.addEventListener('touchend', endPress);
        fingerprintIcon.addEventListener('touchcancel', endPress);

        fingerprintIcon.addEventListener('mouseleave', endPress);

        function startPress(e) {
            e.preventDefault();
            pressTimer = setTimeout(() => {
                window.location.href = TARGET_PAGE;
            }, PRESS_DURATION);
        }

        function endPress() {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        }
    }
});