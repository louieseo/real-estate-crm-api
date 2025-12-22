const express =require("express");
const auth =require("../middlewares/auth");
const isAdmin =require("../middlewares/isAdmin");

const router = express.Router();

// 관리자 대시보드
router.get("/dashboard", auth, isAdmin,(req, res) => {
  res.json({
message:"Welcome admin",
admin: req.user,
  });
});

// (앞으로 여기에 추가됨)
// router.post("/agents", auth, isAdmin, ...)
// router.get("/agents", auth, isAdmin, ...)

module.exports = router;