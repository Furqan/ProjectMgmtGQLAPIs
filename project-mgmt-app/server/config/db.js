const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.rainbow.underline.bold);
  }
  catch(e) {
    console.log("MongoDB Connection Exception: ", e);
  }
  
}

module.exports = connectDB;
