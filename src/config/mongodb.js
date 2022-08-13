const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const db = await mongoose.connect(
      `mongodb+srv://Doron_Dayan:${process.env.MONGODB_PASSWORD}@cluster0.g2v3ixq.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("MONGODB Connected...");
  } catch (error) {
    console.log("MONGODB Erorr:", error.message);
    process.exit(1);
  }
};

module.exports = connectMongo();
