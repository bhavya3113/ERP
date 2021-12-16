const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendanceSchema = new schema({
  student:{
    type:schema.Types.ObjectId,
    ref:"student"
  },
  attendance:[{
    date:{
      type:Date,
    },
    subject:{
      type:schema.Types.ObjectId,
      ref:"subject"
    },
    AorP:{
      type: String
    }
  }]
})

module.exports = mongoose.model("attendance",attendanceSchema);