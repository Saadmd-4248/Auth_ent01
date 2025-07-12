import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Not authorized login again!",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

    if(tokenDecode.id) {
      req.body.userId = tokenDecode.id
    }else {
      res.status(400).json({
        success: false,
        message: 'Not Authorized login again!'
      })
    }

    next();
    
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

export default userAuth;
