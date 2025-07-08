import { prisma } from '../server.js';

/**
 * Handles common Prisma errors and sends appropriate HTTP responses.
 * @param {object} res - The Express response object.
 * @param {Error} error - The caught error object.
 */
const handlePrismaError = (res, error) => {
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      return res.status(409).json({ error: 'Duplicate entry: Username or email already exists.', details: error.meta?.target });
    case 'P2025': // Record not found (e.g., for update/delete)
      return res.status(404).json({ error: 'Resource not found.' });
    case 'P2003': // Foreign key constraint violation
      return res.status(400).json({ error: 'Related record not found or cannot be deleted.', details: error.meta?.field_name });
    default:
      // Catch-all for unexpected errors
      console.error('Unhandled Prisma error:', error); // Log the full error for debugging
      return res.status(500).json({ error: 'An unexpected server error occurred.', details: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required fields.' });
    }

    const newUser = await prisma.user.create({
      data: { username, email },
    });

    res.status(201).json(newUser);
  } catch (error) {
    handlePrismaError(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    // For read operations, a 500 is usually appropriate for database issues
    res.status(500).json({ error: 'Failed to retrieve users.', details: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Please provide a number.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User with the specified ID not found.' });
    }

    res.json(user);
  } catch (error) {
    // For single read operations, a 500 is usually appropriate for database issues
    res.status(500).json({ error: 'Failed to retrieve user.', details: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body; // Allow partial updates

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Please provide a number.' });
    }

    // Optional: Add validation for updateData if specific fields are expected
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No update data provided.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json(updatedUser);
  } catch (error) {
    handlePrismaError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format. Please provide a number.' });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User successfully deleted.', user: deletedUser });
  } catch (error) {
    handlePrismaError(res, error);
  }
};