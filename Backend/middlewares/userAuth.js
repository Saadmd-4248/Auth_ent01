import Jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Not authorized login again!",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
