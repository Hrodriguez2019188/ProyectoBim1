import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/validar-roles.js';

import { cartDataSave, cartDataDelete } from './cart.controller.js';
const router = Router();
router.post(
  '/',
  [
    check('cDate', 'Date required').not().isEmpty(),
    check('user', 'User required').not().isEmpty(),
    check('product', 'Product Required').not().isEmpty(),
    check('quantity', 'Quantity required').not().isEmpty(),
    validarJWT,
  ],
  cartDataSave
);
router.delete(
  '/delete/:id',
  [
    
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validarJWT,
    tieneRole('CLIENT_ROLE'),
  ],
  cartDataDelete
);

export default router;
