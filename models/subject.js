const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectSchema = new schema({
  subjectName:{
    type: String,
    require:true
  },
  subjectCode:{
    type: String,
    require: true
  }
})

module.exports = mongoose.model("subject",subjectSchema);