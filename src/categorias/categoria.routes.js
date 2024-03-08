import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { categoriaPost, categoriaGet, categoriaPut, categoriaDelete } from '../categorias/categoria.controller.js';
import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

router.get("/", categoriaGet);

router.put(
    "/put/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        validarCampos,
        validarRol
    ], categoriaPut);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            validarCampos,
            validarRol
        ], categoriaDelete);

        
router.post(
    "/",
    [
        check("nameCat", "El nombre no puede ir vacio").not().isEmpty(),
        check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
        validarCampos,
        validarRol
    ], categoriaPost);


//pinche comentario inutil solo para pushear alv


export default router;