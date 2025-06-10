import { Coordinador } from "./coordinador.js";


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const API_BASE_URL = 'http://localhost:3000/api';
    const addRowButton = document.querySelector('.add-row-button');
    const routeTableBody = document.querySelector('#routeTable tbody');
    const routeForm = document.getElementById('routeForm');
    const coordinador2 = new Coordinador();
    coordinador2.nombres = localStorage.getItem('nombres');
    coordinador2.apellidos = localStorage.getItem('apellidos');

    console.log(`Coordinador: ${coordinador2.nombres} ${coordinador2.apellidos}`);
    
  
    // Agrega una nueva fila
    addRowButton.addEventListener('click', async function () {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><select class="selectConductores" name="nombre[]" required></select></td>
            <td><input class="apellido" type="text" name="apellido[]" readonly required></td>
            <td><select class="selectVehiculo" name="placa[]" required></select></td>
            <td><input type="text" name="origen[]" required></td>
            <td><input type="text" name="destino[]" required></td>
            <td><button type="button" class="remove-row-button"><i class="fas fa-trash-alt"></i></button></td>
        `;
        routeTableBody.appendChild(newRow);

        const selectConductor = newRow.querySelector('.selectConductores');
        const selectVehiculo = newRow.querySelector('.selectVehiculo');

        await llenarSelectConductores(selectConductor);
        await llenarSelectVehiculos(selectVehiculo);
    });

    // Elimina filas
    routeTableBody.addEventListener('click', function (event) {
        if (event.target.closest('.remove-row-button')) {
            const rowToRemove = event.target.closest('tr');
            if (routeTableBody.rows.length > 1) {
                rowToRemove.remove();
            } else {
                alert('Debe haber al menos una ruta para asignar.');
            }
        }
    });

    // Envío del formulario
    routeForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const rows = routeTableBody.querySelectorAll('tr');
        const assignments = [];

        for (const row of rows) {
            const conductorId = row.querySelector('.selectConductores').value;
            const apellido = row.querySelector('.apellido').value;
            const vehiculoId = row.querySelector('.selectVehiculo').value;
            const origen = row.querySelector('input[name="origen[]"]').value;
            const destino = row.querySelector('input[name="destino[]"]').value;

            if (!conductorId || !apellido || !vehiculoId || !origen || !destino) {
                alert('Por favor, completa todos los campos de cada ruta.');
                return;
            }

            const originLocation = { name: origen, lat: 6.2442, lon: -75.5812 };
            const destinationLocation = { name: destino, lat: 4.7110, lon: -74.0721 };
            const routeWaypoints = [[originLocation.lat, originLocation.lon], [destinationLocation.lat, destinationLocation.lon]];

            assignments.push({
                driverId: parseInt(conductorId),
                vehicleId: parseInt(vehiculoId),
                routeOrigin: originLocation,
                routeDestination: destinationLocation,
                routeName: `Ruta de ${origen} a ${destino}`,
                routeWaypoints: routeWaypoints,
                timestamp: new Date().toISOString()
            });
        }

        let allSuccess = true;
        for (const assignment of assignments) {
            try {
                const response = await fetch(`${API_BASE_URL}/asignar-ruta`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assignment)
                });

                const data = await response.json();
                if (!response.ok || !data.success) {
                    allSuccess = false;
                    alert(`Error al asignar la ruta de ${assignment.routeOrigin.name} a ${assignment.routeDestination.name}: ${data.message || 'Error desconocido.'}`);
                }
            } catch (error) {
                allSuccess = false;
                alert(`Error de conexión al asignar la ruta de ${assignment.routeOrigin.name} a ${assignment.routeDestination.name}.`);
            }
        }

        if (allSuccess) {
            alert('¡Todas las rutas han sido asignadas y guardadas con éxito!');
            routeForm.reset();
            while (routeTableBody.rows.length > 1) {
                routeTableBody.removeChild(routeTableBody.lastChild);
            }
            const firstRow = routeTableBody.querySelector('tr');
            if (firstRow) {
                firstRow.querySelectorAll('input').forEach(input => input.value = '');
                firstRow.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            }
        }
    });

    // Llenar conductores en un select
    async function llenarSelectConductores(selectElement) {
        try {
            const response = await fetch(`${API_BASE_URL}/conductores`);
            const conductores = await response.json();

            selectElement.innerHTML = '<option value="">Seleccione</option>';
            conductores.forEach(conductor => {
                const option = document.createElement('option');
                option.value = conductor.id;
                option.textContent = `${conductor.name} `;
                option.setAttribute('data-apellido', conductor.apellido || '');
                selectElement.appendChild(option);
            });

            // Evento de cambio para actualizar apellido
            selectElement.addEventListener('change', function () {
                const selected = this.options[this.selectedIndex];
                const apellido = selected.getAttribute('data-apellido') || '';
                const apellidoInput = this.closest('tr').querySelector('.apellido');
                if (apellidoInput) apellidoInput.value = apellido;
            });
        } catch (error) {
            console.error('Error al obtener conductores:', error);
        }
    }

    // Llenar vehículos en un select
    async function llenarSelectVehiculos(selectElement) {
        try {
            const response = await fetch(`${API_BASE_URL}/vehiculos`);
            const vehiculos = await response.json();

            selectElement.innerHTML = '<option value="">Seleccione</option>';
            vehiculos.forEach(vehiculo => {
                const option = document.createElement('option');
                option.value = vehiculo.id;
                option.textContent = vehiculo.placa;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        }
    }

    // Inicializar fila base
    const firstRow = routeTableBody.querySelector('tr');
    if (firstRow) {
        const selectConductor = firstRow.querySelector('.selectConductores');
        const selectVehiculo = firstRow.querySelector('.selectVehiculo');
        llenarSelectConductores(selectConductor);
        llenarSelectVehiculos(selectVehiculo);
    }
});
