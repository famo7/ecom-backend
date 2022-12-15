const router = require('express').Router();
const { Product } = require('../models/product');

router.get('/', async (request, response) => {
  const data = await Product.find({});
  response.json(data);
});

router.get('/:id', async (request, response) => {
  const data = await Product.findById(request.params.id);
  response.json(data);
});

module.exports = router;
