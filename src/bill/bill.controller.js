import Cart from '../cart/cart.model.js';
import Bill from './bill.model.js';
import User from '../user/user.js';
import jwt from 'jsonwebtoken';
import pdf from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Producto from '../product/product.model.js';

export const buyBill = async (req, res) => {
  try {
    const { nameUser } = req.body;
    const user = await User.findOne({ nameUser: nameUser });

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const palabrita = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers.token;
    const token = jwt.verify(xtoken, palabrita);
    const userToken = token.uid;

    if (userToken !== user._id.toString()) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    const userId = user._id;
    let cartCreate = await Cart.find({ user: userId, status: 'EXISTS' });

    if (cartCreate.length === 0) {
      res.status(400).json({ msg: 'No hay facturas para generar' });
    }

    const billArray = [];
    var Payment = 0;

    for (const carts of cartCreate) {
      Payment = 0;
      const product = await Producto.findById(carts.product);
      if (!product) {
        res.status(400).json({ msg: 'Producto no encontrado' });
      }
      if (parseInt(carts.quantity) > parseInt(product.stock)) {
        return res
          .status(400)
          .send({ message: `Stock insuficiente para el producto: ${product.name}` });
      }
      const totalProduct = parseInt(carts.quantity) * parseInt(product.price);

      const bill = new Bill({
        emissionDate: new Date(),
        cartData: carts._id,
        totalPrice: totalProduct,
      });
      await bill.save();

      product.stock = parseInt(product.stock) - parseInt(carts.quantity);
      await product.save();

      carts.status = 'PAID';
      await carts.save();

      billArray.push(bill);
      Payment = Payment + parseInt(totalProduct);
    }

    const checkInvoice = './checks';
    if (!fs.existsSync(checkInvoice)) {
      fs.mkdirSync(checkInvoice);
    }
    const checkPath = path.resolve(checkInvoice, `bills_${user.name}.pdf`);
    const check = new pdf();
    check.pipe(fs.createWriteStream(checkPath));

    check
      .font('Times-Roman')
      .fontSize(25)
      .text('Facturación de Productos', { align: 'center' })
      .moveDown();

    for (const billGen of billArray) {
      const cart = await Cart.findById(billGen.cartData).populate('product');
      const total = billGen.totalPrice;

      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();

      check.fontSize(16).text(`ID de Compra: ${cart._id}`).moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(20).text('Productos');
      check.moveDown();
      const product = await Producto.findById(cart.product);
      check.fontSize(14).text(`Nombre: ${product.name}`);
      check.moveDown();
      check.fontSize(14).text(`Cantidad: ${parseInt(cart.quantity)}`);
      check.moveDown();
      check.fontSize(14).text(`Precio: Q.${parseInt(product.price)}`);
      check.moveDown();
      check
        .fontSize(16)
        .text(`Fecha de Emisión: ${billGen.emissionDate.toLocaleDateString()}`)
        .moveDown();
      check.moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(16).text(`Total: Q.${total}`).moveDown();

      check.moveDown();
    }

    check.fontSize(16).text(`Total a Pagar: Q.${Payment}`).moveDown();

    check.end();
    res.status(200).sendFile(checkPath);
  } catch (e) {
    console.log('Error inesperado: ', e);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const updateBilling = async (req, res) => {
  try {
    const { id } = req.params;
    const { cartQuant } = req.body;
    if (!cartQuant) {
      res.status(400).json({ msg: 'No se proporcionó la cantidad en la solicitud' });
    }

    const bill = await Bill.findById(id);
    if (!bill) {
      res.status(404).json({ msg: 'Factura no encontrada' });
    }
    bill.cartData = bill.cartData.toString();
    const cart = bill.cartData;
    const cartBill = await Cart.findById(cart).populate('product');
    if (!cartBill) {
      res.status(404).json({ msg: 'Carrito asociado a esta factura no encontrado' });
    }

    const newQuant = cartQuant;
    cartBill.quantity = newQuant;

    await cartBill.save();

    const prodBill = cartBill.product;
    if (newQuant > 0) {
      if (prodBill.stock < newQuant) {
        res.status(400).json({ msg: 'Stock insuficiente' });
      }
      prodBill.stock = parseInt(prodBill.stock) - newQuant;
    } else if (newQuant <= 0) {
      prodBill.stock = parseInt(prodBill.stock) - newQuant;
    }

    const newPrice = parseInt(prodBill.price) * parseInt(cartBill.quantity);
    bill.totalPrice = newPrice;
    bill.emissionDate = new Date();

    await prodBill.save();
    await bill.save();

    res.status(201).json({ msg: 'Factura actualizada', bill });
  } catch (e) {
    console.log('Error inesperado: ', e);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const userBillings = async (req, res) => {
  try {
    const { userId } = req.params;

    const userCarts = await Cart.find({ user: userId });

    if (!userCarts) {
      res.status(404).json({ message: 'No se encontraron carritos' });
    }
    const mapCarts = userCarts.map((carts) => carts._id);

    const checks = await Bill.find({ cartData: mapCarts });

    if (!checks) {
      res.status(404).send({ message: 'No existen facturas' });
    }

    res.status(200).json({ msg: 'Facturas encontradas para el usuario', checks });
  } catch (e) {
    console.log('Error inesperado: ', e);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};