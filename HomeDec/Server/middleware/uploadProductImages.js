const cloudinary = require("../database/cloudinaryConfig");


const addProductImages = async (imageFiles,variantLength) => {

  try {
    const uploadPromises = [];

    // Initialize a 2D array based on the number of variants
    const numberOfVariants = variantLength;
    for (let i = 0; i < numberOfVariants; i++) {
      uploadPromises[i] = []; // Create an empty array for each variant
    }

    // Fill the 2D array with upload promises
    imageFiles.forEach((file) => {
      const match = file.fieldname.match(
        /variants\[(\d+)\]\[images\]\[(\d+)\]/
      );
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        const imageIndex = parseInt(match[2], 10);

        // Push the upload promise to the correct sub-array
        if (uploadPromises[variantIndex]) {
          uploadPromises[variantIndex][imageIndex] = cloudinary.uploader.upload(
            file.path
          );
        }
      }
    });

    // Now you can process each variant's uploads
    const uploadResults = await Promise.all(
      uploadPromises.map((promiseArray) => Promise.all(promiseArray))
    );

    const extractedResults = uploadResults.map(resultArray => 
      resultArray.map(result => ({
        public_id: result.public_id,
        secure_url: result.secure_url
      }))
    );
    
    // Handle results
    extractedResults.forEach((resultArray, variantIndex) => {
      console.log(`Results for variant ${variantIndex}:`, resultArray);
    });

    return extractedResults;


  //   res
  //     .status(201)
  //     .json({ message: "Product added successfully", product: productData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

module.exports = { addProductImages };

// const cloudinary = require("../database/cloudinaryConfig");

// const uploadSingleProductImage = async (req, res) => {
//   console.log(req.body); // This will contain the uploaded file
//   console.log(req.file); // This will contain the uploaded file

//   if (!req.file) {
//     return res.status(400).send({ error: "No file uploaded" });
//   }

//   try {
//     // Use the path of the uploaded file to upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);
//     console.log(result);

//     res
//       .status(200)
//       .send({ imageUrl: result.secure_url, publicId: result.public_id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Image upload failed" });
//   }
// };

// module.exports = uploadSingleProductImage;
