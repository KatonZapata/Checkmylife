import { Conductor } from "/js/conductor.js";

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const btnMostrarRegistro = document.getElementById('mostrarRegistro'); // Botón "Registrarse" del panel derecho
    const btnMostrarLogin = document.getElementById('iniciarSesion');     // Botón "Iniciar Sesión" del panel izquierdo
    const formRegistro = document.getElementById('formRegistroConductor');

    // REFERENCIAS A LOS ELEMENTOS DE LA HUELLA
    const huellaContainer = document.getElementById('huellaContainer'); // El div que contiene el texto y el ícono de la huella
    const btnActivarHuella = document.getElementById('btnActivarHuella'); // El botón "Ingresar con Huella" que mostrará la huella
    const huellaLoginConductor = document.getElementById('huellaLoginConductor'); // El ícono de la huella

    // Lógica para alternar formularios (Registrarse y Iniciar Sesión)
    if (btnMostrarRegistro && contenedor) {
        btnMostrarRegistro.addEventListener('click', () => {
            contenedor.classList.add('activo');
            // Cuando vamos al registro, nos aseguramos que el área de la huella en login esté oculta si volvemos.
            // Aunque al cambiar de formulario, la vista de login se oculta completamente, es buena práctica.
            if (huellaContainer) {
                huellaContainer.classList.add('huella-oculta');
            }
            if (btnActivarHuella) {
                btnActivarHuella.style.display = 'block'; // Asegura que el botón esté visible al volver al login
            }
        });
    }

    if (btnMostrarLogin && contenedor) {
        btnMostrarLogin.addEventListener('click', () => {
            contenedor.classList.remove('activo');
            // Cuando se vuelve a la vista de "Iniciar Sesión", ocultamos la huella y mostramos el botón
            if (huellaContainer) {
                huellaContainer.classList.add('huella-oculta'); // Oculta el div de la huella
            }
            if (btnActivarHuella) {
                btnActivarHuella.style.display = 'block'; // Muestra el botón "Ingresar con Huella"
            }
        });
    }

    // LÓGICA PARA MOSTRAR/OCULTAR LA HUELLA AL HACER CLIC EN EL BOTÓN
    if (btnActivarHuella && huellaContainer) {
        btnActivarHuella.addEventListener('click', () => {
            btnActivarHuella.style.display = 'none';           // Oculta el botón "Ingresar con Huella"
            huellaContainer.classList.remove('huella-oculta'); // Muestra el div que contiene la huella
            console.log('Botón "Ingresar con Huella" clickeado. Mostrando huella.');
        });
    }

    // Lógica para el registro de usuario
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            // Es buena práctica verificar si los elementos existen antes de acceder a su .value
            const contrasenaInput = document.getElementById('contrasena');
            const repitaContrasenaInput = document.getElementById('repitaContrasena');

            if (!contrasenaInput || !repitaContrasenaInput) {
                console.error("No se encontraron los campos de contraseña en el formulario de registro.");
                return;
            }

            const contrasena = contrasenaInput.value;
            const repitaContrasena = repitaContrasenaInput.value;

            if (contrasena !== repitaContrasena) {
                alert("Las contraseñas no coinciden");
                return;
            }

            // Asegurarse de que todos los campos de input existan
            const nombres = document.getElementById('nombres')?.value || '';
            const apellidos = document.getElementById('apellidos')?.value || '';
            const celular = document.getElementById('celular')?.value || '';
            const documento = document.getElementById('documento')?.value || '';
            const licencia = document.getElementById('licencia')?.value || '';
            const fechaVencimiento = document.getElementById('fechaVencimiento')?.value || '';
            const usuario = document.getElementById('usuario')?.value || '';
            const email = document.getElementById('correo')?.value || '';

            const nuevoConductor = new Conductor({
                nombres: nombres,
                apellidos: apellidos,
                celular: celular,
                documento: documento,
                licencia: licencia,
                fechaVencimiento: fechaVencimiento,
                usuario: usuario,
                contrasena: contrasena,
                email: email
            });

            console.log("Nuevo conductor registrado:", nuevoConductor);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            // Opcional: limpiar el formulario y volver a la vista de login
            formRegistro.reset();
            contenedor.classList.remove('activo'); // Vuelve a la vista de inicio de sesión
            if (huellaContainer) {
                huellaContainer.classList.add('huella-oculta'); // Oculta la huella al volver a la vista de login
            }
            if (btnActivarHuella) {
                btnActivarHuella.style.display = 'block'; // Muestra el botón de activar huella
            }
        });
    }

    // Lógica para los botones de regresar
    // Corregí la selección, ya que en tu HTML original uno es 'btn-regresar' y el otro 'btn_regresar1'
    const regresarBtns = document.querySelectorAll('#btn-regresar, #btn_regresar1');
    regresarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.history.back();
        });
    });

    // Lógica para la huella digital (presión prolongada)
    let pressTimer;
    const PRESS_DURATION = 3000;
    const TARGET_PAGE = '/html/index.html';

    if (huellaLoginConductor) { // Asegúrate de que el ícono de la huella exista
        huellaLoginConductor.addEventListener('mousedown', startPress);
        huellaLoginConductor.addEventListener('touchstart', startPress);

        huellaLoginConductor.addEventListener('mouseup', endPress);
        huellaLoginConductor.addEventListener('touchend', endPress);
        huellaLoginConductor.addEventListener('touchcancel', endPress);
        huellaLoginConductor.addEventListener('mouseleave', endPress);

        function startPress(e) {
            e.preventDefault();
            console.log('Presión iniciada en huella. Temporizador en marcha...');
            pressTimer = setTimeout(() => {
                console.log('¡3 segundos de presión alcanzados! Redirigiendo...');
                window.location.href = TARGET_PAGE;
            }, PRESS_DURATION);
        }

        function endPress() {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
                console.log('Presión en huella terminada antes de 3 segundos o cancelada.');
            }
        }
    } else {
        console.warn('El icono de la huella digital con ID "huellaLoginConductor" no fue encontrado. Asegúrate de que tu HTML lo tenga.');
    }
});