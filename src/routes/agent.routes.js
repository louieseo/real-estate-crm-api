const express = require("express");
const auth = require("../middlewares/auth");
const isAgent = require("../middlewares/isAgent");
const pool = require("../config/db");

const router = express.Router();

// 직원 전용 테스트 API
router.get("/me", auth, isAgent, (req, res) => {
  res.json({
    message: "Welcome agent",
    agent: req.user,
  });
});

// 고객 목록 조회 API
router.get("/customers", auth, isAgent, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE agent_id = $1 ORDER BY id DESC",
      [req.user.agentId]
    );

    res.json({
      message: "Customer list loaded",
      customers: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load customers",
      error: err.message,
    });
  }
});

// 고객 상세 조회 API
router.get("/customers/:id", auth, isAgent, async (req, res) => {
  const customerId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1 AND agent_id = $2",
      [customerId, req.user.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found or you do not have access",
      });
    }

    res.json({
      message: "Customer loaded successfully",
      customer: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load customer",
      error: err.message,
    });
  }
});

// 고객 수정 API
router.put("/customers/:id", auth, isAgent, async (req, res) => {
  const customerId = req.params.id;
  const { name, phone, email, memo, status } = req.body;

  try {
    // 먼저 해당 고객이 직원 소유인지 확인
    const check = await pool.query(
      "SELECT * FROM customers WHERE id = $1 AND agent_id = $2",
      [customerId, req.user.agentId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found or you do not have permission",
      });
    }

    // 고객 정보 업데이트
    const result = await pool.query(
      `UPDATE customers
       SET name = $1,
           phone = $2,
           email = $3,
           memo = $4,
           status = $5
       WHERE id = $6
       RETURNING *`,
      [name, phone, email, memo, status, customerId]
    );

    res.json({
      message: "Customer updated successfully",
      customer: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update customer",
      error: err.message,
    });
  }
});

// 고객 삭제 API
router.delete("/customers/:id", auth, isAgent,async (req, res) => {
try {
const customerId = req.params.id;

const result =await pool.query(
"DELETE FROM customers WHERE id = $1 AND agent_id = $2",
      [customerId, req.user.agentId]
    );

if (result.rowCount ===0) {
return res.status(404).json({
message:"Customer not found or you do not have permission"
      });
    }

    res.json({
message:"Customer deleted successfully"
    });
  }catch (err) {
    res.status(500).json({
message:"Customer delete failed",
error: err.message
    });
  }
});






module.exports = router;
