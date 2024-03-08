import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { userPut } from '../user/user.controller.js';
import { tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

router.put("/:id", [
    validarJWT,
    tieneRole,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], userPut);



export default router;
