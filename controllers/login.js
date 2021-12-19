const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const faculty = require('../models/faculty');
const Otp = require("../models/otp");
const student = require('../models/student');
const mail = require("../utils/sendMails");
const otpGenerator = require("otp-generator");
const { validationResult } = require('express-validator');

exports.login = (req ,res ,next)=>{
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const user = req.query.user;
        (user==="student")?student:faculty.findOne({email:email}).then(result=>{
            if(!result){
                return res.status(404).json('Not found');
            }
            // console.log(result);
            bcrypt.compare(pass,result.password).then(item=>{
                if(item){
                    const accessToken = jwt.sign({email:email,userId:result._id},process.env.AC,{expiresIn:"150s"});
                    const refreshToken = jwt.sign({email:email,userId:result._id},process.env.RE , {expiresIn:"86400s"});
                    res.statusCode = 201;
                    return res.json({
                        email,
                        accessToken,
                        refreshToken
                    });
                }
                res.statusCode = 401;
                res.json('incorrect pass');
            })
        });
    }
    catch{
        const err = new Error('not found');
        err.status= 404;
        throw err;
    }
}

exports.resetPassword= async (req,res,next)=>{
    try{
    const email = req.body.email;
    const newPwd = req.body.password;
    const confirmPwd = req.body.cpassword;
    const User = req.query.user;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
     
        if(newPwd != confirmPwd)
        {
          const error = new Error("Passwords do not match");
          error.statusCode = 422;
          throw error;
        }
        const hashedPassword = await bcrypt.hash(newPwd, 12)
        const user = await User.findOne({email: email})
            if(user){
              user.password = hashedPassword;
              user.save();
            return res.status(200).json({message:"new password saved"});
            }
        }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
          } 
    }
  }
  
  exports.resendotp = async (req,res,next)=>{
    try{
    const {email} = req.body;
    const index = email.indexOf("@");
    const fullname = email.substring(0,index);;
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      specialChars: false,
      upperCase: false,
    });
    const onetimepwd = new Otp({
      email:email,
      otp:otp
    });
    await onetimepwd.save();
     res.status(200).json({message: "otp sent"});
    return mail.sendOtp(email,otp,fullname);
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
            next(err);
          }
    }
  }

  exports.verifybeforereset = async (req,res,next)=>{
    try{
      const {email} = req.body; 
      const User = req.query.user;
      const user = await User.findOne({ email: email })
    
      if(!user)
      {
        const err = new Error('Not registered');
        err.statusCode = 400;
        throw err;
      }
      const otp = otpGenerator.generate(6, {
        alphabets: false,
        specialChars: false,
        upperCase: false,
      });
      const onetimepwd = new Otp({
        email:email,
        otp:otp
      });
      await onetimepwd.save();
       res.status(200).json({message: "otp sent"});
      return mail.sendOtp(email,otp,user.fullname);
    }
    catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    }
  }
  exports.checkotpbeforereset= async (req,res,next)=>{
    try{
    const {email,otp} = req.body
    const newotp = await Otp.findOne({email:email}).sort({createdAt : -1})
      if(!newotp)
      {
        const err = new Error('Otp is expired');
        err.statusCode = 422;
        throw err;
      }
      if (newotp.otp !== otp) 
      { 
        const err = new Error("Wrong Otp");
        err.statusCode = 422;
        throw err;
      }
        return res.status(200).json({message: "verified.Proceed to reset password"});
    }
    catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    }
  }
  