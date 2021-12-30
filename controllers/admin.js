const Student = require("../models/student");
const Faculty = require("../models/faculty");
const mail = require("../utils/sendMails");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');

exports.addFaculty = async (req,res,next)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const admin = await Faculty.findById(req.userId);
    if(!admin || admin.isAdmin=="false")
    {
      const err = new Error('Not an Admin');
      err.statusCode = 422;
      throw err;
    }
    const {fullname,email,password}= req.body;

    if(!fullname || !email || !password ) {
      const err = new Error('All fields are requied');
      err.statusCode = 422;
      throw err;
  }

    const faculty = await Faculty.findOne({email:email});

    if(faculty)
    {
      const err = new Error('Faculty is already registered');
      err.statusCode = 400;
      throw err;
    }
    const hashedPswrd = await bcrypt.hash(password, 12);
    req.body.password = hashedPswrd;
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json({Message : "Faculty Successfully Registred. Email sent."});
    return mail.sendRegMail(email,password,fullname);
  }
  catch(err){
    if(!err.statusCode)
      err.statusCode=500;
      next(err);
  }
}


exports.addStudents = async (req,res,next)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const admin = await Faculty.findById(req.userId);
    if(!admin || admin.isAdmin=="false")
    {
      const err = new Error('Not an Admin');
      err.statusCode = 422;
      throw err;
    }
    const {array}= req.body;

    await Student.insertMany(array);
  
    for(var i=0;i<array.length;i++)
      mail.sendRegMail(array[i].email,array[i].password,array[i].fullname);
    return res.status(201).json({Message : "Student Successfully Registred. Email sent."});
  }
  catch(err){
    if(!err.statusCode)
      err.statusCode=500;
      next(err);
  } 
}