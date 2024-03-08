import { request, response } from "express";

export const tieneRole = (...roles) => {
    return async (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se quiere verificar el role sin validar el token primero",
            });
        }


        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El usuario no posee uno de estos roles: ${roles}`,
            });
        }

        next();
    };
};

