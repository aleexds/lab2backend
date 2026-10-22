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

async function getDatosIA(req, res) {
  try {
    const data = await resumenService.getDatosParaIA();
    res.json({ ok: true, data });
  } catch (error) {
    console.error('Error al obtener datos para IA:', error);
    res.status(500).json({ ok: false, error: 'Error al consultar datos para IA' });
  }
}

module.exports = {
  getResumen,
  getDatosIA
};