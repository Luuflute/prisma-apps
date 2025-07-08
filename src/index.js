require('dotenv').config(); 

console.log('--- DEBUG (index.js): Punto 1 - Archivo index.js iniciado. ---');

const app = require('./app');

console.log('--- DEBUG (index.js): Punto 2 - Archivo app.js importado. ---');

const PORT = process.env.PORT || 3000;

console.log(`--- DEBUG (index.js): Punto 3 - Intentando iniciar servidor en puerto ${PORT}. ---`);

app.listen(PORT, () => {
  console.log(`--- DEBUG (index.js): Punto 4 - Servidor corriendo en http://localhost:${PORT}. ---`);
});