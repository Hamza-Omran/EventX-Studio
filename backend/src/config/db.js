const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    console.log("🔍 DEBUG - All environment variables:");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", process.env.PORT);
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "SET" : "MISSING");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "SET" : "MISSING");
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "MISSING");
    
    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI environment variable is not set");
      console.log("Available env vars:", Object.keys(process.env).filter(key => key.includes('MONGO')));
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
