import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import {

  productGet,
  productPost,
  findProducts,
  productPut,
  productDelete,
  productsByCategory,
  productOrder,
} from './product.controller.js';

import { validarRol } from '../middlewares/rol-validator.js';
const router = Router();

router.get('/', productGet);

router.post(
  '/',
  [
    check('name', 'Name required').not().isEmpty(),
    check('price', 'Price required').not().isEmpty(),
    check('category', 'Category Required').not().isEmpty(),
    check('stock', 'Stock required').not().isEmpty(),
    validarCampos,
    validarRol,
  ],
  productPost
);

router.get('/:prodName', findProducts);

router.put(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productPut
);

router.delete(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validarCampos,
    validarRol,
  ],
  productDelete
);


router.get('/:nameCat', productsByCategory);

router.get('/:orderReference', [ validarCampos ], productOrder);


export default router;
