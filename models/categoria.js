const {Schema, model} = require('mongoose');

const RoleSchema = Schema ({
    nombreC:{
        type: String,
        required: [true, "El nombre de la caregoria es obligatorio"]
    },
    descripcionC:{
        type:String,
        required: [true, "La descripcion de la caregoria es obligatoria"]
    }


});

module.exports = model ('Role', RoleSchema);