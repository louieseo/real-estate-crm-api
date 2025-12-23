const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// 직원 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. 입력값 체크
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  try {
    // 2. 직원 조회
    const result = await pool.query(
      "SELECT * FROM agents WHERE email = $1 AND active = true",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const agent = result.rows[0];

    // 3. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. JWT 발급
    const token = jwt.sign(
      {
        agentId: agent.id,
        adminId: agent.admin_id,
        role: agent.role, // 'agent'
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. 응답
    res.json({
      message: "Agent login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
