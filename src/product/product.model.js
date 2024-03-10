import mongoose from 'mongoose';
import Category from '../category/category.model.js';

const ProductoSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nombre obligatorio'],
  },
  price: {
    type: String,
    require: [true, 'El precio del producto es obligatorio'],
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Categoria obligatoria'],
      ref: 'Categoria',
    },
  ],
  stock: {
    type: String,
    require: [true, 'El stock del producto es obligatorio'],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, _id, ...producto } = this.toObject();
  producto.pid = _id;
  return producto;
};

export default mongoose.model('Producto', ProductoSchema);
