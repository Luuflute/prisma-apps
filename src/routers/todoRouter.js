const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Rutas para Tareas (ToDos)
router.post('/:userId/todos', todoController.createTodo); // POST /users/:userId/todos
router.get('/:userId/todos', todoController.getTodosByUserId); // GET /users/:userId/todos
router.get('/:userId/todos/:todoId', todoController.getTodoByUserIdAndTodoId); // GET /users/:userId/todos/:todoId
router.put('/:userId/todos/:todoId', todoController.updateTodo); // PUT /users/:userId/todos/:todoId
router.delete('/:userId/todos/:todoId', todoController.deleteTodo); // DELETE /users/:userId/todos/:todoId

module.exports = router;