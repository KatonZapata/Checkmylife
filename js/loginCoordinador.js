/* import { coordinador } from "/js/coordinador.js"; */
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const formRegistro = document.getElementById('formRegistroCoordinador');
    const formLoginCoordinador = document.getElementById('formLoginCoordinador');
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

/*             try {
                const response = await fetch(`${API_BASE_URL}/coordinadores`);
                const coordinadores = await response.json();

                const existe = coordinadores.some(c => c.documento === documento || c.usuario === usuario);
                if (existe) {
                    alert('Ya existe un coordinador con ese documento o usuario.');
                    return;
                }
            } catch (error) {
                alert('No se pudo verificar si el coordinador existe. Intenta de nuevo.');
                return;
            } */

            const nuevoCoordinador = {
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                documento: document.getElementById('documento').value,
                celular: document.getElementById('celular').value,
                usuario: document.getElementById('usuario').value,
                contrasena: contrasena,
                email: document.getElementById('correo').value

            };

            try {
                const response = await fetch(`${API_BASE_URL}/coordinadores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoCoordinador)
                });

                alert(`Enviando datos al servidor... ${nuevoCoordinador.nombres} ${nuevoCoordinador.apellidos}`);

                const data = await response.json();
                if (response.ok && data.success) {
                    alert('Coordinador registrado exitosamente');
                    formRegistro.reset();
                } else {
                    alert('Error al registrar coordinador: ' + (data.message || 'Error desconocido'));
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
            }
        });
    }
    //Inicio de sesion

    if (formLoginCoordinador) { /* formLoginCoordinador es ahora el formulario de login  */
        formLoginCoordinador.addEventListener('submit', async (event) => {
            event.preventDefault();

            const API_BASE_URL = 'http://localhost:3000/api';
            // Obtener los valores del usuario y contraseña de los inputs del formulario
            const usuario = document.getElementById('loginUsuario').value;
            const contrasena = document.getElementById('loginContrasena').value;

            if (!usuario || !contrasena) {
                alert('Por favor, ingresa tu usuario y contraseña.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/loginCoordinador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ usuario, contrasena })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Login exitoso: ' + data.message);
                    console.log('Datos del usuario logueado:', data.user);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));

                    window.location.href = '../html/programacionRuta.html'; // Cambia esta URL
                } else {
                    alert('Error en el login: ' + data.message);
                }
            } catch (error) {
                console.error('Error al intentar iniciar sesión:', error);
                alert('Hubo un problema de conexión al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
            }
        });
    } else {
        console.warn('El formulario de inicio de sesión con ID "formLoginCoordinador" no se encontró. Asegúrate de que tu HTML lo tenga.');
    }

    // FIN DE LA LÓGICA DE LOGIN

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