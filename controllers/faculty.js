const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Result = require("../models/result");

exports.addAttendance = async (req,res,next)=>{
  try{
    const {array,date,subject} = req.body;
    await Promise.all(array.map(async (i) => {
     const obj ={ date: date, subject: subject, AorP:'P'};
      const updateattendance=await Attendance.updateOne(
        { student:i},
        {$push:{ "attendance" : [obj]}},
        {
          upsert:true
        }
     );
    }))
    res.status(201).json({message:"Attendance updated"});
  }
  catch(err){
    if(!err.statusCode)
      err.statusCode=500;
    next();
  }
}

exports.addresults = async(req,res,next)=>{
  try{
    const {sem,exam,subject,array} = req.body;
    await Promise.all(array.map(async (i) => {
      const updateresult = await Result.updateOne(
        { student:i.student},
        {$push:{ "scores" : [{ sem: sem, exam: exam, subject: subject, score: i.score}]}},
        {
          upsert:true
        }
     );
    }))
    res.status(201).json({message:"result updated"});
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next;
  }
}