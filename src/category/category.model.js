import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema ({
    nameCat:{
        type: String,
        required: [true, "El nombre de la caregoria es obligatorio"]
    },
    descripcion:{
        type:String,
        required: [true, "La descripcion de la caregoria es obligatoria"]
    },
    estado: {
        type: Boolean, 
        default: true
    }


});

export default mongoose.model ('Categoria', CategoriaSchema);
