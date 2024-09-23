const express = require("express");
const {
  loginSeller,
  fetchProducts,
} = require("../controllers/sellerController");
const run = require("../Utils/multerImageUplaod");
const uploadProductImages = require("../middleware/uploadProductImages");
const uploadSingleProductImage = require("../middleware/uploadProductImages");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../database/cloudinaryConfig");
const Product = require("../models/productModel");

// Use memory storage for Cloudinary uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/login", loginSeller);

router.post("/products/add", async (req, res) => {
  try {
    console.log(req.body);

    const productData = {
      category: req.body.data.category,
      subCategory: req.body.data.subCategory,
      title: req.body.data.title,
      description: req.body.data.description,
      variants: req.body.variants.map((variant) => ({
        color: variant.color,
        colorHex: variant.colorHex,
        stock: Number(variant.stock), 
        price: Number(variant.price), 
        images: variant.images.map((image) => image.imageUrl), // Get image URLs from the image objects
      })),
      itemProperties: req.body.data.itemProperties.map((prop) => ({
        field: prop.field,
        value: prop.value,
      })),
      deliveryCondition: req.body.data.deliveryCondition,
      warranty: req.body.data.warranty,
      relatedKeywords: req.body.data.relatedKeywords,
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
});

router.post(
  "/products/add-product-image",
  upload.single("image"),
  uploadSingleProductImage
);

router.delete("/products/delete-product-image", deleteImageFromCloudinary);

router.get("/products/list", fetchProducts);

async function deleteImageFromCloudinary(req, res) {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).send({ error: "Public ID is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result); // Log the result to see if the deletion was successful

    if (result.result === "ok") {
      return res.status(200).send({ message: "Image deleted successfully" });
    } else {
      return res.status(500).send({ error: "Failed to delete image" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error deleting image" });
  }
}

module.exports = router;
