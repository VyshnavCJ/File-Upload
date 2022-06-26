const {
  createProduct,
  getAllProduct,
} = require("../controllers/productController");
const { uploadProductImageCloud } = require("../controllers/uploadsController");

const router = require("express").Router();

router.route("/").get(getAllProduct).post(createProduct);
router.route("/uploads").post(uploadProductImageCloud);

module.exports = router;
