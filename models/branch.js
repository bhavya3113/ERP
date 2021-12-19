const mongoose = require("mongoose");
const schema = mongoose.Schema;

const branchSchema = new schema({
  branchName: String,
  branchCode: Number,
})

module.exports = mongoose.model("branch",branchSchema);