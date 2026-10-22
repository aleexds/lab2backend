const resumenService = require('../services/resumenService');

async function getResumen(req, res) {
  try {
    const data = await resumenService.getResumenCierreCaja();
    res.json({ ok: true, data });
  } catch (error) {
    console.error('Error al generar resumen:', error);
    res.status(500).json({ ok: false, error: 'Error al calcular el resumen de cierre de caja' });
  }
}

module.exports = {
  getResumen
};