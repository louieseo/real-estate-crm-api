const pool = require("../config/db");

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, memo, status } = req.body;

    // 필수값 체크
    if (!name || !phone) {
      return res.status(400).json({
        message: "name 과 phone 은 필수입니다.",
      });
    }

    const agentId = req.user.agentId; // JWT 에서 가져옴

    const result = await pool.query(
      `INSERT INTO customers
        (agent_id, name, phone, email, memo, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [agentId, name, phone, email || null, memo || null, status || "lead"]
    );

    res.status(201).json({
      message: "Customer created successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("createCustomer error:", error);
    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};
