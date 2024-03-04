import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { postPublicacion, putPublicacion, addComment, getAllPostsWithComments } from '../post/post.controller.js'; // Ajusta el controlador

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos,
    postPublicacion 
]);

router.put('/:createdAt', [
    validarJWT,
    validarCampos,
    putPublicacion 
]);

router.post('/comment/:userId', [
    validarJWT,
    check('postId', 'El ID del post es requerido').notEmpty(),
    validarCampos
], addComment);

router.get('/', [
    getAllPostsWithComments
]);

export default router;
