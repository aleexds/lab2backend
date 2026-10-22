const { pool } = require('../db');

// Listar todos los insumos ordenados por id
async function getInsumos() {
    const query = `
        SELECT id, nombre, unidad, stock, stock_minimo
        FROM insumos
        ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
}

// Reabastecer o actualizar el stock de un insumo específico
async function actualizarStock(id, cantidadASumar) {
    const query = `
        UPDATE insumos
        SET stock = stock + $1
        WHERE id = $2
        RETURNING id, nombre, unidad, stock, stock_minimo
    `;
    const { rows } = await pool.query(query, [cantidadASumar, id]);
    return rows[0];
}

module.exports = {
    getInsumos,
    actualizarStock
};