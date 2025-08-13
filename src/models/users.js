import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    primer_nombre: {
        type: String,
        required: true,
        trim: true,
    },
    segundo_nombre: {
        type: String,
        trim: true,
    },
    apellido_paterno: {
        type: String,
        required: true,
        trim: true,
    },
    apellido_materno: {
        type: String,
        required: true,
        trim: true,
    },
    rut: {
        type: String,
        required: true,
        unique: true
        
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    rol_usuario: {
        type: String,
        required: true,
        enum: ['ADMINISTRADOR'], // Solo permite estos valores
    }
});

export const Usuario = mongoose.model('Usuario', userSchema);