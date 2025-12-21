require('dotenv').config();   // ← 맨 위
require('./config/db'); // ← DB 연결 실행
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
});
