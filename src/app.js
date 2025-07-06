console.log('--- DEBUG (app.js): Punto A - Archivo app.js iniciado. ---');

const express = require('express');
const path = require('path'); // <-- ¡AÑADE ESTA LÍNEA!

// Importaciones de rutas usando path.join para mayor robustez
// Asegúrate de que los archivos userRoutes.js y todoRoutes.js estén en la carpeta 'routes'
const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes')); // <-- ¡MODIFICA ESTA LÍNEA!
const todoRoutes = require(path.join(__dirname, 'routes', 'todoRoutes')); // <-- ¡MODIFICA ESTA LÍNEA!

const app = express();
app.use(express.json());

// Rutas de la API
app.use('/users', userRoutes);
app.use('/users', todoRoutes);

app.get('/', (req, res) => {
  res.send('API RESTful de Gestión de Usuarios y Tareas');
});

module.exports = app;