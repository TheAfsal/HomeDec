const cloudinary = require("../database/cloudinaryConfig");

const addProductImages = async (imageFiles, variantLength) => {
  try {
    console.log(imageFiles);

    // Initialize a 2D array based on the number of variants
    const uploadPromises = Array.from({ length: variantLength }, () => []);

    // Fill the 2D array with upload promises
    imageFiles.forEach((file) => {
      const match = file.fieldname.match(
        /variants\[(\d+)\]\[images\]\[(\d+)\]/
      );
      if (match) {
        const variantIndex = parseInt(match[1], 10);
        const imageIndex = parseInt(match[2], 10);

        // Create a new Promise for each upload
        if (uploadPromises[variantIndex]) {
          const uploadPromise = new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(result);
                }
              )
              .end(file.buffer);
          });

          uploadPromises[variantIndex][imageIndex] = uploadPromise;
        }
      }
    });

    // Process each variant's uploads
    const uploadResults = await Promise.all(
      uploadPromises.map((promiseArray) => Promise.all(promiseArray))
    );

    console.log(uploadResults);

    const extractedResults = uploadResults.map((resultArray) =>
      resultArray.filter((result) => ({
        public_id: result?.public_id,
        secure_url: result?.secure_url,
      }))
    );

    // Handle results
    extractedResults.forEach((resultArray, variantIndex) => {
      console.log(`Results for variant ${variantIndex}:`, resultArray);
    });

    return extractedResults;
  } catch (error) {
    console.error(error);
    throw { status: 500, message: "Failed to add product" };
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
