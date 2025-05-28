import { Conductor } from "/js/conductor.js";

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const registrarseBtn = document.getElementById('registrarse');
    const iniciarSesionBtn = document.getElementById('iniciarSesion');

    registrarseBtn.addEventListener('click', () => {
     
          const nuevoConductor = new Conductor ({
            
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            celular: document.getElementById('celular').value,
            documento: document.getElementById('documento').value,
            usuario: document.getElementById('usuario').value,
            contrasena: document.getElementById('contrasena').value,
            email: document.getElementById('email').value,
            licencia: document.getElementById('licencia').value,
            fechaVencimiento: document.getElementById('fechaVencimiento').value,
        
        });
         console.log(nuevoConductor); 
    
        contenedor.classList.add("activo");
    });

    if (registrarseBtn && iniciarSesionBtn && contenedor) {
        registrarseBtn.addEventListener('click', () => {
            contenedor.classList.add('activo');
        });

        iniciarSesionBtn.addEventListener('click', () => {
            contenedor.classList.remove('activo');
        });
    }

    const regresarBtns = document.querySelectorAll('.btn-regresar');

    regresarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.history.back();
        });
    });

    const fingerprintIcon = document.getElementById('huellaLoginCoordinador');
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
            console.log('Presión iniciada. Temporizador en marcha...');
            pressTimer = setTimeout(() => {
                console.log('¡3 segundos alcanzados! Redirigiendo...');
                window.location.href = TARGET_PAGE;
            }, PRESS_DURATION);
        }

        function endPress() {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
                console.log('Presión terminada antes de 3 segundos o cancelada.');
            }
        }
    } else {
        console.warn('El icono de la huella digital con ID "huellaLoginCoordinador" no fue encontrado. Verifica el ID en tu HTML.');
    }

    const btnIniciarSesionHuella = document.getElementById('btnIniciarSesionHuella');
    if (btnIniciarSesionHuella) {
        btnIniciarSesionHuella.addEventListener('click', () => {
            console.log('Botón "Ingresar con Huella" clickeado.');
        });
    }
});