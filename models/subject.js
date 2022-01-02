const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectSchema = new schema({
  name: String,
  code: String
})

module.exports = mongoose.model("subject",subjectSchema);