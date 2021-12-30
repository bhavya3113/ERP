const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Result = require("../models/result");
const Batch = require("../models/batch");

exports.addAttendance = async (req,res,next)=>{
  try{
    const {arrayP,date,subject,arrayA} = req.body;
    await Promise.all(arrayP.map(async (i) => {
     const obj ={ date: date, subject: subject, AorP:'P'};
      const updateattendance=await Attendance.updateOne(
        { student:i},
        {$push:{ "attendance" : [obj]}},
        {
          upsert:true
        }
     );
    }))
    await Promise.all(arrayA.map(async (i) => {
      const obj ={ date: date, subject: subject, AorP:'A'};
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
    const {sem,exam,subject,array,maxmarks} = req.body;
    const ex = await Exam.findByIdAndUpdate(exam,
      {$set:{maxMarks: maxmarks}}
    )
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

exports.viewClass = async(req,res,next)=>{
  try{
    const batchid = req.params.batch;
    const sub = req.params.sub;
    const batch = await Batch.findById(batchid).populate('students');
    // console.log(batch);
    const array=[];
    await Promise.all(batch.students.map(async (i) => {
      const attendance = await Attendance.findOne({student:i});
      var p=0,a=0;
      attendance.attendance.filter(att=>{
        if(att.subject== sub)
        {
          if(att.AorP == 'P')
            p++;
          else if(att.AorP == 'A')
            a++;
        }
      });
      const percent = (p/(a+p))*100; 
      const obj ={
        name:i.fullname,
        email:i.email,
        id:i._id,
        attend: attendance.attendance,
        percentage:percent
      }
      array.push(obj);
    }))
    return res.status(201).json(array);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}


exports.viewScores = async(req,res,next)=>{
  try{
    const batchid = req.params.batch;
    const sub = req.params.sub;
    const batch = await Batch.findById(batchid).populate('students');
    // console.log(batch);
    const array=[];
    await Promise.all(batch.students.map(async (i) => {
      const results = await Result.findOne({student:i});
      if(results == null)
      {
        obj ={
          student: i._id,
          sem: 1,
          subject: sub,
          score: 0
        }
        array.push(obj);
      }
      else{
      // console.log(results)
      results.scores.filter(sco=>{
        if(sco.subject == sub && sco.sem == i.sem)
          {
            obj = sco;
            obj.student = i._id;
            // console.log(obj);
            array.push(obj);
          }
          else{
            obj ={
              student: i._id,
              sem: 1,
              subject: sub,
              score: 0
            }
            array.push(obj);
          }
      });
    }
    }))
    return res.status(201).json(array);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}