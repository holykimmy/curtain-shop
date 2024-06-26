const express = require("express");
const router = express.Router();
const {
  register,
  getAllCustomers,
  getCustomers,
  updateEnable,
  updateRole,
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
  getAddressByUserId,getAddressById,
  getOrderByIdOrder,
  getOrderByIdWaitPayment,
  getOrderByIdPrepare,
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
  searchOrderAll,
  updateOrderEnable,
  updateOrderComplete,
  updateOrderApprove,
  updateOrderSend,
  updateOrderVerifyPayment,
  updateOrderPandding,
  updateSlip,
  deleteSlip,
  updateOrderCancelled,
  updateOrderVerifyCancelled,
  updateOrderDepositPayment,
  findUserByEmail,resetPassword,
  UpdateProfile
} = require("../controllers/customerController");

//middleware
const { auth } = require("../middleware/auth");
const uploadslip = require("../middleware/slip");
const uploadshow = require("../middleware/show");
const uploadwindow = require("../middleware/window");

router.post("/register", register);
router.post("/add-address", auth, createAddress);
router.post("/login", loginUser);
router.post("/forgot-password", findUserByEmail);
router.post("/reset-password/:id", resetPassword);
router.put("/edit-profile/:id",UpdateProfile)
router.put("/update-enable/:id", auth, updateEnable);
router.put("/update-role/:id", auth, updateRole);

router.get("/all", getAllCustomers);
router.get("/:id", auth, getCustomerById);
router.get("/all/c-search",auth,getCustomers)

// router.get("/address/:id", auth ,getCustomerAddressById);
// router.get("/get-address/:id/:addressId",auth , getAddress);
router.get("/address/:id", auth, getAddressByUserId);
router.get("/address-byid/:id", auth, getAddressById);
router.put("/update-address/:id", auth, updateAddress);
router.delete("/delete-address/:id", auth, deleteAddress);
router.post("/add-order/", auth, createOrder);
// router.get("/all/order",auth,getOrder);
router.get("/order/:id", auth, getOrderById);
router.get("/check-order/order/:id", auth, getOrderByIdOrder);
router.get("/order/waiting-payment/:id", auth, getOrderByIdWaitPayment);
router.get("/order/prepare/:id", auth, getOrderByIdPrepare);
router.get("/order/send/:id", auth, getOrderByIdSend);
router.get("/order/complete/:id", auth, getOrderByIdComplete);


//get for admin
router.get("/all/order", getOrderAll);
router.get("/all/order/approve",getOrderApprove)
router.get("/all/order/payment",getOrderPayment)
router.get("/all/order/prepare",getOrderPrepare)
router.get("/all/order/send",getOrderSend)
router.get("/all/order/complete",getOrderComplete)

//----search 
router.get("/all/order/approve-s",auth,searchOrderApprove)
router.get("/all/order/payment-s",auth,searchOrderPayment)
router.get("/all/order/prepare-s",auth,searchOrderPrepare)
router.get("/all/order/send-s",auth,searchOrderSend)
router.get("/all/order/complete-s",auth,searchOrderComplete)
router.get("/all/order/all-s",auth,searchOrderAll)
//update
router.put("/order/enable/:id", auth, updateOrderEnable);
router.put("/order/cencelled/:id", auth, updateOrderCancelled);
router.put("/order/verifycanceclled/:id", auth, updateOrderVerifyCancelled);
router.put("/order/approve/:id", auth, updateOrderApprove);
router.put("/order/verifypayment/:id", auth, updateOrderVerifyPayment);
router.put("/order/deposit/:id", auth, updateOrderDepositPayment);

router.put("/order/pandding/:id", auth, updateOrderPandding);
router.put("/order/send/:id", auth, updateOrderSend);
router.put("/order/complete/:id", auth, updateOrderComplete);



router.post("/cart", auth, userCart);
router.put("/cart-to-order/:id", auth, uploadwindow,userUpdateADCart);
router.put("/order/payment/:id",auth,uploadslip,updateSlip)
router.delete("/order/payment-d/:id",auth,uploadslip,deleteSlip)


module.exports = router;
