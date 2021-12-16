const mongoose = require("mongoose");
const schema = mongoose.Schema;

const timetableSchema = new schema({
  batch:{
    type:schema.Types.ObjectId,
    ref:"batch"
  },
  slots:[{
    subject:{
      type:schema.Types.ObjectId,
      ref:"subject"
    },
    faculty:{
      type:schema.Types.ObjectId,
      ref:"faculty"
    }
  }]
})

module.exports = mongoose.model("timetable",timetableSchema);