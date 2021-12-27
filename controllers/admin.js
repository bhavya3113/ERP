const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const mail = require("../utils/sendMails");
const branchList = require("../utils/branchlist");
const subjectList = require("../utils/subjectlist");
const examList = require("../utils/examlist");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { aggregate } = require("../models/student");
const faculty = require("../models/faculty");

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
	const period = `isfree[${req.body.period}]`;
	console.log(period);
	const subject = req.body.subject;
	faculty.find().then(result=>{
		res.json(result);
	})
}