const mongoose = require("mongoose");
const schema = mongoose.Schema;

const batchSchema = new schema({
  batchName:{
    type: String,
    require:true
  },
  year:Number,
  sem: {
    type: Number,
    require: true,
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
    ref:"stutimetable"
  }]  
})

module.exports = mongoose.model("batch",batchSchema);