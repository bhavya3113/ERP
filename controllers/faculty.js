const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");

exports.addAttendance = async (req,res,next)=>{
  try{
    const {array,date,subject} = req.body;
    await Promise.all(array.map(async (i) => {
     const obj ={ date: date, subject: subject, AorP:'P'};
      const updateattendance=await Attendance.updateOne(
        { student:i},
        {$push:{ "attendance" : [obj]}},
        {
        //   multi: true,
          upsert:true
        }
     );
    }))
    // for(var i=0;i<array.length;i++)
    // {
    //   const stu = await Attendance.findOne({student:array[i]});
    //   if(stu)
    //   {
    //     let pre ={
    //       date : date,
    //       subject :subject,
    //       AorP: 'P'
    //     }
    //     stu.attendance.push(pre);
    //     await stu.save();
    //     console.log("hello");
    //   }
    //   if(!stu)
    //   {
        // console.log(array[i]);
        
        //  const stu = await Attendance.findOneAndUpdate({student:array[i]},
        //   {$addToSet:{attendance:{$concatArrays:[ "$attendance",{date:date, subject:subject, AorP:'P'}]}}},
        //   [{ upsert: true },{new:true}]
        //   );
        // const stu = await Attendance.updateOne({student:array[i]},
        //   {$addFields:{attendance:{$concatArrays:[{date:date, subject:subject, AorP:'P'}]}}},
        //   { upsert: true }
        //   );
        // console.log("bye");
      // }
    // }
    res.status(201).json({message:"Attendance updated"});
  }
  catch(err){
    if(!err.statusCode)
      err.statusCode=500;
    next();
  }
}