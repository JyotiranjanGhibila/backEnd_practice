const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  device: String,
  user: String,
});

const PostModel = mongoose.model("blog", postSchema);

module.exports = {
  PostModel,
};
