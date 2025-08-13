import { Propiedad } from "../models/property.js";
import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../utils/firebaseUtil.js";

export const createProperty = async (req, res) => {
    const {
        nombre,
        direccion,
        descripcion,
        region,
        comuna,
        banos,
        dormitorios,
        superficie,
        precio_valor,
        precio_moneda,
        tipo_propiedad,
        tipo_operacion,
        detalles_adicionales,
        detalles_destacados,
        is_Activated,
        mostrar_propiedad,
        propiedad_destacada, // Recibir propiedad destacada
        agent
    } = req.body;

    // Convertir campos a sus tipos esperados antes de validar
    const banosParsed = parseInt(banos, 10);
    const dormitoriosParsed = parseInt(dormitorios, 10);
    const precio = {
        valor: parseFloat(precio_valor),
        moneda: precio_moneda,
    };
    const mostrarPropiedadParsed = mostrar_propiedad === 'true';
    const isActivatedParsed = is_Activated === 'true'; // Convertir a booleano si es enviado como string
    const propiedadDestacadaParsed = propiedad_destacada === 'true'; // Convertir propiedad destacada a booleano

    // Validar que no falten campos obligatorios
    if (!nombre || !direccion || !descripcion || !region || !comuna || isNaN(banosParsed) || isNaN(dormitoriosParsed) || !precio.valor || !tipo_propiedad) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No se recibieron imágenes' });
    }

    // Subir imágenes a Firebase
    const uploadPromises = req.files.map((file) =>
        subirArchivoAFirebase(file, "propiedades", "foto_casa")
    );
    const fotosUrls = await Promise.all(uploadPromises);

    try {
        // Crear una nueva propiedad
        const newProperty = new Propiedad({
            nombre,
            direccion,
            descripcion,
            region,
            comuna,
            banos: banosParsed,
            dormitorios: dormitoriosParsed,
            superficie: parseFloat(superficie),
            precio,
            tipo_propiedad,
            foto_casa: fotosUrls.map((url) => ({ url })), // Mapear URLs en un array de objetos
            agent,
            tipo_operacion,
            detalles_adicionales,
            detalles_destacados,
            is_Activated: isActivatedParsed,
            mostrar_propiedad:mostrarPropiedadParsed,
            propiedad_destacada: propiedadDestacadaParsed, // Asignar propiedad destacada
        });

        await newProperty.save();

        return res.status(201).json({ message: "Propiedad creada exitosamente", property: newProperty });
    } catch (error) {
        console.error("Error creando propiedad:", error);
        return res.status(500).json({ message: "Error creando propiedad", error: error.message });
    }
};

export const getAllProperties = async (req, res) => {
    try {
        // Obtener y loguear los parámetros de consulta
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
        console.log(`[INFO] Parámetros recibidos: page=${page}, limit=${limit}`);

        // Contar las propiedades activas
        const totalProperties = await Propiedad.countDocuments({ is_activated: true });
        console.log(`[INFO] Total de propiedades activas: ${totalProperties}`);

        if (totalProperties === 0) {
            console.log('[WARN] No se encontraron propiedades activas.');
            return res.status(404).json({
                message: 'No se encontraron propiedades activas.',
                totalProperties: 0,
                currentPage: page,
                totalPages: 0,
                properties: [],
            });
        }

        // Calcular el total de páginas y validar la página solicitada
        const totalPages = Math.ceil(totalProperties / limit);
        console.log(`[INFO] Total de páginas: ${totalPages}`);

        if (page > totalPages) {
            console.log(`[ERROR] Página no válida: ${page}. Máximo permitido: ${totalPages}`);
            return res.status(400).json({
                message: `Página no válida. Máximo: ${totalPages}`,
                currentPage: page,
                totalPages,
            });
        }

        // Obtener las propiedades activas con paginación y población de datos
        console.log('[INFO] Consultando propiedades activas con paginación...');
        let properties = await Propiedad.find({ is_activated: true })
            .populate({
                path: 'agent',
                match: { is_active: true },
                select: 'nombre apellido telefono_agente email_agente foto_agente',
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        console.log(`[INFO] Propiedades obtenidas: ${properties.length}`);

        // Filtrar propiedades duplicadas (si es necesario)
        const uniqueProperties = properties.filter(
            (property, index, self) =>
                index === self.findIndex((p) => p._id.toString() === property._id.toString())
        );
        console.log(`[INFO] Propiedades únicas después del filtrado: ${uniqueProperties.length}`);

        // Enviar la respuesta al cliente
        console.log('[INFO] Enviando respuesta al cliente...');
        res.status(200).json({
            message: 'Propiedades obtenidas exitosamente.',
            totalProperties,
            currentPage: page,
            totalPages,
            properties: uniqueProperties,
        });
    } catch (error) {
        console.error('[ERROR] Error obteniendo propiedades:', error);
        res.status(500).json({ message: 'Error obteniendo propiedades', error: error.message });
    }
};

  
  

  export const getAllPropertiesIncludingInactive = async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  
      console.log('Parámetros recibidos para todas las propiedades:', { page, limit });
  
      const totalProperties = await Propiedad.countDocuments();
      if (totalProperties === 0) {
        return res.status(404).json({
          message: 'No se encontraron propiedades.',
          totalProperties: 0,
          currentPage: page,
          totalPages: 0,
          properties: [],
        });
      }
  
      const totalPages = Math.ceil(totalProperties / limit);
      if (page > totalPages) {
        return res.status(400).json({
          message: `Página no válida. Máximo: ${totalPages}`,
          currentPage: page,
          totalPages,
        });
      }
  
      const properties = await Propiedad.find() // No se filtra por is_Activated
        .populate({
          path: 'agent',
          match: { is_active: true },
          select: 'nombre apellido telefono_agente email_agente foto_agente',
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
  
      res.status(200).json({
        message: 'Todas las propiedades obtenidas exitosamente.',
        totalProperties,
        currentPage: page,
        totalPages,
        properties,
      });
    } catch (error) {
      console.error('Error obteniendo todas las propiedades:', error);
      res.status(500).json({ message: 'Error obteniendo todas las propiedades', error: error.message });
    }
  };
  
export const getPropertyByType = async (req, res) => {
    const{tipo_operacion} = req.params;
    try {
        const properties = await Propiedad.find({tipo_operacion: tipo_operacion});
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error obteniendo propiedades por tipo:', error);
        res.status(500).json({ message: 'Error obteniendo propiedades por tipo', error: error.message });
    }
};


export const getFeaturedProperties = async (req, res) => {
    try {
        // Filtrar propiedades donde propiedad_destacada es true
        const featuredProperties = await Propiedad.find({ mostrar_propiedad: true }) 
            .populate({
                path: 'agent', // Relación con el modelo 'Agente'
                select: 'nombre apellido telefono_agente titulo_agente foto_agente', // Campos que deseas obtener
            });

        if (!featuredProperties.length) {
            return res.status(404).json({ message: 'No se encontraron propiedades destacadas' });
        }

        res.status(200).json({ properties: featuredProperties });
    } catch (error) {
        console.error('Error al obtener propiedades destacadas:', error);
        res.status(500).json({ message: 'Error al obtener propiedades destacadas', error: error.message });
    }
};


export const updateProperty = async (req, res) => {
    const { _id } = req.params;
    let updates = req.body; // Datos enviados desde el frontend
    const newFiles = req.files; // Nuevas imágenes subidas (si las hay)

    console.log('Actualizando propiedad con ID:', _id);
    try {
        // Obtener la propiedad existente
        const property = await Propiedad.findById(_id);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }

        // 💡 Verificar si `precio_valor` y `precio_moneda` están en `updates` y reconstruir `precio`
        if (updates.precio_valor !== undefined && updates.precio_moneda !== undefined) {
            updates.precio = {
                valor: parseFloat(updates.precio_valor.replace(/\./g, '')), // Asegurar que es un número
                moneda: updates.precio_moneda
            };
            delete updates.precio_valor;
            delete updates.precio_moneda;
        }

        // Manejo de imágenes (sin cambios)
        if (newFiles && newFiles.length > 0) {
            const existingImages = property.foto_casa.map((img) => img.url);

            // Subir nuevas imágenes
            const uploadPromises = newFiles.map((file) =>
                subirArchivoAFirebase(file, "propiedades", "foto_casa")
            );
            const newImageUrls = await Promise.all(uploadPromises);

            updates.foto_casa = updates.foto_casa || [];

            // Eliminar imágenes que ya no estén presentes
            const imagesToRemove = existingImages.filter(
                (url) => !updates.foto_casa.includes(url)
            );
            const deletePromises = imagesToRemove.map((url) => eliminarArchivoAntiguo(url));
            await Promise.all(deletePromises);

            // Combinar imágenes existentes (que permanecen) con las nuevas
            updates.foto_casa = [
                ...(updates.foto_casa || []).filter((url) => existingImages.includes(url)), // Mantener las existentes
                ...newImageUrls.map((url) => ({ url })), // Agregar nuevas
            ];
        }

        console.log("Datos finales para actualizar:", updates);

        // Actualizar otros campos de la propiedad
        const updatedProperty = await Propiedad.findByIdAndUpdate(_id, updates, { new: true });

        res.status(200).json({ message: "Propiedad actualizada exitosamente", property: updatedProperty });
    } catch (error) {
        console.error("Error actualizando propiedad:", error);
        res.status(500).json({ message: "Error actualizando propiedad", error: error.message });
    }
};


export const getPropertyById = async (req, res) => {
    const { _id } = req.params;

    try {
        // Buscar la propiedad por ID y popular el campo 'agent'
        const property = await Propiedad.findById(_id).populate('_id');
        if (!property) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }

        res.status(200).json(property);
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        res.status(500).json({ message: 'Error obteniendo propiedad', error: error.message });
    }
};

export const desactivateProperty = async (req, res) => {
    const { _id } = req.params;

    try {
        const property = await Propiedad.findByIdAndUpdate(
            _id,
            { is_activated: false },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }

        res.status(200).json({ message: 'Propiedad desactivada exitosamente', property });
    } catch (error) {
        console.error('Error desactivando propiedad:', error);
        res.status(500).json({ message: 'Error desactivando propiedad', error: error.message });
    }
};


const buildFilterQuery = (query) => {
    const filter = {};

    try {
        if (query.tipo_operacion) {
            filter.tipo_operacion = query.tipo_operacion.toUpperCase().trim();
        }

        if (query.tipo_propiedad) {
            filter.tipo_propiedad = query.tipo_propiedad.toUpperCase().trim();
        }

        if (query.comuna && typeof query.comuna === 'string' && query.comuna.trim() !== '') {
            filter.comuna = { $regex: query.comuna.trim(), $options: 'i' }; // Se elimina el `^` y `$`
        }
        

         if (query.precio_min || query.precio_max) {
            filter["precio.valor"] = {}; // Asegurarse de inicializar el objeto

            if (query.precio_min) {
                filter["precio.valor"].$gte = Number(query.precio_min); // Convertir a número
            }

            if (query.precio_max) {
                filter["precio.valor"].$lte = Number(query.precio_max); // Convertir a número
            }
        }

        // Filtro por moneda
        if (query.moneda) {
            filter["precio.moneda"] = query.moneda.toUpperCase().trim();
        }

        if (query.dormitorios) {
            filter.dormitorios = parseInt(query.dormitorios);
        }

        if (query.banos) {
            filter.banos = parseInt(query.banos);
        }

        filter.is_activated  = true;
        filter.mostrar_propiedad = true;

        return filter;
    } catch (error) {
        console.error('Error en buildFilterQuery:', error);
        throw new Error(`Error al construir el filtro: ${error.message}`);
    }
};
export const getFilteredProperties = async (req, res) => {
    try {
        console.log('Query recibido:', JSON.stringify(req.query, null, 2));
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Construir el filtro
        const filter = buildFilterQuery(req.query);

        
        // Ejecutar la consulta
        const [properties, totalProperties] = await Promise.all([
            Propiedad.find(filter)
                .populate({
                    path: 'agent',
                    select: 'nombre apellido telefono_agente email_agente foto_agente'
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Propiedad.countDocuments(filter)
        ]);

        // Si no hay propiedades, devolver un array vacío pero no un error
        if (!properties.length) {
            return res.status(200).json({
                message: 'No se encontraron propiedades con los filtros especificados.',
                currentPage: page,
                totalPages: 0,
                totalProperties: 0,
                properties: []
            });
        }

        const totalPages = Math.ceil(totalProperties / limit);

        res.status(200).json({
            message: 'Propiedades filtradas obtenidas con éxito.',
            currentPage: page,
            totalPages,
            totalProperties,
            properties
        });

    } catch (error) {
        console.error('Error en getFilteredProperties:', error);
        res.status(500).json({
            message: 'Error al filtrar propiedades',
            error: error.message
        });
    }
};

export const getPropertyByIdWithAgent = async (req, res) => {
    const { _id } = req.params;

    try {
        // Buscar la propiedad por ID y popular el campo 'agent'
        const property = await Propiedad.findById(_id).populate('agent','nombre apellido telefono_agente titulo_agente foto_agente');
        if (!property) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }

        res.status(200).json(property);
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        res.status(500).json({ message: 'Error obteniendo propiedad', error: error.message });
    }
};