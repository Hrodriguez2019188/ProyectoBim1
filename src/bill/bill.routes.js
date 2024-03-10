import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { buyBill, updateBilling, userBillings } from './bill.controller.js';
import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

router.post('/buyBill', [validarJWT, validarRol], buyBill);

router.put('/billChange/:id', [validarJWT, validarRol], updateBilling);

router.get('/checks/:userId', [validarJWT, validarRol], userBillings);
router.get(
  '/userchecks/:userId',
  [validarJWT, validarRol],
  userBillings
);

export default router;