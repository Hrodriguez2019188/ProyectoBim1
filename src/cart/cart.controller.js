import Product from '../product/product.model.js';
import User from '../user/user.js';
import Cart from './cart.model.js';
import jwt from 'jsonwebtoken';

export const cartDataSave = async (req, res) => {
  try {
    const { cDate, user, product, quantity } = req.body;
    const secretWord = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers['x-token'];
    const token = jwt.verify(xtoken, secretWord);
    const userToken = token.uid;

    if (userToken !== user) {
      res
        .status(401)
        .json({ message: 'An error occurred. Verify all credentials' });
    }

    const userFound = await User.findById(user);

    if (!userFound) {
      res.status(400).json({ message: 'User not found' });
    }

    let productFound = await Product.findOne({ name: product });
    if (!productFound) {
      res.status(400).json({ message: 'Product not found' });
    }

    if (parseInt(productFound.stock) === 0) {
      res.status(400).json({
        message: 'Product out of stock. Try Later with another product',
      });
    }

    var cartFound = await Cart.findOne({
      user: user,
      product: productFound,
      status: 'EXISTS',
    });

    if (parseInt(quantity) <= 0) {
      res.status(400).json({
        message: 'The quantity of products requested must be positive',
      });
    }
    if (parseInt(quantity) >= parseInt(productFound.stock)) {
      res.status(400).json({
        message: 'The quantity of products requested is greater than the stock',
      });
    }
    if (cartFound) {
      cartFound.quantity = parseInt(cartFound.quantity);
      if (
        parseInt(cartFound.quantity) + parseInt(quantity) >
        parseInt(productFound.stock)
      ) {
        res.status(400).json({
          message: `You have reached the maximum stock of ${productFound.stock} products`,
        });
      } else {
        cartFound.quantity = parseInt(cartFound.quantity) + parseInt(quantity);
      }
    } else {
      cartFound = new Cart({
        cDate: cDate,
        user: user,
        product: productFound,
        quantity: quantity,
        status: 'EXISTS',
      });
    }
    await cartFound.save();
    res.status(200).json({ message: 'Cart created successfully', cartFound });
  } catch (e) {
    console.log('Unexpected error: ', e);
  }
};

export const cartDataDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const secretWord = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers['x-token'];
    const token = jwt.verify(xtoken, secretWord);
    const userToken = token.uid;

    var cartFound = await Cart.findById({ _id: id });

    if (!cartFound) {
      res.status(400).json({
        message: 'Cart associated with that ID was not found, try again',
      });
    }

    if (userToken !== cartFound.user.toString()) {
      res
        .status(401)
        .json({ msg: 'An error occurred. Verify all credentials' });
    }

    if (cartFound.status === 'PAID') {
      res.status(400).json({ msg: 'Cart already paid, you cannot delete it' });
    }

    const cartGone = await Cart.findByIdAndDelete({ _id: id });

    if (cartGone.deletedCount === 0 || !cartGone) {
      res.status(400).json({
        msg: 'Cart associated with that ID was not found, deletion cannot proceed',
      });
    }

    res.status(200).json({ msg: 'Cart deleted successfully', cartGone });
  } catch (e) {
    console.log('Unexpected error: ', e);
    res
      .status(500)
      .json({ message: 'An error occurred whilst trying to delete the cart' });
  }
};
