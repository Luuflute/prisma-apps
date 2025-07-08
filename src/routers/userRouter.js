import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controladores/userControllers.js';

const router = express.Router();

// --- Middleware para Validación del ID de Usuario ---
// Este middleware se ejecuta cuando Express encuentra un parámetro ':id' en las rutas.
// Asegura que el 'id' sea un número válido antes de pasar la solicitud a los controladores.
router.param('id', (req, res, next, id) => {
  const parsedId = parseInt(id); // Intenta convertir el ID a un entero

  // Si la conversión falla (no es un número), envía un error 400
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Formato de ID de usuario inválido. El ID debe ser un número.' });
  }

  // Si es un número válido, lo asigna de nuevo a req.params para asegurar que sea numérico
  // y luego pasa al siguiente middleware o controlador.
  req.params.id = parsedId;
  next();
});

// --- Rutas de Usuarios ---

// POST /users - Crear un nuevo usuario
router.post('/', createUser);

// GET /users - Obtener todos los usuarios
router.get('/', getAllUsers);

// GET /users/:id - Obtener un usuario por su ID
router.get('/:id', getUserById);

// PUT /users/:id - Actualizar un usuario por su ID
router.put('/:id', updateUser);

// DELETE /users/:id - Eliminar un usuario por su ID
router.delete('/:id', deleteUser);

export default router;