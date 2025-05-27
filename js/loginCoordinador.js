
const contenedor = document.getElementById('contenedor');
const botonRegistrarse = document.getElementById('registrarse');
const botonIniciarSesion = document.getElementById('iniciarSesion');
const botonRegresar = document.getElementById('regresar');

botonRegistrarse.addEventListener('click', () => {
    contenedor.classList.add("activo");
});

botonIniciarSesion.addEventListener('click', () => {
    contenedor.classList.remove("activo");
});

document.getElementById('regresar').addEventListener('click', function() {
    window.location.href = '/html/index.html';
});