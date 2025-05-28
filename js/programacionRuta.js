// js/programacionRuta.js

document.addEventListener('DOMContentLoaded', function() {
    // Establece el año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Lógica para añadir y eliminar filas de la tabla ---
    const addRowButton = document.querySelector('.add-row-button');
    const routeTableBody = document.querySelector('#routeTable tbody');

    addRowButton.addEventListener('click', function() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="nombre[]" required></td>
            <td><input type="text" name="apellido[]" required></td>
            <td><input type="text" name="placa[]" required></td>
            <td><input type="text" name="origen[]" required></td>
            <td><input type="text" name="destino[]" required></td>
            <td><button type="button" class="remove-row-button"><i class="fas fa-trash-alt"></i></button></td>
        `;
        routeTableBody.appendChild(newRow);
    });

    // Delegación de eventos para los botones de eliminar fila
    routeTableBody.addEventListener('click', function(event) {
        if (event.target.closest('.remove-row-button')) {
            const rowToRemove = event.target.closest('tr');
            // Asegúrate de no eliminar la última fila si no quieres que el formulario quede vacío
            if (routeTableBody.rows.length > 1) {
                rowToRemove.remove();
            } else {
                alert('Debe haber al menos una ruta para asignar.');
            }
        }
    });

    // --- Conexión con el Backend para Asignación de Rutas ---
    const API_BASE_URL = 'http://localhost:3000/api'; // URL de tu backend

    const routeForm = document.getElementById('routeForm');

    routeForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const rows = routeTableBody.querySelectorAll('tr');
        const assignments = [];

        // Recorre cada fila de la tabla para recopilar los datos
        for (const row of rows) {
            const nombre = row.querySelector('input[name="nombre[]"]').value;
            const apellido = row.querySelector('input[name="apellido[]"]').value;
            const placa = row.querySelector('input[name="placa[]"]').value;
            const origen = row.querySelector('input[name="origen[]"]').value;
            const destino = row.querySelector('input[name="destino[]"]').value;

            // Validación básica
            if (!nombre || !apellido || !placa || !origen || !destino) {
                alert('Por favor, completa todos los campos de cada ruta.');
                return; // Detiene el envío si un campo está vacío
            }

            // Valores dummy para IDs (asumiendo que los IDs 1, 2, 3 existen para conductores/vehículos)
            // y para las coordenadas/waypoints (simplemente usamos lat/lon de Bogotá y Medellín como ejemplo)
            const driverId = Math.floor(Math.random() * 3) + 1; // Asigna un ID de conductor aleatorio entre 1 y 3
            const vehicleId = Math.floor(Math.random() * 4) + 1; // Asigna un ID de vehículo aleatorio entre 1 y 4

            const originLocation = { name: origen, lat: 6.2442, lon: -75.5812 }; // Coordenadas de Medellín
            const destinationLocation = { name: destino, lat: 4.7110, lon: -74.0721 }; // Coordenadas de Bogotá
            const routeWaypoints = [[originLocation.lat, originLocation.lon], [destinationLocation.lat, destinationLocation.lon]];


            assignments.push({
                driverId: driverId,
                vehicleId: vehicleId,
                routeOrigin: originLocation,
                routeDestination: destinationLocation,
                routeName: `Ruta de ${origen} a ${destino}`, // Un nombre de ruta simple
                routeWaypoints: routeWaypoints,
                timestamp: new Date().toISOString()
            });
        }

        // Enviar cada asignación al backend
        let allSuccess = true;
        for (const assignment of assignments) {
            try {
                const response = await fetch(`${API_BASE_URL}/asignar-ruta`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(assignment)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log(`Asignación guardada para ${assignment.driverId} - ${assignment.vehicleId}:`, data.assignmentId);
                } else {
                    allSuccess = false;
                    console.error(`Error al guardar la asignación para ${assignment.driverId} - ${assignment.vehicleId}:`, data.message || response.statusText);
                    alert(`Error al asignar la ruta de ${assignment.routeOrigin.name} a ${assignment.routeDestination.name}: ${data.message || 'Error desconocido.'}`);
                }
            } catch (error) {
                allSuccess = false;
                console.error('Error de conexión al enviar asignación:', error);
                alert(`Error de conexión al asignar la ruta de ${assignment.routeOrigin.name} a ${assignment.routeDestination.name}.`);
            }
        }

        if (allSuccess) {
            alert('¡Todas las rutas han sido asignadas y guardadas con éxito!');
            routeForm.reset(); // Opcional: Limpiar el formulario
            // Restablecer la tabla a una sola fila vacía
            while (routeTableBody.rows.length > 1) {
                routeTableBody.removeChild(routeTableBody.lastChild);
            }
            const firstRowInputs = routeTableBody.querySelector('tr').querySelectorAll('input');
            firstRowInputs.forEach(input => input.value = ''); // Limpiar la primera fila también
        }
    });
});