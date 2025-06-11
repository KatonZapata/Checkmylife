import { Coordinador } from "./coordinador.js";
const nuevoCoord = new Coordinador();


document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor');
    const formRegistro = document.getElementById('formRegistroCoordinador');
    const formLoginCoordinador = document.getElementById('formLoginCoordinador');
    const botonIniciarSesion = document.getElementById('iniciarSesion');
    const botonRegistrarse = document.getElementById('registrarse');
    const btnVolver = document.getElementById('volver');
    const btnVolver1 = document.getElementById('volver1');
    const API_BASE_URL = 'http://localhost:3000/api';

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

            const nuevoCoord1 = new Coordinador();
            nuevoCoord1.nombres = document.getElementById('nombres').value;
            nuevoCoord1.apellidos = document.getElementById('apellidos').value;        
            nuevoCoord1.celular = document.getElementById('celular').value;
            nuevoCoord1.documento = document.getElementById('documento').value;
            nuevoCoord1.usuario = document.getElementById('usuario').value;
            nuevoCoord1.contrasena = document.getElementById('contrasena').value;
            nuevoCoord1.email = document.getElementById('correo').value;
            const repitaContrasena = document.getElementById('repitaContrasena').value; //solo en el frontend

            if (nuevoCoord1.contrasena !== repitaContrasena) {
                nuevoCoord.claveErrada("error")
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/coordinadores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombres: nuevoCoord1.nombres,
                        apellidos: nuevoCoord1.apellidos,
                        documento: nuevoCoord1.documento,
                        celular: nuevoCoord1.celular,    
                        usuario: nuevoCoord1.usuario,
                        contrasena: nuevoCoord1.contrasena,
                        email: nuevoCoord1.email 
                    })
                });

                alert(`Enviando datos al servidor... ${nuevoCoord1.nombres} ${nuevoCoord1.apellidos}`);

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

          
            nuevoCoord.usuario = document.getElementById('loginUsuario').value;
            nuevoCoord.contrasena = document.getElementById('loginContrasena').value;
            
            if (!nuevoCoord.usuario || !nuevoCoord.contrasena) {
                alert('Por favor, ingresa tu usuario y contraseña.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/loginCoordinador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ usuario:nuevoCoord.usuario, contrasena: nuevoCoord.contrasena })
                });

                const data = await response.json();

                nuevoCoord.nombres = data.user.nombres;
                nuevoCoord.apellidos = data.user.apellidos;
                nuevoCoord.email = data.user.email;
               

                if (data.success) {
                   nuevoCoord.mensajelogin("exito",5000);
                    console.log('Datos del usuario logueado:', data.user);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    setTimeout(() => {
                    window.location.href = '../html/programacionRuta.html';
                     }, 3000); // Cambia esta URL
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