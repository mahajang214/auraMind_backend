const { configDotenv } = require("dotenv");
configDotenv();
const jwt = require("jsonwebtoken");

const protection = async (req, res, next) => {
  try {
    const jwtToken =
      req.cookies?.jwtToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    // console.log("jwtToken : ", jwtToken);
    if (!jwtToken) {
      return res.status(401).json({ message: "Token is not founded" }); // for dev
      // res.status(401).json({message:"Authentication required"}); // for production
    }
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protection;
