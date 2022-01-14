const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Result = require("../models/result");
const Batch = require("../models/batch");
const Announcement = require("../models/announcement")
const  excelToJson = require("convert-excel-to-json");

exports.addAttendance = async (req,res,next)=>{
  try{
    const {arrayP,date,subject,arrayA} = req.body;
    for(var i=0;i<arrayP.length;i++)
    {
     const obj ={ date: date, subject: subject, AorP:'P'};
      const updateattendance=await Attendance.findOneAndUpdate(
        { student:arrayP[i]},
        {$push:{ "attendance" : [obj]}},
        {
          upsert:true
        }
     );
    //  console.log(updateattendance);
      updateattendance.totalP +=1;
      updateattendance.totalpercent = (updateattendance.totalP/(updateattendance.attendance.length+1))*100;
      // console.log(updateattendance.totalP,updateattendance.attendance.length,updateattendance.totalpercent);
      await updateattendance.save();
    }
    for(var i=0;i<arrayA.length;i++)
    {
      const obj ={ date: date, subject: subject, AorP:'A'};
       const updateattendance=await Attendance.findOneAndUpdate(
         { student:arrayA[i]},
         {$push:{ "attendance" : [obj]}},
         {
           upsert:true
         }
      );
        updateattendance.totalpercent = (updateattendance.totalP/(updateattendance.attendance.length+1))*100;
        // console.log(updateattendance.totalP,updateattendance.attendance.length)
        await updateattendance.save();
     }

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
    for(var i=0;i<array.length;i++)
    {
      const updateresult = await Result.findOneAndUpdate(
        { student:array[i].student},
        { $push:{ "scores" : [{ sem: sem, exam: exam, subject: subject, score: array[i].score}]}},
        { upsert:true}
     )
    }
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
    const batch = await Batch.findById(batchid).populate('students');
    return res.status(201).json(batch);
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
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      
      else{
      // console.log(results)
      results.scores.filter(sco=>{
        if(sco.subject == sub && sco.sem == i.sem)
          {
            obj ={
              student:i._id,
              sem: sco.sem,
              exam: sco.exam,
              subject: sco.subject,
              score: sco.score 
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


exports.makeAnnouncements = async(req,res,next)=>{
  try{
    const {announcement,date,annfor}=req.body;
    const ann = new Announcement({
      date: date,
      description:announcement,
      annfor:annfor
    }) 
    await ann.save();
    return res.status(201).json("done");
  }
  catch(err){
    if(!err.statusCode) 
    err.statusCode = 500; 
    next();
  }
} 