const mongoose = require('mongoose');

// conector a la DB
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {});
    console.log('Conectado correctamente');
  } catch (e) {
    throw new Error('Error al conectarse a la DB', e);
  }
};

module.exports = {
  dbConnection,
};
