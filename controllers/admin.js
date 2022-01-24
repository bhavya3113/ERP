const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const Holiday=require('../models/holiday');
const mail = require("../utils/sendMails");
const branchList = require("../utils/branchlist");
const subjectList = require("../utils/subjectlist");
const examList = require("../utils/examlist");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { aggregate } = require("../models/student");
const faculty = require("../models/faculty");
const batch = require("../models/batch");
const { json, attachment } = require("express/lib/response");
const { ObjectId } = require("mongodb");
const req = require("express/lib/request");
const subject = require("../models/subject");
const student = require("../models/student");
const attendance = require("../models/attendance");
const branch = require("../models/branch");
const path = require("path");

//to add a new faculty
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

//to add a new batch of students
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
    const {array,password}= req.body;
    const hashedPswrd = await bcrypt.hash(password, 12);

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

// //to update branch list
// exports.addBranches = async (req,res,next)=>{
//   try{
//     const branchlist = [];
//     for (const code in branchList) {
//       if (branchList.hasOwnProperty(code)) {
//         const branch = branchList[code];
//           let onebranch = {
//             name: branch,
//             code: code
//           };
//           branchlist.push(onebranch);
//       }
//     }
//     Branch.insertMany(branchlist);
//     return res.status(200).json({message: "branch list updated"});
//   }
//   catch(err){
//     if(!err.statusCode)
//     err.statusCode =500;
//     next();
//   }
// }


//to update branch or subject or exam list
exports.addBranchOrSubjectOrExam = async (req,res,next)=>{
  try{
    const {name,code}=req.body;
    const mod = req.query.mod;
    const result = await ((mod==="branch")?Branch:(mod==="subject")?Subject:Exam).findOne({Code:code})
      if(!result){
       await ((mod==="branch")?Branch:(mod==="subject")?Subject:Exam).insertOne({
          name: name,
          code: code
        })
        return res.status(200).json({message: `${mod} list updated`});
      }
      else{
        const error = new Error(`${mod} already Exists`);
        error.statusCode = 400;
        throw error;
      }
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next();
  }
}

//to view branches
exports.viewBranches = async (req,res,next)=>{
  try{
    const branchlist = await Branch.find();
    return res.status(201).json({branches: branchlist});
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next();
  }
}


// //to update subject list
// exports.addSubjects = async (req,res,next)=>{
//   try{
//     const subjectlist = [];
//     for (const code in subjectList) {
//       if (subjectList.hasOwnProperty(code)) {
//         const subject = subjectList[code];
//           let onesubject = {
//             name: subject,
//             code: code
//           };
//           subjectlist.push(onesubject);
//       }
//     }
//     Subject.insertMany(subjectlist);
//     return res.status(200).json({message: "subject list updated"});
//   }
//   catch(err){
//     if(!err.statusCode)
//     err.statusCode =500;
//     next();
//   }
// }

//to view subjects
exports.viewSubjects = async (req,res,next)=>{
  try{
    const subjectlist = await Subject.find();
    return res.status(201).json({subjects: subjectlist});
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next();
  }
}


//  //to update exam list
// exports.addExams = async (req,res,next)=>{
//   try{
//     const examlist = [];
//     for (const code in examList) {
//       if (examList.hasOwnProperty(code)) {
//         const exam = examList[code];
//         let oneexam = {
//           name: exam,
//           code:code
//         };
//         examlist.push(oneexam);
//       }
//     }
//     Exam.insertMany(examlist);
//     return res.status(200).json({message: "exam list updated"});
//   }
//   catch(err){
//     if(!err.statusCode)
//     err.statusCode =500;
//     next();
//   }
// }

//to view exams
exports.viewExams = async (req,res,next)=>{
  try{
    const examlist = await Exam.find();
    return res.status(201).json({exams: examlist});
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next();
  }
}

exports.timetable = async(req,res,next)=>{
  try{
    const batchname = req.body.batchname;
    const arr = [];
    result = await batch.findOne({batchName:batchname});
    let s=[];
    for(let i = 0 ; i < result.subjects.length;i++){
      const sub = await subject.findById({_id:result.subjects[i]});
      s.push(sub.name);
      const teacher = await Faculty.aggregate([{$match:{"subject":result.subjects[i]}},{$group:{_id:"$fullname"}}]);
      s.push(teacher);
    }
    console.log(s);
    res.status(201).json(s);
  }
  catch(err){
    next(err);
  }   
}

exports.holidays = async(req,res,next)=>{
  try{
    const date =  req.body.date;
    const holiday = req.body.holiday;
    const day = await Holiday.findOne({date:date});
    if(day){
      day.holiday = day.holiday+", "+holiday;
      await day.save();
      return res.status(204).json(day);
    }
    else{
      const holi = new Holiday({
        date:date,
        holiday:holiday
      });
      holi.save();
      return res.status(201).json(holi);
    }
  }
  catch(err){
    next(err);
  }
}
exports.showHoliday = async(req,res,next)=>{
  try{
    Holiday.find({},"date holiday",(err,item)=>{
      if(err){
        throw err;
      }
      res.status(200).json(item);
    }).sort({"date":1});
  }
  catch(err){
    next(err);
  }
}

exports.showProfile = async(req , res, next)=>{
  try{
    const user =  req.query.user;
    const id=req.params.id;
    const userInfo = await ((user==="student")?student:faculty).findById(id);
    if(!userInfo){
      const err = new Error('User not define');
      throw err;
    }
    if(user==="student"){
      const att = await attendance.findOne({student:id});
      const result = {
        profile:userInfo,
        att:att.totalpercent
      }
      return res.status(201).json(result);
    }
    if(user==="admin"){
      const studentNo = await student.count();
      const facultyNo = await faculty.count();
      const branchNo = await branch.count();
      const result = {
        profile:userInfo,
        studentNo:studentNo,
        facultyNo:facultyNo,
        branchNo:branchNo
      }
      return res.status(201).json(result);
    }
    return res.status(201).json(userInfo);
  }
  catch(err){
    err.status=401
    next(err);
  }
}

// email pe @akgec.ac.in

exports.editProfile = async(req, res, next)=>{
  try{
    const fileinfo = req.file;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const degree = req.body.degree;
    const user =  req.query.user;
    const id=req.params.id;
    var imageurl;
    if(fileinfo)
     {
      imageurl = fileinfo.path;
     }
    console.log(imageurl,fileinfo);
    const userInfo = await ((user==="student")?student:faculty).findByIdAndUpdate(id,{
      fullname:fullname,
      image:imageurl,
      email:email,
      mobile:mobile,
      degree:degree
    },{upsert:true,omitUndefined: true});
    console.log(userInfo);
    return res.status(204).json(userInfo);
  }
  catch(err){
    next(err); 
  }
}

exports.batchlist = async(req,res,next)=>{
  try{
    const year = req.params.year;
    const yr= parseInt(year);
    const bat = await batch.aggregate([{$match:{"year":yr}},{ $group: {_id: "$batchName"} }
    ]);
    return res.status(201).json(bat);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}