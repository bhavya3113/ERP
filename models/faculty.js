const mongoose = require("mongoose");
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
  isAdmin:{
    type: String,
    require: true,
    default:"false"
  },
  batches:[{
    type:schema.Types.ObjectId,
    ref:"batch"
  }],
  subject:{
    type:schema.Types.ObjectId,
    ref:"subject",
    require:true
  },
  timetable:[{
    type:schema.Types.ObjectId,
    ref:"factimetable"
  }],
  image:{
    type: String,
    //default:  path.join('images','image-noprofile.png')
  },
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

module.exports = mongoose.model("",facultySchema);