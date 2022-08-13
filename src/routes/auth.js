const router = require("express").Router();
const { object } = require("joi");
const { loginSchema, signUpSchema } = require("./auth.validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

// code, routes

// Create two POST routes, one for Login and one for Register.

// Endpoint should have Try-Catch on all instances, both on Server ánd Auth.js

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.post("/signup", async (req, res) => {
  try {
    const credentials = req.body;
    const { username, password } = await signUpSchema.validateAsync(
      credentials
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    console.log(
      `User is created ${username} is the Username and the Password is ${hashedPassword}`
    );
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) throw new Error(err.message);
      res.sendStatus(200);
    });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
});

module.exports = router;
