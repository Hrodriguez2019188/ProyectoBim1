import Producto from './product.model.js';
import Category from '../category/category.model.js';
import { request, response } from 'express';

export const productPost = async (req, res) => {
  const { name, price, category, stock } = req.body;
  const categoryName = await Category.findOne({ nameCat: category });
  const producto = new Producto({
    name,
    price,
    category: categoryName,
    stock,
  });

  await producto.save();
  res.status(200).json({
    msg: 'El producto fue agregado correctamente',
    producto,
  });
};


export const productGet = async (req, res = response) => {
  try {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, producto] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .populate('category')
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      producto,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

//get products by name
export const findProducts = async (req, res) => {
  const { prodName } = req.params;
  const productName = await Producto.findOne({ name: prodName });
  if (!productName) {
    res
      .status(400)
      .json({ msg: 'No product under that name exists in the database' });
  } else {
    res.status(200).json({ msg: 'Product Found!', productName });
  }
};

export const productPut = async (req, res) => {
  const { id } = req.params;
  const { _id, ...rest } = req.body;
  await Producto.findByIdAndUpdate(id, rest);

  const producto = await Producto.findOne({ _id: id });

  return res.status(200).json({
    msg: 'El producto fue actualizado correctamente',
    producto,
  });
};

export const productDelete = async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndUpdate(id, { status: false });

  const producto = await Producto.findOne({ _id: id });

  res.status(200).json({
    msg: 'El producto fue eliminado correctamente',
    producto,
  });
};

export const productsByCategory = async (req, res = response) => {
  const { nameCat } = req.params;
  const catFind = await Category.findOne({ nameCat: nameCat });
  const products = await Producto.find({ category: catFind });
  if (!products)
    return res
      .status(400)
      .json({ msg: `Did't found any products on this category.` });
  res
    .status(200)
    .json({ msg: `Category Filtered:  ${catFind.nameCat}`, products });
};

export const productOrder = async (req, res = response) => {
  const { orderReference } = req.params;

  let sorting, modo;

  switch (parseInt(orderReference)) {
    case 1:
      sorting = 'name';
      modo = 'asc';
      break;
    case 2:
      sorting = 'name';
      modo = 'desc';
      break;
    case 3:
      sorting = 'price';
      modo = 'asc';
      break;
    case 4:
      sorting = 'price';
      modo = 'desc';
      break;

    case 5:
      sorting = 'category';
      modo = 'asc';
      break;
    default:
      sorting = 'name';
      modo = 'asc';
  }

  const producto = await Producto.find().sort({ [sorting]: modo });
  res.status(200).json({ producto });
};