// GET /api/pedals — katalog kostek (app/data/pedals.json)
// Serverless odpowiednik endpointu z app/server.js — wersja demo na Vercelu.
const pedals = require('../app/data/pedals.json');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json(pedals);
};

