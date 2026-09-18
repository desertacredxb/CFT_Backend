const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  const MongoURL = process.env.MongoURL;

  // IMPORTANT: Added 'return' here
  return mongoose
    .connect(MongoURL, {})
    .then(() => console.log("🚀 DataBase Connected"))
    .catch((reason) => {
      console.error(`💩 Unable to connect to DataBase \n${reason}`);
      throw reason;
    });
};

module.exports = { connect };
