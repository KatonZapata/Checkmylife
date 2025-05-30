
        document.getElementById('volver').addEventListener('click', function() {
            window.location.href = '/html/loginCoordinador.html'; // Vuelve a la página de login
        });

        document.getElementById('recoverForm').addEventListener('submit', function(event) {
            event.preventDefault(); 

            document.getElementById("mensajeEnvioCorreo").textContent =
            `Se ha enviado un codigo a tu correo`;
    
            document.getElementById("codigoModal").classList.remove("oculto");
    
            // Redirigir después de 3 segundos
            setTimeout(() => {
    
            window.location.href = "/html/index.html";
    
            }, 4000);
        });


