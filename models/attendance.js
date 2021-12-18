const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendanceSchema = new schema({
  student:{
    type:schema.Types.ObjectId,
    ref:"student"
  },
  attendance:[{
    date: Date,
    subject: String,
    AorP: String
  }],
  percentage: Number
})

module.exports = mongoose.model("attendance",attendanceSchema);