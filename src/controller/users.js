import { Usuario } from '../models/users.js'; // Importa el modelo
import {hashPassword} from '../utils/bcryptUtil.js'; // Importa la función para encriptar la contraseña
// Crear un usuario
export const createUser = async (req, res) => {
  const { primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, rut, email, password, rol_usuario } = req.body;

  const Password = await hashPassword(password);
  try {
    const newUser = new Usuario({
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      rut,
      email,
      password: Password,
      rol_usuario,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ message: 'Error creando usuario', error: error.message });
  }
};

// Leer todos los usuarios
export const getUsers = async (req, res) => {
  try {
    // Parámetros de paginación
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));

    console.log('Parámetros recibidos para obtener usuarios:', { page, limit });

    // Contar el total de usuarios
    const totalUsers = await Usuario.countDocuments();

    // Verificar si hay usuarios
    if (totalUsers === 0) {
      return res.status(404).json({
        message: 'No se encontraron usuarios.',
        totalUsers: 0,
        currentPage: page,
        totalPages: 0,
        users: [],
      });
    }

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalUsers / limit);

    // Validar que la página solicitada sea válida
    if (page > totalPages) {
      return res.status(400).json({
        message: `Página no válida. Máximo: ${totalPages}`,
        currentPage: page,
        totalPages,
      });
    }

    // Obtener usuarios con paginación
    const users = await Usuario.find()
      .skip((page - 1) * limit) // Saltar los documentos de las páginas anteriores
      .limit(limit) // Limitar el número de documentos
      .lean();

    // Respuesta exitosa
    res.status(200).json({
      message: 'Usuarios obtenidos exitosamente.',
      totalUsers,
      currentPage: page,
      totalPages,
      users,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error obteniendo usuarios', error: error.message });
  }
};


// Leer un usuario por ID
export const getUserById = async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await Usuario.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error obteniendo usuario', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.params;
  const updates = { ...req.body };

  try {
    const existingUser = await Usuario.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si se debe actualizar la contraseña
    let hashedPassword = existingUser.password; // Mantener la contraseña existente
    if (updates.password) {
      hashedPassword = await hashPassword(updates.password);
    }

    // Actualizar los datos del usuario, incluyendo la contraseña si cambió
    await Usuario.findByIdAndUpdate(
      _id,
      { ...updates, password: hashedPassword },
      { new: false } // No devolver los nuevos datos
    );

    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
};

// Desactivar un usuario
export const desactivatedUser = async (req, res) => {
  const { _id } = req.params;


  try {
    const user = await Usuario.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.is_active = false;

    await user.save();
    
    res.status(200).json({ message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error eliminando usuario', error: error.message });
  }
};
