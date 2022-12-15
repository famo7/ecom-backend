const mongoose = require('mongoose');
let url = process.env.MONGO_URI;
mongoose.set('strictQuery', true);
mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected!!');
  })
  .catch((e) => {
    console.log(e);
  });
