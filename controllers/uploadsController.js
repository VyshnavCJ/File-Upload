const { Product } = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomError = require("../errors/index");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

//local host
const uploadProductImageLocal = async (req, res) => {
  //validations
  if (!req.files) {
    throw new CustomError.BadRequestError("No files uploaded");
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Plz upload an Image");
  }

  const maxSize = 1000;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Plz upload image smaller than 1kb");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

//Cloud
const uploadProductImageCloud = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No files uploaded");
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Plz upload an Image");
  }

  const maxSize = 100000;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Plz upload image smaller than 100kb"
    );
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};
module.exports = {
  uploadProductImageCloud,
};
