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

    // Registro de usuario
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const API_BASE_URL = 'http://localhost:3000/api';
            const documento = document.getElementById('documento').value;
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const repitaContrasena = document.getElementById('repitaContrasena').value;

            if (contrasena !== repitaContrasena) {
                alert("Las contraseñas no coinciden");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/conductores`);
                const conductores = await response.json();

                const existe = conductores.some(c => c.documento === documento || c.usuario === usuario);
                if (existe) {
                    alert('Ya existe un conductor con ese documento o usuario.');
                    return;
                }
            } catch (error) {
                alert('No se pudo verificar si el conductor existe. Intenta de nuevo.');
                return;
            }


            const nuevoConductor = {
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                documento: document.getElementById('documento').value,
                celular: document.getElementById('celular').value,
                usuario: document.getElementById('usuario').value,
                contrasena: contrasena,
                licencia: document.getElementById('licencia').value,
                email: document.getElementById('correo').value
                 // <-- Asegúrate de tener este input en tu HTML
            };

            try {
                const response = await fetch(`${API_BASE_URL}/conductores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoConductor)
                });

                alert(`Enviando datos al servidor... ${nuevoConductor.nombres} ${nuevoConductor.apellidos}`);

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