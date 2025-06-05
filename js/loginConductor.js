document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const btnMostrarRegistro = document.getElementById('mostrarRegistro'); // Botón "Registrarse" del panel derecho
    const btnMostrarLogin = document.getElementById('iniciarSesion');     // Botón "Iniciar Sesión" del panel izquierdo
    const formRegistro = document.getElementById('formRegistroConductor');

    // REFERENCIAS A LOS ELEMENTOS DEL FORMULARIO DE LOGIN
    const inicialLoginContainer = document.getElementById('inicialLoginContainer'); // Contenedor inicial con botones
    const huellaContainer = document.getElementById('huellaContainer');             // El div que contiene el texto y el ícono de la huella
    const btnActivarHuella = document.getElementById('btnActivarHuella');           // El botón "Ingresar con Huella"
    const huellaLoginConductor = document.getElementById('huellaLoginConductor');   // El ícono de la huella
    const credencialesContainer = document.getElementById('credencialesContainer'); // Contenedor de usuario/contraseña
    const btnMostrarLoginCredenciales = document.getElementById('btnMostrarLoginCredenciales'); // Botón "Iniciar Sesión con Usuario" (desde la pantalla inicial de login)
    const btnVolverCredencialesDesdeHuella = document.getElementById('btnVolverCredencialesDesdeHuella'); // Botón para volver a credenciales desde huella
    const btnVolverHuellaDesdeCredenciales = document.getElementById('btnVolverHuellaDesdeCredenciales'); // Botón para volver a huella desde credenciales

    // Lógica para alternar formularios (Registrarse y Iniciar Sesión)
    if (btnMostrarRegistro && contenedor) {
        btnMostrarRegistro.addEventListener('click', () => {
            contenedor.classList.add('activo');
            // Al ir al registro, ocultamos cualquier estado del login (huella o credenciales)
            if (inicialLoginContainer) inicialLoginContainer.style.display = 'flex'; // Aseguramos que el inicial esté visible al volver
            if (huellaContainer) huellaContainer.classList.add('huella-oculta');
            if (credencialesContainer) credencialesContainer.classList.add('credenciales-ocultas');
        });
    }

    if (btnMostrarLogin && contenedor) {
        btnMostrarLogin.addEventListener('click', () => {
            contenedor.classList.remove('activo');
            // Al volver a la vista de "Iniciar Sesión", aseguramos el estado inicial:
            // Mostrar los botones iniciales y ocultar huella/credenciales
            if (inicialLoginContainer) inicialLoginContainer.style.display = 'flex';
            if (huellaContainer) huellaContainer.classList.add('huella-oculta');
            if (credencialesContainer) credencialesContainer.classList.add('credenciales-ocultas');
        });
    }

    // LÓGICA PARA NAVEGAR DENTRO DEL FORMULARIO DE INICIO DE SESIÓN
    // 1. Mostrar huella al hacer clic en "Ingresar con Huella" (desde la pantalla inicial de login)
    if (btnActivarHuella && huellaContainer && inicialLoginContainer) {
        btnActivarHuella.addEventListener('click', () => {
            inicialLoginContainer.style.display = 'none'; // Oculta los botones iniciales
            huellaContainer.classList.remove('huella-oculta'); // Muestra el div de la huella
            credencialesContainer.classList.add('credenciales-ocultas'); // Asegura que credenciales estén ocultas
            console.log('Botón "Ingresar con Huella" clickeado. Mostrando huella.');
        });
    }

    // 2. Mostrar credenciales al hacer clic en "Iniciar Sesión con Usuario" (desde la pantalla inicial de login)
    if (btnMostrarLoginCredenciales && credencialesContainer && inicialLoginContainer) {
        btnMostrarLoginCredenciales.addEventListener('click', () => {
            inicialLoginContainer.style.display = 'none'; // Oculta los botones iniciales
            credencialesContainer.classList.remove('credenciales-ocultas'); // Muestra el div de credenciales
            huellaContainer.classList.add('huella-oculta'); // Asegura que huella esté oculta
            console.log('Botón "Iniciar Sesión con Usuario" clickeado. Mostrando credenciales.');
        });
    }

    // 3. Volver a credenciales desde la vista de huella
    if (btnVolverCredencialesDesdeHuella && credencialesContainer && huellaContainer) {
        btnVolverCredencialesDesdeHuella.addEventListener('click', () => {
            huellaContainer.classList.add('huella-oculta'); // Oculta la huella
            credencialesContainer.classList.remove('credenciales-ocultas'); // Muestra las credenciales
            inicialLoginContainer.style.display = 'none'; // Asegura que los botones iniciales sigan ocultos
            console.log('Volviendo a credenciales desde huella.');
        });
    }

    // 4. Volver a huella desde la vista de credenciales
    if (btnVolverHuellaDesdeCredenciales && huellaContainer && credencialesContainer) {
        btnVolverHuellaDesdeCredenciales.addEventListener('click', () => {
            credencialesContainer.classList.add('credenciales-ocultas'); // Oculta las credenciales
            huellaContainer.classList.remove('huella-oculta'); // Muestra la huella
            inicialLoginContainer.style.display = 'none'; // Asegura que los botones iniciales sigan ocultos
            console.log('Volviendo a huella desde credenciales.');
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

    // Botones de "Regresar"
    const regresarBtns = document.querySelectorAll('#btn-regresar, #btn_regresar1');
    regresarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.history.back();
        });
    });

    // Lógica para la huella digital (presión prolongada)
    let pressTimer;
    const PRESS_DURATION = 3000;
    const TARGET_PAGE = '/html/index.html'; // Página a la que redirigir si la huella es exitosa

    if (huellaLoginConductor) { // Asegúrate de que el ícono de la huella exista
        huellaLoginConductor.addEventListener('mousedown', startPress);
        huellaLoginConductor.addEventListener('touchstart', startPress);

        huellaLoginConductor.addEventListener('mouseup', endPress);
        huellaLoginConductor.addEventListener('touchend', endPress);
        huellaLoginConductor.addEventListener('touchcancel', endPress);
        huellaLoginConductor.addEventListener('mouseleave', endPress); // Para cuando el mouse sale del elemento

        function startPress(e) {
            e.preventDefault(); // Previene el comportamiento por defecto del navegador (ej. resaltado de texto)
            console.log('Presión iniciada en huella. Temporizador en marcha...');
            // Solo inicia el temporizador si no está ya en marcha
            if (!pressTimer) {
                pressTimer = setTimeout(() => {
                    console.log('¡3 segundos de presión alcanzados! Redirigiendo...');
                    // Aquí es donde iría la lógica de verificación de huella real
                    // Por ahora, solo redirige.
                    window.location.href = TARGET_PAGE;
                }, PRESS_DURATION);
            }
        }

        function endPress() {
            if (pressTimer) {
                clearTimeout(pressTimer); // Detiene el temporizador si el usuario suelta antes
                pressTimer = null;
                console.log('Presión en huella terminada antes de 3 segundos o cancelada.');
            }
        }
    } else {
        console.warn('El icono de la huella digital con ID "huellaLoginConductor" no fue encontrado. Asegúrate de que tu HTML lo tenga.');
    }
});