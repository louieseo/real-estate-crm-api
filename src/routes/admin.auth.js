const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// 관리자 계정 생성
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    res.json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 관리자 로그인 API 코드 작성
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. 입력값 체크
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  try {
    // 2. DB에서 관리자 조회
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    // 3. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. JWT 발급
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. 응답
    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
