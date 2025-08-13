import mongoose from 'mongoose';
import { MONGO_URL } from './config.js'; // Asegúrate de que MONGO_URL esté definido en config.js o en tu .env

class MongoConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      console.log('Ya estás conectado a MongoDB');
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(MONGO_URL);

      console.log('Nueva conexión establecida a MongoDB');
      return this.connection;
    } catch (error) {
      console.error('Error conectando a MongoDB:', error);
      throw error;
    }
  }
}

// Instancia única
const mongoConnectionInstance = new MongoConnection();

// Exportar una función para usar en otras partes del proyecto
export const connectDB = async () => {
  try {
    await mongoConnectionInstance.connect();
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
};
