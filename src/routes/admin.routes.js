const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

// 관리자 대시보드
router.get("/dashboard", auth, isAdmin, (req, res) => {
  res.json({
    message: "Welcome admin",
    admin: req.user,
  });
});


// 관리자 전용 직원(Agent) 생성 API
router.post("/agents", auth, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. 필수값 체크
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    // 2. 이메일 중복 체크
    const existingAgent = await pool.query(
      "SELECT id FROM agents WHERE email = $1",
      [email]
    );

    if (existingAgent.rows.length > 0) {
      return res.status(409).json({
        message: "Agent with this email already exists",
      });
    }

    // 3. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 직원(Agent) 생성
    const result = await pool.query(
      `INSERT INTO agents
        (admin_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, 'agent')
       RETURNING id, name, email, role, active, created_at`,
      [
        req.user.adminId, // 로그인한 관리자 ID
        name,
        email,
        hashedPassword,
      ]
    );

    // 5. 성공 응답
    res.status(201).json({
      message: "Agent created successfully",
      agent: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create agent",
    });
  }
});


// 이 줄은 항상 파일 맨 아래
module.exports = router;
