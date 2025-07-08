console.log('--- DEBUG (app.js): Punto A - Archivo app.js iniciado. ---');

const express = require('express');
const path = require('path'); // Necesitas 'path' para path.join

// Corrige las rutas de importación añadiendo '.js'
const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes.js'));
const todoRoutes = require(path.join(__dirname, 'routes', 'todoRoutes.js'));

const app = express();
app.use(express.json());

//rutas
app.use('/users', userRoutes);
app.use('/users', todoRoutes); 

app.get('/', (req, res) => {
  res.send('API RESTful de Gestión de Usuarios y Tareas');
});

module.exports = app;