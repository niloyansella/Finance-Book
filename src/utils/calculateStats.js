/**
 * Function for calculating transaction stats
 * @param {Transaction[]} transactions
 * @returns revenue, purchase, profitLoss as number
 */

const calculateStats = (transactions) => {
  let revenue = 0;
  let purchase = 0;
  let profitloss = 0;
  let cash = 0;
  let pin = 0;
  let salary = 0;
  console.log(pin, cash, salary);

  transactions.forEach((calc) => {
    if (calc.type === "Income") {
      revenue += calc.amount;
    } else if (calc.type === "Purchase") {
      purchase += calc.amount;
    }

    if (calc.payment === "Pin") {
      pin += calc.amount;
    }

    if (calc.payment === "Cash") {
      cash += calc.amount;
    }

    if (calc.type === "Salary") {
      salary += calc.amount;
    }
  });

  profitloss = revenue - purchase - salary;
  let res = Math.round(profitloss * 1000) / 1000;

  return { profitLoss: res, revenue, purchase, cash, pin, salary };
};

module.exports = calculateStats;
