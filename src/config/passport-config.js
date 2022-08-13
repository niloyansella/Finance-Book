const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");

// Instruct PassportJs how to handle authentication
const initialize = () => {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );

  passport.serializeUser(serializeUserWithId);
  passport.deserializeUser(deserializeUserById);
};

// Function that tells PassportJs how to authenticate a user by username + password
async function authenticateUser(username, password, done) {
  try {
    const user = await User.findOne({ username: username });

    // console.log(user);

    if (!user) return done(null, false, { message: "No user found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // console.log("isPasswordCorrect: ", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return done(null, false, { message: "Password incorrect" });
    }

    // console.log("Authenticate user successful...");

    return done(null, user);
  } catch (e) {
    return done(e);
  }
}

// Function that tells PassportJs with what information to serialize a user
function serializeUserWithId(user, done) {
  return done(null, user._id);
}

// Function that tells PassportJs how to find a user by Id in order to deserialize the user
async function deserializeUserById(id, done) {
  const user = await User.findById(id);
  return done(null, user);
}

module.exports = initialize();
