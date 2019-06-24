/**** data.js ****/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// data base's notes structure 
const DataSchema = new Schema(
  {
    id: Number,
    title: String,
    content: String,
    position: Object,
    author: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);