import { bucket } from '../config/firebaseConfig.js';
import { FIREBASE_STORAGE_BUCKET } from '../config/config.js';

// Subir un archivo a Firebase Storage y obtener la URL pública
export async function subirArchivoAFirebase(archivo, carpeta, tipoArchivo) {
  if (!bucket) {
    throw new Error('El bucket no está configurado correctamente.');
  }

  if (!archivo || !archivo.originalname || !archivo.buffer) {
    throw new Error('El archivo es inválido o no tiene las propiedades esperadas.');
  }

  const uniqueFileName = `${carpeta}/${Date.now()}_${archivo.originalname}`;
  console.log(`Subiendo archivo a Firebase con nombre: ${uniqueFileName}`);
  const blob = bucket.file(uniqueFileName);

  const blobStream = blob.createWriteStream({ resumable: false });

  return new Promise((resolve, reject) => {
    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${FIREBASE_STORAGE_BUCKET}/${uniqueFileName}`;
        console.log(`Archivo subido exitosamente: ${publicUrl}`);
        resolve(publicUrl);
      } catch (error) {
        console.error(`Error al hacer público el ${tipoArchivo}:`, error);
        reject(error);
      }
    });

    blobStream.on('error', (err) => {
      console.error(`Error al subir ${tipoArchivo} a Firebase Storage:`, err);
      reject(err);
    });

    blobStream.end(archivo.buffer);
  });
}

// Eliminar un archivo de Firebase Storage
export async function eliminarArchivoAntiguo(url) {
  if (!url) {
    console.warn('No se proporcionó URL para eliminar el archivo.');
    return;
  }

  const fileName = url.split(`${FIREBASE_STORAGE_BUCKET}/`)[1];
  const file = bucket.file(fileName);

  try {
    await file.delete();
    console.log(`Archivo eliminado exitosamente: ${url}`);
  } catch (error) {
    console.warn('No se pudo eliminar el archivo anterior:', error.message);
  }
}
