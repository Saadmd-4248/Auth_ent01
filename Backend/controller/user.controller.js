import userModel from '../model/user.model.js'
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import transporter from '../config/nodemailer.js';


export const createUser = async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
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
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ?
      'none' : 'strict',
      maxAge: 7 * 24 * 60 * 1000
    });
    
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Our Website!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="background-color: #4f46e5; padding: 20px 30px;">
              <h2 style="color: #ffffff; margin: 0;">Welcome to Our Website 🎉</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333333;">Assalamualaikum 👋,</p>
              <p style="font-size: 16px; color: #333333;">
                Aapka account successfully create ho chuka hai is email address se:
              </p>
              <p style="font-size: 18px; color: #4f46e5; font-weight: bold; margin: 10px 0;">
                ${email}
              </p>
              <p style="font-size: 16px; color: #333333;">
                Agar aapne ye account nahi banaya to barah-e-karam foran humse raabta karein.
              </p>
              <div style="margin-top: 30px;">
                <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Visit Website
                </a>
              </div>
            </div>
            <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 14px; color: #666;">
              This email was sent by Our Website • <a href="https://yourwebsite.com" style="color: #4f46e5;">ourwebsite.com</a>
            </div>
          </div>
        </div>
      `
    }
    await transporter.sendMail(mailOptions);

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
        message: 'Invalid email!'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password!'
      })
    }

    const token = jwt.sign({
      id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ?
      'none' : 'strict',
      maxAge: 7 * 24 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
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


export const logout = async (req, res) => {
  try {

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ?
      'none' : 'strict'
    })
    return res.json({
      success: true,
      message: 'Successfully logged out!'
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}