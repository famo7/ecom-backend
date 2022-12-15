require('dotenv').config();
const express = require('express');
require('./db/connect');
const app = express();
const cors = require('cors');
app.use(cors());

const productRoute = require('./routes/product');
const userRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const getUser = require('./utils/userUtil');
const { Order } = require('./models/order');
const { Product } = require('./models/product');
app.use(express.json());

app.use(express.static('public'));
app.use('/api/products/images', express.static('./images'));

app.use(express.static('build'));

app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/login', loginRoute);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.get('/api/config', (req, res) => {
  res.send({
    publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post('/api/userDetails', async (req, res) => {
  const userDetails = req.body;
  console.log(userDetails);
  try {
    const customer = await stripe.customers.create({
      name: userDetails.name,
      phone: userDetails.phone,
      email: userDetails.email,

      address: {
        city: userDetails.city,
        country: userDetails.country,
        postal_code: userDetails.postCode,
      },
    });
    console.log(customer);
    res.status(200).send(customer.id);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.post('/api/create-payment-intent', async (req, res) => {
  const data = req.body.chosenProducts;
  const totalPrice = data.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const user = await getUser(req.body.token);
  const customer = req.body.id;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: 'sek',
    automatic_payment_methods: {
      enabled: true,
    },
    customer,
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
