const mongoose = require("mongoose");
const schema = mongoose.Schema;

const factimetableSchema = new schema({
  
  schedule:[{
    day: String,
    slot: String,
    batch: String
  }]
})

module.exports = mongoose.model("factimetable",factimetableSchema);