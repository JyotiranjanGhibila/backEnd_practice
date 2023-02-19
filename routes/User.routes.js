const express = require("express");
const { UserModel } = require("../models/Users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass, gender } = req.body;
  try {
    bcrypt.hash(pass, 3, async (err, hash) => {
      if (err) res.send(err.message);
      else {
        const user = new UserModel({ name, email, pass: hash, gender }); //----------IMP-------------->
        await user.save();
        res.send({ msg: "User Registered" });
      }
    });
  } catch (error) {
    res.send({
      msg: "Something Went Wrong While Registering",
      err: error.message,
    });
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        //-----------------IMP------>
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "masai"); //-----------------IMP----------->
          res.send({ msg: "User Loggedin", token: token });
        } else {
          res.send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.send({
      msg: "Something Went Wrong While Login",
      err: error.message,
    });
  }
});

module.exports = {
  userRouter,
};
