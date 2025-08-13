import multer from 'multer';

// Configuración de almacenamiento para multer usando memoria
const storage = multer.memoryStorage();

// Filtros para archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Configuración general de Multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limitar el tamaño del archivo a 5MB
  },
  fileFilter: fileFilter,
});


export const uploadFotoCasa = upload.array('foto_casa', 10); // Máximo 10 archivos
export const uploadFotoPerfil = upload.single('foto_agente'); // Solo un archivo

