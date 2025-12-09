import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import twilio from "twilio";


dotenv.config();

const userRegistration = async (req, res) => {

  const { name, email, password, confirm_password, mobile_number } = req.body;



  if (!name || !email || !password || !confirm_password || !mobile_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (password !== confirm_password) {
      return res.status(400).json({ message: "password is not matched" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already register" });
    }


    const hashedpassword = await bcrypt.hash(password, 10);

    //creating user
    const userCreation = await User.create({
      name,
      email,
      password: hashedpassword,
      mobile_number
    });

    return res.status(201).json({ message: "user register successfuly", userId: userCreation._id });
  }
  catch (error) {

    return res.status(500).json({ message: 'server error', error: error.message });
  }

}

export default userRegistration;


export const Loginform = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ message: "Incorrect password" });

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

   
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your login OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: "+91"+user.mobile_number,              
    });

    console.log("OTP sent:", otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      userId: user._id,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const VerifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp)
    return res.status(400).json({ message: "User ID and OTP required" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

   
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      
      message: "OTP verified successfully",
      token,
      userId: user._id,
      Name: user.name,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const DashboardPage = async (req, res) => {

  try {
    const userdetail = await User.find();

    return res.status(200).json(userdetail)
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: "server error" })
  }


}

// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // your APP PASSWORD
  }
});

// // Optional: verify transporter
// transporter.verify((err, success) => {
//   if (err) console.log("Email transporter error:", err);
//   else console.log("Email transporter ready!");
// });


export const ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const link = `https://form-registration-login-123.netlify.app/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <a href="${link}" 
       style="
         display: inline-block;
         padding: 12px 20px;
         color: white;
         background: #007bff;
         text-decoration: none;
         border-radius: 5px;
         font-size: 16px;
         font-weight: bold;
       ">
       Reset Password
    </a>
  </div>
`   });

    res.status(200).json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ message: "Failed to send reset email", error: err.message });
  }
};



export const ResetPassword = async (req, res) => {
  const { token } = req.params;            // token from URL
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};
