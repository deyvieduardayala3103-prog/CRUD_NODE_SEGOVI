
const db = require('../config/db');

// LISTAR CLIENTES MAYORISTAS
exports.listar = async (req, res) => {
    try {
        const [clientes] = await db.query(`
            SELECT c.*, e.nombre AS asesor
            FROM cliente c
            INNER JOIN asesor_comercial a
                ON c.id_asesor = a.id_asesor
            INNER JOIN empleado e
                ON a.id_empleado = e.id_empleado
            ORDER BY c.id_cliente DESC
        `);

        res.render('client/dashboard', { clientes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al listar clientes');
    }
};

// MOSTRAR FORMULARIO DE REGISTRO O EDICION
exports.formulario = async (req, res) => {
    try {
        const [asesores] = await db.query(`
            SELECT a.id_asesor, e.nombre
            FROM asesor_comercial a
            INNER JOIN empleado e
                ON a.id_empleado = e.id_empleado
        `);

        let cliente = null;

        if (req.params.id) {
            const [filas] = await db.execute(
                'SELECT * FROM cliente WHERE id_cliente = ?',
                [req.params.id]
            );

            if (filas.length === 0) {
                return res.status(404).send('Cliente no encontrado');
            }

            cliente = filas[0];
        }

        res.render('client/solicita', { cliente, asesores });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al abrir formulario');
    }
};

// REGISTRAR CLIENTE
exports.registrar = async (req, res) => {
    try {
        const { id_asesor, razon_social, ruc_dni, celular } = req.body;

        if (!id_asesor || !razon_social?.trim() || !ruc_dni?.trim()) {
            return res.status(400).send('Faltan datos obligatorios');
        }

        await db.execute(`
            INSERT INTO cliente
            (id_asesor, razon_social, ruc_dni, celular)
            VALUES (?, ?, ?, ?)
        `, [
            id_asesor,
            razon_social.trim(),
            ruc_dni.trim(),
            celular || null
        ]);

        res.redirect('/clientes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar cliente');
    }
};

// CONSULTAR DETALLES
exports.detalles = async (req, res) => {
    try {
        const [filas] = await db.execute(`
            SELECT c.*, e.nombre AS asesor
            FROM cliente c
            INNER JOIN asesor_comercial a
                ON c.id_asesor = a.id_asesor
            INNER JOIN empleado e
                ON a.id_empleado = e.id_empleado
            WHERE c.id_cliente = ?
        `, [req.params.id]);

        if (filas.length === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.render('client/detalles', {
            cliente: filas[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al consultar cliente');
    }
};

// ACTUALIZAR CLIENTE
exports.actualizar = async (req, res) => {
    try {
        const { id_asesor, razon_social, ruc_dni, celular } = req.body;

        if (!id_asesor || !razon_social?.trim() || !ruc_dni?.trim()) {
            return res.status(400).send('Faltan datos obligatorios');
        }

        const [resultado] = await db.execute(`
            UPDATE cliente
            SET id_asesor = ?,
                razon_social = ?,
                ruc_dni = ?,
                celular = ?
            WHERE id_cliente = ?
        `, [
            id_asesor,
            razon_social.trim(),
            ruc_dni.trim(),
            celular || null,
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.redirect('/clientes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar cliente');
    }
};

// ELIMINAR CLIENTE
exports.eliminar = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            'DELETE FROM cliente WHERE id_cliente = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.redirect('/clientes');
    } catch (error) {
        console.error(error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send(
                'No se puede eliminar un cliente con ventas registradas'
            );
        }

        res.status(500).send('Error al eliminar cliente');
    }
};
