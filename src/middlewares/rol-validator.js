import User from '../user/user.js'; 

export const validarRol = async (req, res, next) => {
        const { ...resto } = req.body; 
        
        try {
            let idUsuario = resto.idUsuario;
            const usuario = await User.findById(idUsuario);
            console.log(usuario.role);
            
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            
            if (usuario.role != "ADMIN_ROLE") {
                return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta función' });
            }

            next();

        } catch (error) {
            console.error("Error al buscar el usuario:", error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
};
