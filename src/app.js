const express = require('express');
const cors = require('cors');

const app = express();

// 글로벌 미들웨어 (Global Middleware)
app.use(cors());
app.use(express.json());

// 라우트 (Routes)
const adminAuth = require('./routes/admin.auth');
app.use('/admin', adminAuth);

const adminRoutes =require("./routes/admin.routes");
app.use("/admin", adminRoutes);

// JWT 테스트용 보호 라우트
const testProtectedRoute =require('./routes/test.protected');
app.use('/api', testProtectedRoute);

// 테스트용 API (Health Check)
app.get('/', (req, res) => {
  res.send('CRM API is running');
});

module.exports = app;