const express =require("express");
const auth =require("../middlewares/auth");
const isAgent =require("../middlewares/isAgent");

const router = express.Router();

// 직원 전용 테스트 API
router.get("/me", auth, isAgent,(req, res) => {
  res.json({
message:"Welcome agent",
agent: req.user,
  });
});

module.exports = router;