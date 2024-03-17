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
  getAddressByUserId,
  getOrderByIdOrder,
  getOrderByIdWaitPayment,
  getOrderByIdPrepair,
  getOrderByIdSend,
  getOrderByIdComplete,
  getOrderApprove,
  getOrderPayment,
  getOrderPrepare,
  getOrderSend,
  getOrderComplete,
  searchOrderApprove,
  searchOrderPayment,
  searchOrderPrepare,
  searchOrderSend,
  searchOrderComplete,
  updateOrderEnable,
  updateOrderComplete,
  updateOrderApprove,
  updateOrderSend,
  updateOrderVerifyPayment,
  updateOrderPandding,
  updateSlip,
  deleteSlip,
  updateOrderCancelled,
  updateOrderVerifyCancelled
} = require("../controllers/customerController");

//middleware
const { auth } = require("../middleware/auth");
const uploadslip = require("../middleware/slip");
const uploadshow = require("../middleware/show");


router.post("/register", register);
router.post("/add-address", auth, createAddress);
router.post("/login", loginUser);
router.get("/all", getAllCustomers);
router.get("/:id", auth, getCustomerById);
router.get("/search", search);
// router.get("/address/:id", auth ,getCustomerAddressById);
// router.get("/get-address/:id/:addressId",auth , getAddress);
router.get("/address/:id", auth, getAddressByUserId);
router.put("/update-address/:id/:addressId", auth, updateAddress);
router.delete("/delete-address/:id/:addressId", auth, deleteAddress);
router.post("/add-order/", auth, createOrder);
// router.get("/all/order",auth,getOrder);
router.get("/order/:id", auth, getOrderById);
router.get("/check-order/order/:id", auth, getOrderByIdOrder);
router.get("/order/waiting-payment/:id", auth, getOrderByIdWaitPayment);
router.get("/order/prepare/:id", auth, getOrderByIdPrepair);
router.get("/order/send/:id", auth, getOrderByIdSend);
router.get("/order/complete/:id", auth, getOrderByIdComplete);


//get for admin
router.get("/all/order", auth, getOrderAll);
router.get("/all/order/approve",auth,getOrderApprove)
router.get("/all/order/payment",auth,getOrderPayment)
router.get("/all/order/prepare",auth,getOrderPrepare)
router.get("/all/order/send",auth,getOrderSend)
router.get("/all/order/complete",auth,getOrderComplete)

//----search 
router.get("/all/order/approve-s",auth,searchOrderApprove)
router.get("/all/order/payment-s",auth,searchOrderPayment)
router.get("/all/order/prepare-s",auth,searchOrderPrepare)
router.get("/all/order/send-s",auth,searchOrderSend)
router.get("/all/order/complete-s",auth,searchOrderComplete)

//update
router.put("/order/enable/:id", auth, updateOrderEnable);
router.put("/order/cencelled/:id", auth, updateOrderCancelled);
router.put("/order/verifycanceclled/:id", auth, updateOrderVerifyCancelled);

router.put("/order/approve/:id", auth, updateOrderApprove);
router.put("/order/verifypayment/:id", auth, updateOrderVerifyPayment);
router.put("/order/pandding/:id", auth, updateOrderPandding);
router.put("/order/send/:id", auth, updateOrderSend);
router.put("/order/complete/:id", auth, updateOrderComplete);



router.post("/cart", auth, userCart);
router.put("/cart-to-order/:id", auth, userUpdateADCart);
router.put("/order/payment/:id",auth,uploadslip,updateSlip)
router.delete("/order/payment-d/:id",auth,uploadslip,deleteSlip)


module.exports = router;
