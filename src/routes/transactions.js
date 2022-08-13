const router = require("express").Router();
const Transaction = require("../models/Transaction");
const { transactionSchema } = require("./transactions.validation");
const { isAuthenticated } = require("../middleware");

// Make sure that all routes that follow below this statement, require authentication
router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const { q, limit, page } = req.query;

    let limitFilter = 0;
    if (limit) limitFilter = Number(limit);

    let findQuery = { user_id: req.user._id };
    if (q) findQuery["$text"] = { $search: q };

    let skipFilter = 0;
    if (page) skipFilter = (Number(page) - 1) * limitFilter;

    const count = await Transaction.countDocuments();
    const transactions = await Transaction.find(findQuery)
      .skip(skipFilter)
      .limit(limitFilter);

    res.send({ transactions, count });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/stats", async (req, res) => {
  const findAllMoney = await Transaction.find({ user_id: req.user._id });
  res.send(findAllMoney);
});

router.get("/:transactionId", async (req, res) => {
  try {
    console.log(req.params.transactionId);
    const transaction = await Transaction.findOne({
      _id: req.params.transactionId,
      user_id: req.user._id,
    });
    res.send(transaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      companyName,
      transactionAmount,
      transactionDate,
      transactionNumber,
      transactionType,
      transactionPaymentType,
    } = await transactionSchema.validateAsync(req.body);

    const newTransaction = await Transaction.create({
      date: transactionDate,
      description: companyName,
      transaction_number: transactionNumber,
      amount: transactionAmount,
      type: transactionType,
      payment: transactionPaymentType,
      user_id: req.user._id,
    });

    res.send(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    const {
      companyName,
      transactionAmount,
      transactionDate,
      transactionNumber,
      transactionType,
      transactionPaymentType,
    } = req.body;

    if (transactionAmount < 100) throw Error("Amount is too low!");

    await Transaction.findOneAndUpdate(
      {
        _id: req.params.transactionId,
        user_id: req.user._id,
      },
      {
        date: transactionDate,
        description: companyName,
        transaction_number: transactionNumber,
        amount: transactionAmount,
        type: transactionType,
        payment: transactionPaymentType,
      }
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:transactionId", async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.transactionId,
      user_id: req.user._id,
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
