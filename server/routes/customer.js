const express = require("express");
const router = express.Router();
const {
  register,
  getAllCustomers,
  search,
  createAddress,
  loginUser,
  getCustomerAddressById,
  updateAddress,
  deleteAddress,
  getAddress,
  getCustomerById,
  createOrder,
  getOrder,
  getOrderById,
  userCart,
  userUpdateADCart,
  getOrderAll,
  getAddressByUserId
} = require("../controllers/customerController");

//middleware
const {auth} = require("../middleware/auth");


router.post("/register", register);
router.post("/add-address", auth , createAddress);
router.post("/login",loginUser)
router.get("/all", getAllCustomers);
router.get("/:id", auth , getCustomerById);
router.get("/search", search);
// router.get("/address/:id", auth ,getCustomerAddressById);
// router.get("/get-address/:id/:addressId",auth , getAddress);
router.get("/address/:id", auth , getAddressByUserId);
router.put("/update-address/:id/:addressId",auth, updateAddress);
router.delete("/delete-address/:id/:addressId", auth , deleteAddress);
router.post("/add-order/",auth,createOrder);
// router.get("/all/order",auth,getOrder);
router.get("/order/:id",auth,getOrderById);
router.get("/all/order",auth,getOrderAll);
router.post("/cart",auth,userCart);
router.put("/cart-to-order/:id",auth,userUpdateADCart);




module.exports = router;
