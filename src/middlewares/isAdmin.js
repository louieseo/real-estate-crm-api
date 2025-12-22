module.exports =function (req, res, next) {
// auth 미들웨어가 먼저 실행되어야 함
if (!req.user) {
return res.status(401).json({
message:"Unauthorized",
    });
  }

// 관리자 권한 체크
if (req.user.role !=="admin") {
return res.status(403).json({
message:"Admin access only",
    });
  }

// 관리자면 통과
next();
};