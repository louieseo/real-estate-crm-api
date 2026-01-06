const express = require("express");
const auth = require("../middlewares/auth");
const isAgent = require("../middlewares/isAgent");
const pool = require("../config/db");
const { createCustomer } = require("../controllers/customer.controller");

const router = express.Router();

/**
 * =========================
 * 고객 전체 조회 (Customers.jsx 리스트용)
 * =========================
 * 관리자 / 직원만 가능하도록 보호 ✔
 */
router.get("/", auth, isAgent, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ 고객 리스트 조회 실패", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * =========================
 * 특정 고객 상세 조회 (CustomerDetail.jsx 용)
 * =========================
 */
router.get("/:id", auth, isAgent, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "고객을 찾을 수 없습니다." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ 고객 상세 조회 실패", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * =========================
 * 고객 등록 (이미 있던 기능 유지)
 * =========================
 */
router.post("/", auth, isAgent, createCustomer);

module.exports = router;
