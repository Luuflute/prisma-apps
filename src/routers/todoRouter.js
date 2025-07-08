import express from 'express';
import {
  createTodo,
  getAllTodosByUser,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controladores/todoControllers.js';

const router = express.Router({ mergeParams: true });

// --- Middleware para Validación de IDs ---
// Este middleware valida específicamente userId y opcionalmente todoId para todas las rutas que los utilizan.
router.param('userId', (req, res, next, userId) => {
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Formato de ID de usuario inválido.' });
  }
  req.params.userId = parsedUserId; // Asegúrate de que sea un número para los controladores subsiguientes
  next();
});

router.param('todoId', (req, res, next, todoId) => {
  const parsedTodoId = parseInt(todoId);
  if (isNaN(parsedTodoId)) {
    return res.status(400).json({ error: 'Formato de ID de tarea inválido.' });
  }
  req.params.todoId = parsedTodoId; // Asegúrate de que sea un número
  next();
});

// --- Rutas de Tareas (To-Do) ---

// POST /users/:userId/todos - Crear una nueva tarea para un usuario
router.post('/', createTodo);

// GET /users/:userId/todos - Obtener todas las tareas de un usuario específico
router.get('/', getAllTodosByUser);

// GET /users/:userId/todos/:todoId - Obtener una tarea específica por ID para un usuario
router.get('/:todoId', getTodoById);

// PUT /users/:userId/todos/:todoId - Actualizar una tarea específica por ID para un usuario
router.put('/:todoId', updateTodo);

// DELETE /users/:userId/todos/:todoId - Eliminar una tarea específica por ID para un usuario
router.delete('/:todoId', deleteTodo);

export default router;