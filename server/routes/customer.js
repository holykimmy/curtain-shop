const express = require("express");
const router = express.Router();
const {create,getAllCustomers,search} = require("../controllers/customerController")

router.post('/create',create)
router.get('/all',getAllCustomers)
router.get('/search',search)

module.exports = router