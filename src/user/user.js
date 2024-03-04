import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    
    nameUser: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La password es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'CLIENT_ROLE',
        enum: ["ADMIN_ROLE" , "CLIENT_ROLE"]
    }

});


userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


export default mongoose.model('User', userSchema);