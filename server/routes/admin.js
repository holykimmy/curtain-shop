const express = require('express');
const router = express.Router();
const {verifyUser} =require("../controllers/adminController")

router.get('/',verifyUser);

module.exports = router;