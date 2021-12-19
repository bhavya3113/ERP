const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectSchema = new schema({
  subjectName: String,
  subjectCode: String
})

module.exports = mongoose.model("subject",subjectSchema);