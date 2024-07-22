const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "5b4339f0e8fe0a51561855c03ee23a8b4bc62e5d343fb800614b477bb5b23fbed16040d4238870270d9972b08587e990a30055ef7d40947ae72ee6b80beedce5";

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    console.log("Received token:", token); // Add this line for debugging
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message); // Add this line for debugging
    res.status(401).json({ msg: "Token is not valid" });
  }
};
