require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const mainRouter = require('./src/api/routes/main');
const { connectCloudinary } = require('./src/config/cloudinary');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  // origin: 'https://eco-front-nine.vercel.app',
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true
};

app.use(cors(corsOptions));
connectDB();
connectCloudinary();
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/ecoturismo', mainRouter);

app.use('*', ({ res }) => {
  return res.status(404).send(
    `  <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página no encontrada</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: red; }
        </style>
    </head>
    <body>
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la ruta que buscas no existe.</p>
    </body>
    </html>
  
   `
  );
});

app.listen(3000, () => {
  console.log('Servidor levantado en http://localhost:3000');
});
