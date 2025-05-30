// server/server.js

// Importar las librerías que instalamos
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para código más limpio
const cors = require('cors');

// Crear una aplicación Express (nuestro servidor web)
const app = express();
const PORT = 3000; // Puerto donde escuchará tu servidor (ej. http://localhost:3000)

// --- Configuración de CORS ---
app.use(cors());
// Middleware para que Express pueda entender los cuerpos de las solicitudes en formato JSON
app.use(express.json());

// --- Configuración de la Conexión a MySQL ---
const dbConfig = {
    host: '127.0.0.1', // O 'localhost' - según tu phpMyAdmin
    user: 'root',      // Según tu phpMyAdmin
    password: '',      // Según tu phpMyAdmin (cadena vacía si no hay)
    database: 'checkmylife' // Según tu phpMyAdmin y UML
};

let connection; // Variable para guardar la conexión a la base de datos

// Función asíncrona para conectar a la DB y crear tablas
async function connectToDbAndCreateTables() {
    try {
        // Establecer la conexión a la base de datos
        connection = await mysql.createConnection(dbConfig);
        console.log('Conectado a la base de datos MySQL:', dbConfig.database);

        // --- Creación/Verificación de Tablas según tu UML ---
        // El orden es importante para las claves foráneas: las tablas padre primero.

        // 1. Tabla `personas`
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS personas (
                id_persona INT AUTO_INCREMENT PRIMARY KEY,
                nombres VARCHAR(255) NOT NULL,
                apellidos VARCHAR(255),
                documento VARCHAR(100),
                celular VARCHAR(20),
                huella TEXT,
                usuario VARCHAR(100) UNIQUE,
                contrasena VARCHAR(255),
                email VARCHAR(255)
            )
        `);
        console.log('Tabla personas verificada/creada.');

        // 2. Tabla `coordinadores` (Depende de `personas`)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS coordinadores (
                id_coordinador INT PRIMARY KEY,
                id_persona INT NOT NULL,
                area VARCHAR(255),
                FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
            )
        `);
        console.log('Tabla coordinadores verificada/creada.');

        // 3. Tabla `conductores` (Depende de `personas`)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS conductores (
                id_conductor INT PRIMARY KEY,
                id_persona INT NOT NULL,
                licencia VARCHAR(50),
                huella_conductor TEXT,
                id_vehiculo_asignado INT,
                FOREIGN KEY (id_persona) REFERENCES personas(id_persona) ON DELETE CASCADE
            )
        `);
        console.log('Tabla conductores verificada/creada.');

        // 4. Tabla `vehiculos`
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vehiculos (
                id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
                placa VARCHAR(20) NOT NULL UNIQUE,
                marca VARCHAR(100),
                modelo INT
            )
        `);
        console.log('Tabla vehiculos verificada/creada.');

        // 5. Tabla `rutas` (Depende de `coordinadores`)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS rutas (
                id_ruta INT AUTO_INCREMENT PRIMARY KEY,
                origen VARCHAR(255),
                destino VARCHAR(255),
                distancia DECIMAL(10,2),
                fecha_inicio DATE,
                fecha_terminacion DATE,
                id_coordinador INT,
                FOREIGN KEY (id_coordinador) REFERENCES coordinadores(id_coordinador) ON UPDATE CASCADE ON DELETE RESTRICT
            )
        `);
        console.log('Tabla rutas verificada/creada.');

        // 6. Tabla `asignaciones_ruta` (Depende de `rutas`, `conductores`, `vehiculos`)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS asignaciones_ruta (
                id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
                id_ruta INT NOT NULL,
                id_conductor INT NOT NULL,
                id_vehiculo INT NOT NULL,
                fecha_hora_asignacion DATETIME NOT NULL,
                estado ENUM('Pendiente', 'En Curso', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
                -- Columnas para guardar detalles de la ruta generada por OSRM
                route_origin_full_name TEXT,
                route_destination_full_name TEXT,
                route_waypoints JSON, -- JSON para guardar los waypoints calculados
                FOREIGN KEY (id_ruta) REFERENCES rutas(id_ruta) ON DELETE RESTRICT ON UPDATE CASCADE,
                FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor) ON DELETE RESTRICT ON UPDATE CASCADE,
                FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `);
        console.log('Tabla asignaciones_ruta verificada/creada.');


        // --- Insertar Datos de Ejemplo ---
        // El orden de inserción también es importante para las claves foráneas.

        // Insertar personas si no existen (id_persona 1, 2, 3 para conductores; 4 para coordinador)
        const [personasCount] = await connection.execute('SELECT COUNT(*) AS count FROM personas');
        if (personasCount[0].count === 0) {
            await connection.execute("INSERT INTO personas (id_persona, nombres, apellidos, documento, usuario, contrasena, email) VALUES (1, 'Juan', 'Perez', '12345678', 'jperez', 'pass123', 'juan@example.com')");
            await connection.execute("INSERT INTO personas (id_persona, nombres, apellidos, documento, usuario, contrasena, email) VALUES (2, 'Maria', 'Garcia', '87654321', 'mgarcia', 'pass456', 'maria@example.com')");
            await connection.execute("INSERT INTO personas (id_persona, nombres, apellidos, documento, usuario, contrasena, email) VALUES (3, 'Carlos', 'Lopez', '11223344', 'clopez', 'pass789', 'carlos@example.com')");
            await connection.execute("INSERT INTO personas (id_persona, nombres, apellidos, documento, usuario, contrasena, email) VALUES (4, 'Ana', 'Rodriguez', '55667788', 'arodriguez', 'passabc', 'ana@example.com')"); // Nueva persona para coordinador
            console.log('Personas de ejemplo insertadas.');
        }

        // Insertar coordinadores de ejemplo si no existen (depende de `personas`)
        const [coordinadoresCount] = await connection.execute('SELECT COUNT(*) AS count FROM coordinadores');
        if (coordinadoresCount[0].count === 0) {
            // Usamos id_persona = 4 para el coordinador
            await connection.execute("INSERT INTO coordinadores (id_coordinador, id_persona, area) VALUES (101, 4, 'Logística')");
            console.log('Coordinadores de ejemplo insertados.');
        }

        // Insertar conductores de ejemplo si no existen (depende de `personas`)
        const [conductoresCount] = await connection.execute('SELECT COUNT(*) AS count FROM conductores');
        if (conductoresCount[0].count === 0) {
            await connection.execute("INSERT INTO conductores (id_conductor, id_persona, licencia) VALUES (1, 1, 'A12345')"); // Juan Perez
            await connection.execute("INSERT INTO conductores (id_conductor, id_persona, licencia) VALUES (2, 2, 'B67890')"); // Maria Garcia
            await connection.execute("INSERT INTO conductores (id_conductor, id_persona, licencia) VALUES (3, 3, 'C11223')"); // Carlos Lopez
            console.log('Conductores de ejemplo insertados.');
        }

        // Insertar vehículos de ejemplo si no existen
        const [vehiculosCount] = await connection.execute('SELECT COUNT(*) AS count FROM vehiculos');
        if (vehiculosCount[0].count === 0) {
            await connection.execute("INSERT INTO vehiculos (id_vehiculo, placa, marca, modelo) VALUES (1, 'ABC-123', 'Camión Frio', 2020)");
            await connection.execute("INSERT INTO vehiculos (id_vehiculo, placa, marca, modelo) VALUES (2, 'XYZ-456', 'Furgón Seco', 2018)");
            await connection.execute("INSERT INTO vehiculos (id_vehiculo, placa, marca, modelo) VALUES (3, 'LMN-789', 'Panel Urbano', 2022)");
            await connection.execute("INSERT INTO vehiculos (id_vehiculo, placa, marca, modelo) VALUES (4, 'PQR-012', 'Bus Intermunicipal', 2015)");
            console.log('Vehículos de ejemplo insertados.');
        }

        // Insertar algunas rutas predefinidas si no existen (depende de `coordinadores`)
        const [rutasCount] = await connection.execute('SELECT COUNT(*) AS count FROM rutas');
        if (rutasCount[0].count === 0) {
             // Usamos el id_coordinador que acabamos de insertar (101)
             await connection.execute("INSERT INTO rutas (id_ruta, origen, destino, distancia, id_coordinador) VALUES (1, 'Medellín', 'Bogotá', 420.5, 101)");
             await connection.execute("INSERT INTO rutas (id_ruta, origen, destino, distancia, id_coordinador) VALUES (2, 'Cali', 'Barranquilla', 900.0, 101)");
             console.log('Rutas de ejemplo insertadas.');
        }


    } catch (err) {
        console.error('ERROR CRÍTICO: No se pudo conectar a la base de datos o crear tablas:', err.message);
        // Si no podemos conectar a la DB, salimos del proceso para que se revise el error
        process.exit(1);
    }
}

// Llama a la función de conexión y creación de tablas cuando el servidor inicia
connectToDbAndCreateTables();

// --- Definición de los Endpoints (APIs) de tu Backend ---

// GET /api/conductores: Devuelve la lista de todos los conductores con su nombre de persona
app.get('/api/conductores', async (req, res) => {
    try {
        const [rows] = await connection.execute(`
            SELECT c.id_conductor AS id, p.nombres AS name, p.apellidos AS apellido
            FROM conductores c
            JOIN personas p ON c.id_persona = p.id_persona
        `);
        res.json(rows); // Envía los datos como JSON al frontend
    } catch (err) {
        console.error('Error al obtener conductores:', err);
        res.status(500).json({ error: err.message }); // Envía un error 500 si algo falla
    }
});

// GET /api/vehiculos: Devuelve la lista de todos los vehículos con su placa
app.get('/api/vehiculos', async (req, res) => {
    try {
        const [rows] = await connection.execute(`
            SELECT id_vehiculo AS id, placa AS placa , marca
            FROM vehiculos
        `);
        res.json(rows);
    }
    catch (err) {
        console.error('Error al obtener vehículos:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/asignar-ruta: Recibe una nueva asignación de ruta y la guarda en la DB
app.post('/api/asignar-ruta', async (req, res) => {
    const {
        driverId, driverName, // driverName y vehicleName los recibimos del frontend, pero no los guardamos directamente
        vehicleId, vehicleName, // en asignaciones_ruta porque ya tenemos los IDs vinculados a las tablas originales
        routeOrigin, routeDestination,
        routeName, routeWaypoints,
        timestamp // El timestamp de la asignación
    } = req.body;

    let id_ruta_asignacion = null;

    try {
        // Para cumplir con la FK de id_ruta en asignaciones_ruta,
        // necesitamos vincular a una ruta existente de la tabla `rutas`.
        // Usaremos la primera ruta de ejemplo que hayamos insertado (id_ruta = 1).
        // En una aplicación real, aquí podrías tener lógica para
        // seleccionar una ruta específica o crear una nueva entrada en `rutas`
        // si la ruta es totalmente dinámica y no predefinida.
        const [firstRoute] = await connection.execute('SELECT id_ruta FROM rutas WHERE id_ruta = 1 LIMIT 1');
        if (firstRoute.length > 0) {
            id_ruta_asignacion = firstRoute[0].id_ruta;
        } else {
            // Si por alguna razón la ruta 1 no existe, insertamos una ruta genérica para poder proceder
            const [newRouteResult] = await connection.execute(
                `INSERT INTO rutas (origen, destino, distancia, id_coordinador) VALUES (?, ?, ?, ?)`,
                [routeOrigin.name || 'Origen Desconocido', routeDestination.name || 'Destino Desconocido', 0.0, 101] // Usamos el coordinador de ejemplo
            );
            id_ruta_asignacion = newRouteResult.insertId;
        }


        // Inserta la asignación en la tabla 'asignaciones_ruta'
        const [result] = await connection.execute(
            `INSERT INTO asignaciones_ruta (
                id_ruta, id_conductor, id_vehiculo, fecha_hora_asignacion, estado,
                route_origin_full_name, route_destination_full_name, route_waypoints
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_ruta_asignacion, // Usamos el id_ruta que obtuvimos/creamos
                driverId,
                vehicleId,
                timestamp,
                'Pendiente', // Estado inicial por defecto
                routeOrigin.name, // Nombre completo del origen geocodificado
                routeDestination.name, // Nombre completo del destino geocodificado
                JSON.stringify(routeWaypoints) // Los waypoints de la ruta generada
            ]
        );
        console.log('Asignación de ruta guardada en MySQL. ID:', result.insertId);
        res.json({ success: true, message: 'Asignación guardada correctamente en la base de datos', assignmentId: result.insertId });
    } catch (err) {
        console.error('Error al guardar la asignación en MySQL:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint opcional: GET /api/asignaciones/:vehicleId - Para obtener la última asignación de un vehículo
app.get('/api/asignaciones/:vehicleId', async (req, res) => {
    const vehicleId = req.params.vehicleId; // Obtiene el ID del vehículo de la URL
    try {
        const [rows] = await connection.execute(
            `SELECT
                ar.id_asignacion,
                ar.id_ruta,
                ar.id_conductor,
                p.nombres AS driverName,
                ar.id_vehiculo,
                v.placa AS vehicleName,
                ar.fecha_hora_asignacion AS timestamp,
                ar.estado,
                ar.route_origin_full_name AS routeOriginName,
                ar.route_destination_full_name AS routeDestinationName,
                ar.route_waypoints
             FROM asignaciones_ruta ar
             JOIN conductores c ON ar.id_conductor = c.id_conductor
             JOIN personas p ON c.id_persona = p.id_persona
             JOIN vehiculos v ON ar.id_vehiculo = v.id_vehiculo
             WHERE ar.id_vehiculo = ?
             ORDER BY ar.fecha_hora_asignacion DESC
             LIMIT 1`,
            [vehicleId]
        );
        if (rows.length > 0) {
            const assignment = rows[0];
            // Convierte la cadena JSON de waypoints de MySQL de nuevo a un objeto JavaScript
            if (assignment.route_waypoints) {
                assignment.route_waypoints = JSON.parse(assignment.route_waypoints);
            }
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'No hay asignación activa para este vehículo.' });
        }
    } catch (err) {
        console.error('Error al obtener asignación activa:', err);
        res.status(500).json({ error: err.message });
    }
});


// Iniciar el servidor Node.js para que empiece a escuchar solicitudes
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log('¡Asegúrate de que tu servidor MySQL esté en ejecución!');
});

// POST /api/conductores: Registrar un nuevo conductor
app.post('/api/conductores', async (req, res) => {
    const {
        nombres,
        apellidos,
        documento,
        celular,
        usuario,
        contrasena,
        email,
        licencia
    } = req.body;

    try {
        const safe = v => v === undefined ? null : v;

        // 1. Insertar en personas
        const [personaResult] = await connection.execute(
            `INSERT INTO personas (nombres, apellidos, documento, celular, usuario, contrasena, email)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                safe(nombres),
                safe(apellidos),
                safe(documento),
                safe(celular),
                safe(usuario),
                safe(contrasena),
                safe(email)
            ]
        );
        const id_persona = personaResult.insertId;

        // 2. Insertar en conductores
        const [conductorResult] = await connection.execute(
            `INSERT INTO conductores (id_conductor, id_persona, licencia)
             VALUES (?, ?, ?)`,
            [id_persona, id_persona, safe(licencia)]
        );

        res.json({ success: true, message: 'Conductor registrado exitosamente', id_conductor: id_persona });
    } catch (err) {
        console.error('Error al registrar conductor:', err);
        res.status(500).json({ success: false, message: 'Error al registrar conductor', error: err.message });
    }
});