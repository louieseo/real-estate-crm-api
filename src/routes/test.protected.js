const express =require('express');
const authMiddleware =require('../middlewares/auth');

const router = express.Router();

// JWT 인증이 필요한 API
router.get('/protected', authMiddleware,(req, res) => {
  res.json({
message:'You are authorized!',
user: req.user
  });
});

module.exports = router;