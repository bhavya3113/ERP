const mongoose = require("mongoose");
const schema = mongoose.Schema;

const announcementSchema = new schema({
  date:{
    type:Date,
    default: Date.now 
  },
  description:String,
  annfor:String,
})

module.exports = mongoose.model("announcement",announcementSchema);