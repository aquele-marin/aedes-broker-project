const mongoose = require("mongoose");

const uri =
  "mongodb+srv://gabrielmarin:gaonline@cluster0.sh7rzqd.mongodb.net/?retryWrites=true&w=majority";

const db = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
