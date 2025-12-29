module.exports =function (req, res, next) {
// auth 미들웨어가 먼저 실행되지만
// 아래에 req.user 을 작성해둔 이유는 “auth 없이도 isAdmin을 쓰는 경우”를 대비한 것
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