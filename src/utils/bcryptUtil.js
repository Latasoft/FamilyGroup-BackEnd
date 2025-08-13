import bcrypt from 'bcryptjs';

// Función para encriptar contraseñas
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Función para verificar la contraseña
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
