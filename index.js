require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const mainRouter = require('./src/api/routes/main');
const { connectCloudinary } = require('./src/config/cloudinary');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

connectDB();
connectCloudinary();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use('/api/v1/ecoturismo', mainRouter);

app.use('*', ({ res }) => {
  return res.status(404).json({
    message: `Route not found`
  });
});

app.listen(3000, () => {
  console.log('Servidor levantado en http://localhost:3000');
});
