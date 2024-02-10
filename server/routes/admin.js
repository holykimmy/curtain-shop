const express = require('express');
const router = express.Router();
const {verifyUser} =require("../controllers/adminController")

router.get('/admin',verifyUser);

module.exports = router;