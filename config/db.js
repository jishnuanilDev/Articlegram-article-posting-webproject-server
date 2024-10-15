const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect('mongodb+srv://jisanilart:zkf4UtV53pTRpLDg@articlegram.4ldpg.mongodb.net/?retryWrites=true&w=majority&appName=Articlegram')
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => console.log(err.message));
};

module.exports = dbConnect;
