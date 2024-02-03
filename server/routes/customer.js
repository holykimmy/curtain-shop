const express = require("express");
const router = express.Router();
const {create,getAllCustomers,search,createAddress} = require("../controllers/customerController")

router.post('/create',create)
router.post('/add-address',createAddress)
router.get('/all',getAllCustomers)
router.get('/search',search)

module.exports = router