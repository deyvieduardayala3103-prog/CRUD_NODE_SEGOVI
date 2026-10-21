
const db = require('../config/db');

// VALIDAR LOS DATOS DE UNA VENTA
function validarVenta(datos) {
    const idCliente = Number(datos.id_cliente);
    const monto = Number(datos.monto_total);
    const fecha = String(datos.fecha_emision || '');

    const montoCorrecto =
        /^\d{1,10}(\.\d{1,2})?$/.test(String(datos.monto_total));

    const fechaCorrecta =
        /^\d{4}-\d{2}-\d{2}$/.test(fecha);

    return (
        Number.isInteger(idCliente) &&
        idCliente > 0 &&
        montoCorrecto &&
        monto > 0 &&
        fechaCorrecta
    );
}

// 1. LISTAR VENTAS MAYORISTAS
exports.listar = async (req, res) => {
    try {
        const [ventas] = await db.query(`
            SELECT
                v.id_venta,
                v.id_cliente,
                c.razon_social,
                v.monto_total,
                DATE_FORMAT(
                    v.fecha_emision, '%Y-%m-%d'
                ) AS fecha_emision
            FROM venta_mayorista v
            INNER JOIN cliente c
                ON v.id_cliente = c.id_cliente
            ORDER BY v.id_venta DESC
        `);

        res.render('ventas/dashboard', { ventas });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al listar ventas');
    }
};

// 2. MOSTRAR FORMULARIO DE VENTAS
exports.formulario = async (req, res) => {
    try {
        const [clientes] = await db.query(
            'SELECT id_cliente, razon_social FROM cliente'
        );

        let venta = null;

        if (req.params.id) {
            const [filas] = await db.execute(`
                SELECT
                    id_venta,
                    id_cliente,
                    monto_total,
                    DATE_FORMAT(
                        fecha_emision, '%Y-%m-%d'
                    ) AS fecha_emision
                FROM venta_mayorista
                WHERE id_venta = ?
            `, [req.params.id]);

            if (filas.length === 0) {
                return res.status(404).send(
                    'Venta no encontrada'
                );
            }

            venta = filas[0];
        }

        res.render('ventas/formulario', {
            clientes,
            venta
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al mostrar formulario'
        );
    }
};

// 3. REGISTRAR VENTA MAYORISTA
exports.registrar = async (req, res) => {
    try {
        if (!validarVenta(req.body)) {
            return res.status(400).send(
                'Datos de venta incorrectos'
            );
        }

        const {
            id_cliente,
            monto_total,
            fecha_emision
        } = req.body;

        await db.execute(`
            INSERT INTO venta_mayorista
            (id_cliente, monto_total, fecha_emision)
            VALUES (?, ?, ?)
        `, [
            id_cliente,
            monto_total,
            fecha_emision
        ]);

        res.redirect('/ventas');

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al registrar venta'
        );
    }
};

// 4. MOSTRAR DETALLES DE LA VENTA
exports.detalles = async (req, res) => {
    try {
        const [filas] = await db.execute(`
            SELECT
                v.id_venta,
                v.id_cliente,
                c.razon_social,
                v.monto_total,
                DATE_FORMAT(
                    v.fecha_emision, '%Y-%m-%d'
                ) AS fecha_emision
            FROM venta_mayorista v
            INNER JOIN cliente c
                ON v.id_cliente = c.id_cliente
            WHERE v.id_venta = ?
        `, [req.params.id]);

        if (filas.length === 0) {
            return res.status(404).send(
                'Venta no encontrada'
            );
        }

        res.render('ventas/detalles', {
            venta: filas[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al consultar venta'
        );
    }
};

// 5. ACTUALIZAR VENTA MAYORISTA
exports.actualizar = async (req, res) => {
    try {
        if (!validarVenta(req.body)) {
            return res.status(400).send(
                'Datos de venta incorrectos'
            );
        }

        const {
            id_cliente,
            monto_total,
            fecha_emision
        } = req.body;

        const [resultado] = await db.execute(`
            UPDATE venta_mayorista
            SET id_cliente = ?,
                monto_total = ?,
                fecha_emision = ?
            WHERE id_venta = ?
        `, [
            id_cliente,
            monto_total,
            fecha_emision,
            req.params.id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).send(
                'Venta no encontrada'
            );
        }

        res.redirect('/ventas');

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al actualizar venta'
        );
    }
};

// 6. ELIMINAR VENTA MAYORISTA
exports.eliminar = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            'DELETE FROM venta_mayorista WHERE id_venta = ?',
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).send(
                'Venta no encontrada'
            );
        }

        res.redirect('/ventas');

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al eliminar venta'
        );
    }
};

