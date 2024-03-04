import { Router } from 'express';
import { check } from 'express-validator';
import { login, registrarse } from '../auth/auth.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existenteEmail } from '../helpers/db-validators.js';

const router = Router();

router.post(
    '/registrarse', 
    [
        check('nameUser', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser de más de 6 letras').isLength({ min: 6 }),
        check('email', 'El correo no es válido').isEmail(),
        check('email').custom(existenteEmail),
        validarCampos
    ], 
    registrarse
);

router.post(
    '/login',
    [
        check('email', 'El email no es un correo valido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], 
    login
);

export default router;
