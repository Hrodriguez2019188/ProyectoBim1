import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { userPutAdmin , userPutClient, deleteUser} from '../user/user.controller.js';
import { tieneRole } from '../middlewares/validar-roles.js';
import { existeUsuarioById } from '../helpers/db-validators.js';

const router = Router();

router.put("/:id", [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], userPutAdmin);

router.put("/put/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], userPutClient);

router.delete("/:id", [
    validarJWT,
    tieneRole('CLIENT_ROLE', 'ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id'),
    validarCampos
], deleteUser);


export default router;
