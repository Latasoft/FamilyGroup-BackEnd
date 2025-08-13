import mongoose from "mongoose";


const agentSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    rut_agente: {
        type: String,
        required: true,
        unique: true
    },
    email_agente:{

    },
    telefono_agente: {
        type: String,
        required: true,
    },
    titulo_agente: {
        type: String,
        required: true,
    },
    is_active:{
        type: Boolean,
        default: true,

    },
    foto_agente: {
        type: String,
    }

});

export const Agente = mongoose.model('Agente', agentSchema);