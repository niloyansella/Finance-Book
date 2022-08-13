require("dotenv").config();
require("ejs");
require("./config/passport-config");
require("./config/mongodb");

const express = require("express");
const session = require("express-session");
const passport = require("passport");

const path = require("path");
express.static(path.join(__dirname, "public"));
// const hotReload = require("../hot-reload");
const { isAuthenticated } = require("./middleware");
const Transaction = require("./models/Transaction");
const api = require("./routes/api");
const calculateStats = require("./utils/calculateStats");

const MongoStore = require("connect-mongo");
const { deserializeUser } = require("passport");
const app = express();
const PORT = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://Doron_Dayan:${process.env.MONGODB_PASSWORD}@cluster0.g2v3ixq.mongodb.net/?retryWrites=true&w=majority`,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(api);

// app.use(hotReload());

// VIEWS
app.get("/homepage", isAuthenticated, async (req, res) => {
  console.log(req.user);

  const transactions = await Transaction.find({ user_id: req.user._id });
  const { profitLoss, purchase, revenue, cash, pin, salary } =
    calculateStats(transactions);

  res.render("homepage", {
    pageTitle: "Finance Book",
    profitLoss,
    purchase,
    revenue,
    cash,
    pin,
    salary,
    username: req.user.username,
    picture: req.user.picture,
  });
});

app.get("/about", isAuthenticated, (req, res) => {
  res.render("about", { pageTitle: "About us | FinanceBook " });
});

app.get("/", (req, res) => {
  res.render("login", { pageTitle: "Login in |FinanceBook " });
});

app.get("/signup", (req, res) => {
  res.render("signup", { pageTitle: "Sign Up | FinanceBook" });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
