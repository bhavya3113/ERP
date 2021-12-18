const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stutimetableSchema = new schema({
  batch:{
    type:schema.Types.ObjectId,
    ref:"batch"
  },
  schedule:[{
    day: String,
    slot: String,
    subject: String,
    faculty: String
  }]
})

module.exports = mongoose.model("stutimetable",stutimetableSchema);