import { prisma } from '../server.js';

export const createTodo = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'userId inválido en la ruta' });
    }

    // Validar si el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear nueva tarea
    const newTodo = await prisma.todo.create({
      data: {
        label: req.body.label,
        description: req.body.description || null, // <-- Nuevo campo
        completed: req.body.completed || false,
        userId: userId
      }
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllTodosByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const todos = await prisma.todo.findMany({
      where: { userId: userId }
    });
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const todoId = parseInt(req.params.todoId);
    
    const todo = await prisma.todo.findUnique({
      where: { id: todoId }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'Esta tarea no pertenece al usuario especificado' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const todoId = parseInt(req.params.todoId);
    
    // Verificar que la tarea exista y pertenezca al usuario
    const todo = await prisma.todo.findUnique({
      where: { id: todoId }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta tarea' });
    }
    
    // Actualizar la tarea
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        label: req.body.label || todo.label,
        description: req.body.description !== undefined ? req.body.description : todo.description, // <-- Nuevo campo
        completed: req.body.completed !== undefined ? req.body.completed : todo.completed
      }
    });
    
    res.json(updatedTodo);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const todoId = parseInt(req.params.todoId);
    
    // Verificar que la tarea exista y pertenezca al usuario
    const todo = await prisma.todo.findUnique({
      where: { id: todoId }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta tarea' });
    }
    
    // Eliminar la tarea
    const deletedTodo = await prisma.todo.delete({
      where: { id: todoId }
    });
    
    res.json({ message: 'Tarea eliminada', todo: deletedTodo });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};