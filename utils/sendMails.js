const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: process.env.API_KEY
  }
}))

exports.sendOtp =(email,otp,fullname)=>{
  transporter.sendMail({
    to:email,
    from:'learnatstuista@gmail.com',
    subject:'Verification OTP',
    html:`<h4>Hello ${fullname},</h4>
    <br>Please use this One time password for verification.<br>
    OTP:${otp}<br>
    Do not share it with anyone.<br>
    <h5>Thanks ,<br>ERP</h5>`
  })
}

exports.sendRegMail =(email,password,fullname)=>{
    transporter.sendMail({
      to:email,
      from:'learnatstuista@gmail.com',
      subject:'Login Credentials',
      html:`<h4>Hello ${fullname},</h4>
      <br>Your Login Credentials for ERP:<br>
      Email:${email}<br>
      Password:${password}<br>
      Please change your password an do not share it with anyone.<br>
      <h5>Thanks ,<br>ERP</h5>`
    })
}