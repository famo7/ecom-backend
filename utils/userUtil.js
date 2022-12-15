const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

const getUser = async (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET);
  return await User.findById(decodedToken.id);
};

module.exports = getUser;
