require("dotenv").config();

const prisma = require("./../../Controller/Prisma");

const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  const url = req.originalUrl;
  console.log("Auth Middleware Triggered for:", url);

  // Allow unauthenticated access to login
  if (url.includes("member/login")) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.BEARER);
      const updated_at = new Date().toISOString();

      const member = await prisma.member.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!member) {
        throw {};
      }

      req.user = member;
      req.member = member;
      req.updated_at = updated_at;
      req.created_by = member?.id;
      req.member_id = member?.id;

      return next();
    } catch (error) {
      //console.error("JWT Verification Error:", error.message);
      return res.status(401).json({
        custom: true,
        message: "Not authorized, invalid token",
      });
    }
  }

  return res.status(401).json({
    custom: true,
    message: "Not authorized, no token",
  });
};

module.exports = Auth;
