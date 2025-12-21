const jwt = require('jsonwebtoken');

// .env 사용
require('dotenv').config();

// 테스트용 사용자 정보
const adminUser = {
  id: 1,
  email: 'admin@test.com',
  role: 'admin'
};

// JWT 생성
const token = jwt.sign(
  adminUser,                 // payload
  process.env.JWT_SECRET,    // 비밀키
  { expiresIn: '1h' }        // 유효기간
);

console.log('JWT TOKEN:', token);

// JWT 검증
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('DECODED:', decoded);

