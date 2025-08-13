import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { FIREBASE_STORAGE_BUCKET } from "./config.js";

// Convertir `import.meta.url` a una ruta válida
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al archivo de credenciales
const serviceAccountPath = "/etc/secrets/firebase-key.json";

// Leer el archivo JSON de credenciales
const serviceAccount = JSON.parse(
  await fs.readFile(serviceAccountPath, "utf-8")
);

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `gs://${FIREBASE_STORAGE_BUCKET}`, // Bucket desde el archivo .env o config.js
});

// Acceso al bucket de Storage
const bucket = admin.storage().bucket();

export { bucket };
