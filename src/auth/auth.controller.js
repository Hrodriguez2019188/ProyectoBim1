import User from '../user/user.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';

export const registrarse = async (req, res) => {
    const { nameUser, email, password, role } = req.body;
    const usuario = new User({ nameUser, email, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

export const login = async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
        
        const usuario = await User.findOne({ email });


        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo no está registrado'
            });
        }
        

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña no coincide'
            });
        }
        

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            msg: 'Se inicio secion',
            usuario,
            token
        });


    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            msg: 'Error, hablele al admin'
        });
    }
}
