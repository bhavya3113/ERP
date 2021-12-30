const mongoose = require("mongoose");
const schema = mongoose.Schema;

const examSchema = new schema({
  
  examName: String,
  maxMarks: Number
})

module.exports = mongoose.model("exam",examSchema);