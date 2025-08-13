import { Agente } from "../models/agent.js";
import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../utils/firebaseUtil.js";

// Crear un agente
export const createAgent = async (req, res) => {
  const { nombre, apellido, rut_agente, email_agente, telefono_agente, titulo_agente } = req.body;
  console.log(req.body)
  let fotoAgenteUrl = null;

  try {
    // Validar campos requeridos
    if (!nombre || !apellido || !rut_agente || !telefono_agente || !titulo_agente) {
      return res.status(400).json({ message: "Faltan datos requeridos para crear el agente" });
    }

    // Subir archivo a Firebase si existe
    if (req.file) {
      fotoAgenteUrl = await subirArchivoAFirebase(req.file, "agentes", "foto_agente");
    }

    // Crear agente en la base de datos
    const newAgent = new Agente({
      nombre,
      apellido,
      rut_agente,
      email_agente,
      telefono_agente,
      titulo_agente,
      foto_agente: fotoAgenteUrl,
    });

    await newAgent.save();
    res.status(201).json( {message: "Agente creado exitosamente" });
  } catch (error) {
    console.error("Error creando agente:", error);
    res.status(500).json({ message: "Error creando agente", error: error.message });
  }
};

// Obtener todos los agentes
export const getAgents = async (req, res) => {
  try {
    const agents = await Agente.find();
    res.status(200).json(agents);
  } catch (error) {
    console.error("Error obteniendo agentes:", error);
    res.status(500).json({ message: "Error obteniendo agentes", error: error.message });
  }
};

export const getAgentsPaginated = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));

    const totalAgents = await Agente.countDocuments();

    if (totalAgents === 0) {
      return res.status(404).json({
        message: "No se encontraron agentes.",
        totalAgents: 0,
        currentPage: page,
        totalPages: 0,
        agents: [],
      });
    }

    const totalPages = Math.ceil(totalAgents / limit);

    if (page > totalPages) {
      return res.status(400).json({
        message: `Página no válida. Máximo: ${totalPages}`,
        currentPage: page,
        totalPages,
      });
    }

    const agents = await Agente.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "Agentes obtenidos exitosamente.",
      totalAgents,
      currentPage: page,
      totalPages,
      agents,
    });
  } catch (error) {
    console.error("Error obteniendo agentes:", error);
    res.status(500).json({ message: "Error obteniendo agentes", error: error.message });
  }
};

// Obtener agente por ID
export const getAgentById = async (req, res) => {
  const { _id } = req.params;

  try {
    const agent = await Agente.findById(_id);
    if (!agent) {
      return res.status(404).json({ message: "Agente no encontrado" });
    }
    res.status(200).json(agent);
  } catch (error) {
    console.error("Error obteniendo agente:", error);
    res.status(500).json({ message: "Error obteniendo agente", error: error.message });
  }
};

// Actualizar un agente
export const updateAgent = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    // Verificar si se subió una nueva foto
    if (req.file) {
      const agent = await Agente.findById(_id);
      if (!agent) {
        return res.status(404).json({ message: "Agente no encontrado" });
      }

      // Eliminar la foto anterior si existe
      if (agent.foto_agente) {
        await eliminarArchivoAntiguo(agent.foto_agente);
      }

      // Subir nueva foto
      updates.foto_agente = await subirArchivoAFirebase(req.file, "agentes", "foto_agente");
    }

    // Actualizar agente
    const updatedAgent = await Agente.findByIdAndUpdate(_id, updates, { new: true });
    if (!updatedAgent) {
      return res.status(404).json({ message: "Agente no encontrado" });
    }
    res.status(200).json({ message: "Agente actualizado exitosamente"});
  } catch (error) {
    console.error("Error actualizando agente:", error);
    res.status(500).json({ message: "Error actualizando agente", error: error.message });
  }
};

// Desactivar un agente
export const desactivatedAgent = async (req, res) => {
  const { _id } = req.params;

  try {
    const agent = await Agente.findByIdAndUpdate(_id, { is_active: false }, { new: true });
    if (!agent) {
      return res.status(404).json({ message: "Agente no encontrado" });
    }
    res.status(200).json({ message: "Agente desactivado exitosamente", agent });
  } catch (error) {
    console.error("Error desactivando agente:", error);
    res.status(500).json({ message: "Error desactivando agente", error: error.message });
  }
};
