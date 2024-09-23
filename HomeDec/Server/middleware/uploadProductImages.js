const cloudinary = require("../database/cloudinaryConfig");

const uploadSingleProductImage = async (req, res) => {
  console.log(req.body); // This will contain the uploaded file
  console.log(req.file); // This will contain the uploaded file

  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  try {
    // Use the path of the uploaded file to upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    res.status(200).send({ imageUrl: result.secure_url,publicId:result.public_id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Image upload failed" });
  }
};

module.exports = uploadSingleProductImage;
