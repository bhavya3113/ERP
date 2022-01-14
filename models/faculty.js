const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const schema = mongoose.Schema;

const facultySchema = new schema({
  fullname:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require:true
  },
  mobile:{
    type:Number
  },
  isAdmin:{
    type: Boolean,
    require: true,
    default:false
  },
  batches:[{
    type:schema.Types.ObjectId,
    ref:"batch"
  }],
  degree:{
    type:String,
    required:true
  },
  subject:{
    type:String
  },
  timetable:[{
    type:schema.Types.ObjectId,
    ref:"factimetable"
  }],
  image:{
    type: String,
    //default:  path.join('images','image-noprofile.png')
  },
  isfree:[{
    type:Boolean,
    default:true,
    required:true
  }],
  feedback:[{
    student:{ 
      type: schema.Types.ObjectId,
      ref:'student'
    },
    range:{
    type: Number,
    min:1,
    max:5,
    },
    remark:{
      type: String
    },
  }],
  avgrange:{ 
   type: Number,
   require: false,
  },
  })

module.exports = mongoose.model("faculty",facultySchema);