import mongoose from 'mongoose';

const billingSchema = mongoose.Schema({
  emissionDate: {
    type: Date,
    required: true,
  },
  cartData: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cart',
    required: true,
  },
  totalPrice: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Billing', billingSchema);
