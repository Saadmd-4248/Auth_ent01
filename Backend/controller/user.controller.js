import userModel from '../model/user.model.js'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'


export const createUser = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingUser = await userModel.findOne({email})
    
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: 'User already exists!'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;


    const user = await userModel.create(req.body);

    const token = jwt.sign({
      id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      user,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await userModel.findOne({email});
    if(!user){
      return res.status(400).json({
        success: false,
        message: 'Invalid email'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
    }

    const token = jwt.sign({
      id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    res.status(200).json({
      message: "Login Successfull",
      user,
      token
    });
    
    


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}
  