import bcryptjs from 'bcryptjs';
import User from '../user/user.js';

export const userPut = async (req, res) => {
    try {
        const { id } = req.params;
        const {nameUser, email, oldPassword, newPassword} = req.body;

        const usuarioAutenticado = req.usuario;
        const idCoincide = usuarioAutenticado._id.toString() === id;
        const tienePermiso = usuarioAutenticado.role === 'ADMIN_ROLE';

        if (!idCoincide || !tienePermiso) {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar este usuario',
            });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                msg: 'Debes proporcionar tanto la contraseña anterior como la nueva para actualizar',
            });
        }

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado',
            });
        }

        const contrasenaValida = await bcryptjs.compare(oldPassword, usuario.password);
        if (!contrasenaValida) {
            return res.status(400).json({
                msg: 'La contraseña anterior no es válida',
            });
        }

        if (nameUser) {
            usuario.nameUser = nameUser;
        }
        if (email) {
            usuario.email = email;
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        usuario.password = hashedPassword;
        await usuario.save();

        res.status(200).json({
            msg: 'Se actualizó el perfil correctamente',
            usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export default userPut;