const router = require("express").Router();
const transactions = require("./transactions");
const auth = require("./auth");

router.use("/transactions", transactions);
router.use("/auth", auth);

module.exports = router;
