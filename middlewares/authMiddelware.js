const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Extract token safely
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Auth Failed: Invalid token",
        });
      }

      // Attach user ID to request body
      req.body.userId = decoded.userId;
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
