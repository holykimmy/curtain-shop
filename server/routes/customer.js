const express = require("express");
const router = express.Router();
const {create,getAllCustomers,SingleCustomer} = require("../controllers/customerController")

router.post('/create',create)
router.get('/customers',getAllCustomers)
router.get('/customers/:slug',SingleCustomer)

module.exports = router