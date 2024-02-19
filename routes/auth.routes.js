const { Router } = require("express");
const { login } = require("../controllers/auth.controller");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");



const router = Router();

router.post(
    '/login',
    [
        check('correo','Este no es un correo válido').isEmail(),
        check('password','La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], login);

module.exports = router;