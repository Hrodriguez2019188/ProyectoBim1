import Usuario from '../user/user.js';

export const existenteEmail = async (email = '') => {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail){
        throw new Error(`El email ${ email } ya fue registrado`);
    }
}

export const existeUsuarioById = async ( id = '') => {
    const existeUsuario = await Usuario.findOne({id});
    if(existeUsuario){
        throw new Error(`El usuario con el id: ${ id } no existe`);
    }
}

