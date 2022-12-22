const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const productRouter = require('./routes/productRoutes')
const categoryRouter = require('./routes/categoryRoutes')
const userRouter = require('./routes/userRoutes')
const orderRouter = require('./routes/orderRoutes')
const authJwt = require('./utils/jwt')
require('dotenv/config')
require('./MongoDB')();

//MIDDLEWARES:

//Enabling CORS middleware
app.use(cors());
app.options('*', cors());

//bodyparser Middleware
app.use(express.json());
//morgan to log API Requests in tiny format
app.use(morgan('tiny'));
//static path:
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


//routers:
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)


module.exports = app