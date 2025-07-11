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
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Account Created</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f1f3f7; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f3f7; padding: 50px 0;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
                <tr>
                  <td style="background-color:#1f2937; padding: 30px;">
                    <h1 style="color:#ffffff; font-size:24px; margin:0;">Your Account is successfully created!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="font-size:16px; color:#111827; line-height:1.6;">
                      Hello,
                    </p>
                    <p style="font-size:16px; color:#374151; line-height:1.6;">
                      This is to inform you that an account has been created on our platform using the following email address:
                    </p>
                    <p style="font-size:18px; color:#111827; font-weight:600; margin:20px 0; padding:10px 20px; background-color:#f3f4f6; border-left:4px solid #6366f1;">
                      ${email}
                    </p>
                    <p style="font-size:16px; color:#374151; line-height:1.6;">
                      If this wasn’t you, please <a href="mailto:support@yourwebsite.com" style="color:#4f46e5; text-decoration:none;">contact our support team</a> immediately.
                    </p>
                    <div style="margin: 30px 0;">
                      <a href="https://yourwebsite.com" style="background-color:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-size:16px; font-weight:500;">
                        Go to Website
                      </a>
                    </div>
                    <p style="font-size:14px; color:#9ca3af;">
                      This is an automated message. Please do not reply directly to this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f9fafb; padding: 20px; text-align:center; font-size:13px; color:#9ca3af;">
                    © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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

export const verifyOTP = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}