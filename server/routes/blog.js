const express = require("express");
const router = express.Router();
const {create,getAllblogs,Singleblogs} = require("../controllers/customerController")

router.post("/create",create)
router.get('/blogs',getAllblogs)
router.get('/blogs/:slug',Singleblogs)

module.exports = router