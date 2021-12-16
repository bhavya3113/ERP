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
  // profileImgUrl:{
  //   type: String,
  //   default:  path.join('images','image-noprofile.png')
  // }
})

module.exports = mongoose.model("student",studentSchema);