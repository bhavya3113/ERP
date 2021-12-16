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
  
  // profileImgUrl:{
  //   type: String,
  //   default:  path.join('images','image-noprofile.png')
  // }
})

module.exports = mongoose.model("",facultySchema);