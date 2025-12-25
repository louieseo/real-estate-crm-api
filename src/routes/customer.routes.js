const express =require("express");
const auth =require("../middlewares/auth");
const isAgent =require("../middlewares/isAgent");
const { createCustomer } =require("../controllers/customer.controller");

const router = express.Router();

// 고객 등록 (직원 전용)
router.post("/", auth, isAgent, createCustomer);

module.exports = router;