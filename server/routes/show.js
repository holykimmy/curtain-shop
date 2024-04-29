const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createShow, deleteShow,getAllImage } = require("../controllers/showController");
//middleware
const uploadShow = require("../middleware/show");

router.post("/create", uploadShow, createShow);
router.delete("/delete/:id", deleteShow);
router.get("/all",getAllImage);

module.exports = router;
