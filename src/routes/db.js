const mongoose = require('mongoose');

// URL de conexión a MongoDB (puedes ajustarla según tu configuración)
const mongoURI = 'mongodb://localhost:27017/ecommerce';

// Conecta a la base de datos
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');
})
.catch((error) => {
  console.error('Error de conexión a MongoDB:', error);
});
