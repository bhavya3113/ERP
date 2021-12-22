const mongoose = require("mongoose");
const schema = mongoose.Schema;

const branchSchema = new schema({
  name: String,
  code: Number,
})

module.exports = mongoose.model("branch",branchSchema);