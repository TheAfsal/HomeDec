const mongoose = require("mongoose");
const { MongoClient, GridFSBucket } = require("mongodb");
const scheduleImageUpload = require("../middleware/uploadProductImages");

let bucket;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully");
    const client = new MongoClient(process.env.MONGO_URL);
    const dbName = "HomeDec";
    await client.connect();
    const db = client.db(dbName);
    bucket = new GridFSBucket(db);
    console.log("GridFS bucket initialized successfully");
    scheduleImageUpload();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const getBucket = () => {
  if (!bucket) {
    throw new Error("Bucket is not initialized. Ensure MongoDB is connected.");
  }
  return bucket;
};

// Export the connection and a function to retrieve the initialized bucket
module.exports = { connectDB, getBucket };
