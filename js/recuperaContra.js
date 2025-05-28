
        document.getElementById('volver').addEventListener('click', function() {
            window.location.href = '/html/loginCoordinador.html'; // Vuelve a la página de login
        });

        document.getElementById('recoverForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío del formulario por defecto
            // Aquí puedes añadir la lógica para enviar los datos de recuperación
            alert('Solicitud de recuperación enviada. Revisa tu correo/teléfono.');
            // Idealmente, aquí se haría una llamada a una API
            // Ejemplo: fetch('/api/recuperar-contrasena', { method: 'POST', body: new FormData(this) });
        });
