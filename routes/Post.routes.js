const express = require("express");
const { PostModel } = require("../models/Post.model");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");

postRouter.get("/all", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while getting all post" });
  }
});

postRouter.get("/", async (req, res) => {
  let { device, device1, device2 } = req.query;
  if (device) {
    try {
      let post = await PostModel.find({ device: device });
      // const posts = await PostModel.find({ user: decoded.userID });
      res.send(post);
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong while getting all post" });
    }
  } else if (device1 && device2) {
    try {
      let post = await PostModel.find({
        $and: [{ device: { device1 } }, { device: { device2 } }],
      });
      res.send(post);
    } catch (error) {
      console.log(error);
      res.send({ msg: "Something went wrong while getting all post" });
    }
  } else {
    res.send({ msg: "No device match" });
  }
});

postRouter.get("/userdata", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    const posts = await PostModel.find({ user: decoded.userID });
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while getting all post" });
  }
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.send({ msg: "post Created" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while posting post" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const postID = req.params.id;
  const Single_post = await PostModel.findOne({ _id: postID });
  const userID_in_post = Single_post.user;
  const current_UserID = req.body.user;
  try {
    if (current_UserID !== userID_in_post) {
      res.send({
        msg: "You are not authorized to delete this post / you are not the owner of this post",
      });
    } else {
      await PostModel.findByIdAndDelete({ _id: postID });
      res.send({ msg: `post w/ id:${postID} has been deleted` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while Deleting post" });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const postID = req.params.id;
  const Single_post = await PostModel.findOne({ _id: postID });
  const userID_in_post = Single_post.user;
  const current_UserID = req.body.user;
  try {
    if (current_UserID !== userID_in_post) {
      res.send({
        msg: "You are not authorized to update this post / you are not the owner of this post",
      });
    } else {
      await PostModel.findByIdAndUpdate({ _id: postID }, payload);
      res.send({ msg: `post w/ id:${postID} has been Updated` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while Updating post" });
  }
});

module.exports = {
  postRouter,
};
