module.exports =function (req, res, next) {
// auth 미들웨어가 먼저 실행되어야 함
// 그래서 req.user가 이미 존재함

// 직원(agent) 인지 체크
if (req.user.role !=="agent") {
return res.status(403).json({
message:"Agent access only",
    });
  }

// 직원이면 다음 단계로 진행
next();
};