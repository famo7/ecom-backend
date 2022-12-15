const router = require('express').Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.post('/', async (req, res) => {
  const body = req.body;
  const findOneEmail = await User.findOne({ email: req.body.email });

  if (findOneEmail) {
    return res.status(500).json({
      message: 'This email is already used try with another email',
    });
  }
  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: passwordHash,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = router;
