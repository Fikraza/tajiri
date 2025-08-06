require("dotenv").config;
const jwt = require("jsonwebtoken");

function generateAccessToken(user, exp = 98) {
  console.log(process.env.BEARER);
  return jwt.sign(user, process.env.BEARER, { expiresIn: `${exp}hr` });
}

module.exports = generateAccessToken;
