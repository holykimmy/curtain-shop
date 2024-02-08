const express = require("express");
const router = express.Router();
const {
  create,
  getAllCustomers,
  search,
  createAddress,
  loginUser,
} = require("../controllers/customerController");


router.post("/register", create);
router.post("/add-address", createAddress);
router.post("/login",loginUser)
router.get("/all", getAllCustomers);
router.get("/search", search);

module.exports = router;
