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

// Crear nuevo insumo
async function crearInsumo(datos) {
  const { nombre, unidad, stock = 0, stock_minimo = 0 } = datos;
  const query = `
    INSERT INTO insumos (nombre, unidad, stock, stock_minimo)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, unidad, stock, stock_minimo
  `;
  const { rows } = await pool.query(query, [nombre, unidad, stock, stock_minimo]);
  return rows[0];
}

// Actualizar datos de un insumo existente
async function actualizarInsumo(id, datos) {
  const { nombre, unidad, stock, stock_minimo } = datos;
  const query = `
    UPDATE insumos
    SET nombre = $1, unidad = $2, stock = $3, stock_minimo = $4
    WHERE id = $5
    RETURNING id, nombre, unidad, stock, stock_minimo
  `;
  const { rows } = await pool.query(query, [nombre, unidad, stock, stock_minimo, id]);
  return rows[0];
}

// Reabastecer stock sumando una cantidad
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

// Eliminar un insumo verificando si está en recetas activas
async function eliminarInsumo(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar si algún producto lo utiliza en su receta
    const recetaCheck = await client.query('SELECT id FROM recetas WHERE insumo_id = $1 LIMIT 1', [id]);
    if (recetaCheck.rows.length > 0) {
      throw new Error('No se puede eliminar el insumo porque está asignado a la receta de uno o más productos');
    }

    const { rows } = await client.query('DELETE FROM insumos WHERE id = $1 RETURNING id', [id]);
    if (rows.length === 0) {
      throw new Error('Insumo no encontrado');
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getInsumos,
  crearInsumo,
  actualizarInsumo,
  actualizarStock,
  eliminarInsumo
};