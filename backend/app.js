const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const debug = require('debug')('app:db');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

const connectionString = `mongodb+srv://${config.get('db.admin')}:${config.get('db.password')}@cluster0.qlq8y.mongodb.net/${config.get('db.name')}?retryWrites=true&w=majority`;

mongoose.connect(connectionString)
  .then(() => debug('Connected to mongodb'))
  .catch(err => console.log(err));

app.listen(3100);
