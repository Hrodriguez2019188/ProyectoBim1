import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'Se necesita una Categoria']
    },
    descripcion: {
        type: String,
        required: [true, 'No puede publicar sin texto']
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    estado: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
postSchema.methods.toJSON = function () {
    const { __v, _id, createdAt, ...post } = this.toObject();
    post.pid = createdAt;
    return post;
}

export default mongoose.model('Post', postSchema);