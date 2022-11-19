const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/youtubeRegistration")
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db connection failed");
  });

const schema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});
