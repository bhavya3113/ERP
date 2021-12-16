const mongoose = require("mongoose");
const schema = mongoose.Schema;

const batchSchema = new schema({
  batch:{
    type: String,
    require:true
  },
  students:[{
    type:schema.Types.ObjectId,
    ref:"student"
  }],
  subjects:[{
    type:schema.Types.ObjectId,
    ref:"subject"
  }],
  timetable:[{
    type:schema.Types.ObjectId,
    ref:"timetable"
  }]  
})

module.exports = mongoose.model("batch",batchSchema);