const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// 연결 테스트
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('❌ DB connection error:', err.message);
    } else {
        console.log('✅ DB connected:', result.rows[0]);
    }
});

module.exports = pool;