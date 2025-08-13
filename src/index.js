import app from './app.js';
import {PORT} from './config/config.js';


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
