const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear Usuario
async function createUser(req, res) {
  const { username, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') { // Error de entrada única duplicada (username o email)
      res.status(409).json({ error: 'El username o email ya existe.' });
    } else {
      res.status(500).json({ error: 'No se pudo crear el usuario.' });
    }
  }
}

// Obtener Todos los Usuarios
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los usuarios.' });
  }
}

// Obtener Usuario por ID
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el usuario.' });
  }
}

// Actualizar Usuario
async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username,
        email,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') { // No se encontró el registro para actualizar
      res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });
    } else if (error.code === 'P2002') { // Conflicto por username/email duplicado
      res.status(409).json({ error: 'El username o email ya está en uso.' });
    }
    else {
      res.status(500).json({ error: 'No se pudo actualizar el usuario.' });
    }
  }
}

// Eliminar Usuario
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    if (error.code === 'P2025') { // No se encontró el registro para eliminar
      res.status(404).json({ error: 'Usuario no encontrado para eliminar.' });
    } else if (error.code === 'P2003') { // Falla de llave foránea (si hay todos asociados)
      res.status(409).json({ error: 'No se puede eliminar el usuario porque tiene tareas asociadas. Elimine las tareas primero.' });
    }
    else {
      res.status(500).json({ error: 'No se pudo eliminar el usuario.' });
    }
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};