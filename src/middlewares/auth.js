const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Authorization 헤더 확인
  const authHeader = req.headers["authorization"];

  // 헤더가 없는 경우
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  // 2. "Bearer 토큰값" 에서 토큰만 분리
  const token = authHeader.split(" ")[1];

  // 토큰이 없는 경우
  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    // 3. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. 요청 객체에 사용자 정보 저장
    req.user = decoded;

    // 5. 다음 단계로 이동
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
