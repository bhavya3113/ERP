const mongoose = require("mongoose");
const schema = mongoose.Schema;

const holidaySchema = new schema({
  date:{
    type:Date
  },
  holiday:{
    type:String
  }
})

module.exports = mongoose.model("Holiday",holidaySchema);