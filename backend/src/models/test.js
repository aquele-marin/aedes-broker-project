const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
    trim: true,
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
