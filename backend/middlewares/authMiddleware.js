const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {

    // Check token exists
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Get token
    const token = req.cookies.jwt;

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Save user in request
    req.user = user;

    // Continue
    next();

  } catch (error) {

    console.log("Auth Error:", error.message);

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }

    // Invalid token
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = { protect };