const mongoose = require("mongoose");
const schema = mongoose.Schema;

const studentSchema = new schema({
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
  sem:{
    type: Number,
    require: true
  },
  year:{
    type: Number,
    require: true
  },
  branch:{
    type: String,
    require:true
  },
  batch:{
    type: String,
    require:true
  },
  subjects:[{
    sub:{
      type:schema.Types.ObjectId,
      ref:"subject"
    },
    faculty: String
  }],
  image:{
    type: String,
//    default:  path.join('images','image-noprofile.png')
  },
  feedback:[{
    faculty:{ 
      type: schema.Types.ObjectId,
      ref:'faculty'
    },
    remark:{
      type: String
    },
  }],
  address: String,
  mobileno: Number,
  rollno: Number,
  dob: String,
  father: String,
  mother: String
})

module.exports = mongoose.model("student",studentSchema);