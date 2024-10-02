const cloudinary = require("../database/cloudinaryConfig");

const addUserImages = async (imageFile) => {
  try {
    const uploadedId = await cloudinary.uploader.upload(imageFile[0].path);
    return { public_id:uploadedId.public_id, secure_url:uploadedId.secure_url };
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add image" });
  }
};

module.exports = { addUserImages };
