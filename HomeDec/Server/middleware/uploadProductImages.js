const mongoose = require("mongoose");
const cron = require("node-cron");
const cloudinary = require("../database/cloudinaryConfig");
const Product = require("../models/productModel");

// Function to upload a single image to Cloudinary
const uploadImageToCloudinary = async (bucket, image) => {
  return new Promise((resolve, reject) => {
    try {
      // Download file from GridFS using the temp_url as the filename
      const downloadStream = bucket.openDownloadStreamByName(image.temp_url);
      const chunks = [];

      // Collect file data from GridFS stream
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", async () => {
        const fileBuffer = Buffer.concat(chunks);

        // Upload to Cloudinary
        cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              // Resolve with new image object
              const newImage = {
                public_id: result.public_id,
                secure_url: result.secure_url,
              };
              resolve(newImage);
            }
          }
        ).end(fileBuffer);
      });

      downloadStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Function to process the images of a product
const processProductImages = async (bucket, product) => {
  console.log(product.title, "called by scheduler");

  for (const variant of product.variants) {
    const imageUploadPromises = [];

    for (let image of variant.images) {
      if (image.temp_url && image.secure_url === "pending") {
        // Push all upload promises to the array
        imageUploadPromises.push(uploadImageToCloudinary(bucket, image));
      }
    }

    try {
      // Wait for all images to be uploaded
      const uploadedImages = await Promise.all(imageUploadPromises);

      // Replace the pending images with the uploaded ones
      uploadedImages.forEach((newImage, index) => {
        variant.images[index] = newImage;
      });

      // After all uploads, mark variant as active
      variant.isActive = true;

    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }

  // Save the updated product
  await product.save();
  console.log(`Updated product ${product.title} with new images.`);
};

// Function to delete all files in the GridFS bucket
const deleteAllFilesFromGridFS = async (bucket) => {
  const filesCollection = bucket.s._filesCollection;

  // Get all files in the GridFS bucket
  const files = await filesCollection.find({}).toArray();
  
  // Delete all files
  const deletePromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      bucket.delete(file._id, (error) => {
        if (error) {
          console.error(`Failed to delete image from GridFS: ${file.filename}`, error);
          reject(error);
        } else {
          console.log(`Deleted image from GridFS: ${file.filename}`);
          resolve();
        }
      });
    });
  });

  await Promise.all(deletePromises);
  console.log("All files deleted from GridFS.");
};

// Scheduler function
const scheduleImageUpload = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Scheduler initiated");

    try {
      const products = await Product.find({
        "variants.images.temp_url": { $exists: true },
        "variants.images.secure_url": "pending",
      });

      const { getBucket } = require("../database/dbConfig.js");
      const bucket = getBucket();

      for (const product of products) {
        await processProductImages(bucket, product);
      }

      // After processing all products, delete all images from GridFS
      await deleteAllFilesFromGridFS(bucket);

      console.log("Scheduler Finished Task");
    } catch (error) {
      console.error("Error in scheduler:", error);
    }
  });
};

module.exports = scheduleImageUpload;
