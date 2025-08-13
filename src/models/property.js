import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    tipo_operacion: {
        type: String,
        required: true,
        enum: ['VENTA', 'ARRIENDO','ARRIENDO_MENSUAL','ARRIENDO_DIARIO'], // Solo permite estos valores
    },

    direccion: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    region: {
        type: String,
        required: true,
      },
    comuna: {
        type: String,
        required: true,
      },
    banos: {
        type: Number,
        required: true,
      },
    dormitorios: {
        type: Number,
        required: true,
      },
      precio: {
        valor: { 
            type: Number, 
            required: true,
            set: v => parseFloat(v.toString().replace(/\./g, '')), // Elimina los puntos al guardar
            get: v => v.toLocaleString('es-CL') // Formatea con puntos al obtener
        },
        moneda: { type: String, enum: ['CLP', 'UF'], required: true },
    },
    tipo_propiedad: {
        type: String,
        required: true,
        enum: ['CASA', 'DEPARTAMENTO', 'LOCAL COMERCIAL', 'TERRENO'], // Solo permite estos valores
    },
    foto_casa: [
        {
            url: {
                type: String,
                required: true,
            },
        }
    ]
    ,
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agente',
    },
    detalles_adicionales: {
        type: String,
        required: true,
        trim: true,
    },
    detalles_destacados:{
        type: String,
        required: true,
        trim: true,
    },
    superficie:{
        type: Number,
        required: true,
    },
    propiedad_destacada:{
        type:Boolean,
        required:false
    },
    mostrar_propiedad:{ type: Boolean, required:true},
    is_activated: { type: Boolean, default: true } // Agregar este campo para controlar el estado

    
});

export const Propiedad = mongoose.model('Propiedade', propertySchema);