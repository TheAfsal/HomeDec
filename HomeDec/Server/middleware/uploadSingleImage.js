const cloudinary = require("../database/cloudinaryConfig");

const addUserImages = async (imageFile) => {
  try {
    try {
      const uploadedId = await uploadImage(imageFile[0]);
      console.log(uploadedId);

      return {
        public_id: uploadedId.public_id,
        secure_url: uploadedId.secure_url,
      };
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // or handle the error as needed
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add image" });
  }
};

const uploadImage = (imageFile) => {
  return new Promise((resolve, reject) => {
    console.log("Buffer size:", imageFile.buffer.length);
    const uploadedId = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadedId.end(imageFile.buffer);
  });
};

module.exports = { addUserImages };
