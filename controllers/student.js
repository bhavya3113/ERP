const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Announcement = require("../models/announcement")
const Result = require("../models/result");
const Batch = require("../models/batch");

//to view attendance
exports.viewAttendance = async(req,res,next)=>{
  try{
    const studentid = req.params.student;
    const array=[];
    const student = await Student.findById(studentid);
    const attendance = await Attendance.findOne({student:studentid});
      if(attendance == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else{
        // await Promise.all(student.subjects.map(async (i) =>
        for(var i=0;i<student.subjects.length;i++) 
        { 
          var p=0,a=0;
          const attend=[];
          attendance.attendance.filter(att=>{
            if(att.subject.toString() == student.subjects[i].toString())
            {
              if(att.AorP == 'P')
              {
                p++;
                atobj ={
                  date: att.date,
                  status:att.AorP
                }
              }
              else if(att.AorP == 'A')
              {
                a++;
                atobj ={
                  date: att.date,
                  status:att.AorP
                }
              }
              attend.push(atobj);
            }
          });
          if(p==0 && a==0)
            percent =0;
          else
            percent = (p/(a+p))*100; 
          const obj ={
            subject:student.subjects[i],
            attend: attend,
            percentage:percent
          }
          array.push(obj);
        }
        //))
        array.push({totalpresent:attendance.totalP,totalpercent:attendance.totalpercent});
      }
  return res.status(201).json(array);
}
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}

//to view result
exports.viewResult = async(req,res,next)=>{
  try{
    const userid = req.params.student;
    // const userid = req.userId;
    const student = await Student.findById(userid);
    const result = await Result.findOne({student:userid});
      if(result == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else
      {
        return res.status(201).json(result.scores);
      }
}
catch(err){
  if(!err.statusCode)
  err.statusCode = 500;
  next();
}
}

exports.viewAnnouncement= async (req,res,next)=>{
  try{
    const user = req.query.user; 
    if(user=="admin")
    {
      const ann = await Announcement.find({}).sort({date:-1})
      return res.status(201).json(ann);
    }
    const ann = await Announcement.find({$or:[
      {annfor:user},
      {annfor:"both"}
    ]}).sort({date:-1})
    return res.status(201).json(ann);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}