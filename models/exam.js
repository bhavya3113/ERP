const mongoose = require("mongoose");
const schema = mongoose.Schema;

const examSchema = new schema({
  
  name: String,
  code:Number
  
})

module.exports = mongoose.model("exam",examSchema);