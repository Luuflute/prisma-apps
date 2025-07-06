const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear Tarea para un Usuario
async function createTodo(req, res) {
  const { userId } = req.params;
  const { label, completed } = req.body;
  try {
    const newTodo = await prisma.todo.create({
      data: {
        label,
        completed: completed !== undefined ? completed : false, // Asegura que 'completed' sea un booleano, por defecto false
        userId: parseInt(userId),
      },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    if (error.code === 'P2003') { // Falla de llave foránea (userId no existe)
      res.status(404).json({ error: 'El usuario especificado no existe.' });
    } else {
      res.status(500).json({ error: 'No se pudo crear la tarea.' });
    }
  }
}

// Obtener Todas las Tareas de un Usuario
async function getTodosByUserId(req, res) {
  const { userId } = req.params;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: parseInt(userId),
      },
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las tareas del usuario.' });
  }
}

// Obtener Tarea Específica de un Usuario
async function getTodoByUserIdAndTodoId(req, res) {
  const { userId, todoId } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id_userId: { // Usa el @@unique definido en schema.prisma
          id: parseInt(todoId),
          userId: parseInt(userId),
        },
      },
    });
    if (!todo) {
      return res.status(404).json({ error: 'Tarea no encontrada para el usuario especificado.' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener la tarea.' });
  }
}

// Actualizar Tarea de un Usuario
async function updateTodo(req, res) {
  const { userId, todoId } = req.params;
  const { label, completed } = req.body;
  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id_userId: { // Usa el @@unique definido en schema.prisma
          id: parseInt(todoId),
          userId: parseInt(userId),
        },
      },
      data: {
        label,
        completed,
      },
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    if (error.code === 'P2025') { // No se encontró el registro para actualizar
      res.status(404).json({ error: 'Tarea no encontrada para actualizar o no pertenece a este usuario.' });
    } else {
      res.status(500).json({ error: 'No se pudo actualizar la tarea.' });
    }
  }
}

// Eliminar Tarea de un Usuario
async function deleteTodo(req, res) {
  const { userId, todoId } = req.params;
  try {
    await prisma.todo.delete({
      where: {
        id_userId: { // Usa el @@unique definido en schema.prisma
          id: parseInt(todoId),
          userId: parseInt(userId),
        },
      },
    });
    res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
  } catch (error) {
    if (error.code === 'P2025') { // No se encontró el registro para eliminar
      res.status(404).json({ error: 'Tarea no encontrada para eliminar o no pertenece a este usuario.' });
    } else {
      res.status(500).json({ error: 'No se pudo eliminar la tarea.' });
    }
  }
}

module.exports = {
  createTodo,
  getTodosByUserId,
  getTodoByUserIdAndTodoId,
  updateTodo,
  deleteTodo,
};