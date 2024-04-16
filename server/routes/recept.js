const express = require("express");
const router = express.Router();
const {
  createQuotation,
  createInvoice,
  getAllQuotation,
  getAllInvoice,
  getReceptById,
  updateRecept,
  updateToInvoice,
  updateToQuotation,
  deleteRecept,
  searchRecept
} = require("../controllers/receptController");
const { auth } = require("../middleware/auth");

router.post("/create/quotation", auth, createQuotation);
router.post("/create/invoice", auth, createInvoice);
router.get("/all/quotation", getAllQuotation);
router.get("/all/invoice", getAllInvoice);
router.get("/find-recept", searchRecept);
router.get("/:id", getReceptById);
router.put("/update/:id", updateRecept);
router.put("/update-to-invoice/:id", updateToInvoice);
router.put("/update-to-quotation/:id", updateToQuotation);
router.delete("/delete/:id", deleteRecept);

module.exports = router;
