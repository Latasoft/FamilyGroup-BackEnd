import cors from 'cors';

const defaultOrigins = [
  'https://familygroup-frontend.onrender.com/',
  'http://localhost:4200',
  'https://www.familypropiedades.cl/',
  'https://familygroup-frontend.onrender.com'
];

const env = process.env.ALLOWED_ORIGINS;
const allowedOrigins = (env ? env.split(',') : defaultOrigins)
  .map(u => u.trim().replace(/\/+$/, '')) // quitar slashes finales y espacios
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    const normalizedOrigin = origin ? origin.replace(/\/+$/, '') : origin;
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
