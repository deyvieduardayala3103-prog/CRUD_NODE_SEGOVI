
const db = require('./src/config/db');

async function probarConexion() {
    try {
        const [tablas] = await db.query('SHOW TABLES');

        console.log('Conexion exitosa a MySQL');
        console.log('Base de datos: segovi_ventas');
        console.log('Tablas encontradas:');

        tablas.forEach(tabla => {
            console.log('-', Object.values(tabla)[0]);
        });

    } catch (error) {
        console.error('Error de conexion:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

probarConexion();
