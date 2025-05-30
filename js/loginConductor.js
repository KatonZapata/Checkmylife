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
        formRegistro.addEventListener('submit', async(e) => {
            e.preventDefault();

            const API_BASE_URL = 'http://localhost:3000/api';
            const contrasena = document.getElementById('contrasena').value;
            const repitaContrasena = document.getElementById('repitaContrasena').value;
              
            if (contrasena !== repitaContrasena) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const nuevoConductor ={
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                documento: document.getElementById('documento').value,
                celular: document.getElementById('celular').value,              
                usuario: document.getElementById('usuario').value,
                contrasena: contrasena,
                email: document.getElementById('correo').value,
                licencia: document.getElementById('licencia').value // <-- AGREGA ESTA LÍNEA
            };

           try {
                const response = await fetch(`${API_BASE_URL}/conductores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoConductor)
                });

                alert('Enviando datos al servidor...${nuevoConductor.nombres} ${nuevoConductor.apellidos}`);');

                const data = await response.json();
                if (response.ok && data.success) {
                    alert('Conductor registrado exitosamente');
                    formRegistro.reset();
                } else {
                    alert('Error al registrar conductor: ' + (data.message || 'Error desconocido'));
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
            }

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