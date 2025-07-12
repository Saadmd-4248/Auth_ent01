import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import transporter from "../config/nodemailer.js";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const user = await userModel.create(req.body);

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Website!",
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
      `,
    };
    await transporter.sendMail(mailOptions);

    verifyOTP()

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

      error: error.message,
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

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "Successfully logged out!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId)
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified!",
      });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = OTP;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Account – OTP Inside",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
     <meta charset="UTF-8" />
     <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f3f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 50px 0; background-color: #f1f3f7;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <tr>
                <td style="background-color: #1f2937; padding: 30px;">
                  <h2 style="color: #ffffff; margin: 0;">🔐 Verify Your Email</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="font-size: 16px; color: #111827; margin-bottom: 20px;">
                    Hello,
                  </p>
                  <p style="font-size: 16px; color: #374151; margin-bottom: 10px;">
                    Use the following One-Time Password (OTP) to verify your account:
                  </p>
                  <p style="font-size: 28px; font-weight: bold; color: #4f46e5; background-color: #f3f4f6; padding: 15px 20px; text-align: center; border-radius: 8px; letter-spacing: 4px;">
                    ${OTP}
                  </p>
                  <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                    This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.
                  </p>
                  <div style="margin-top: 30px;">
                    <a href="https://yourwebsite.com/verify" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                      Verify Now
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; text-align: center; padding: 20px; font-size: 13px; color: #9ca3af;">
                  &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
    };
    await transporter.sendMail(mailOption);

    res.status(201).json({
      success: true,
      message: "Verification OTP sent on email successfully!"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    
    const {userId, OTP} = req.body;

    if(!userId || !OTP) {
      return res.status(400).json({
        success: false,
        message: "Missing details!"
      })
    }

    const user = await userModel.findById(userId);

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }

    if(user.verifyOtp === '' || user.verifyOtp !== OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!"
      })
    }

    if(user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired!"
      })
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Email is verified successfully!"
    })
       

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}