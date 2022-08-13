"use strict";

let images = ["images/icons8-edit-48.png", "images/icons8-delete-24.png"];
//Dit is de HamburgerMenu die je kan clicken
const hbMenu = document.getElementById("menu");
//Hier opent de Hamburger Menu met de Modal
const hbMenuOpen = document.getElementById("hb-menu-open");
//Hierin opent een lijst met de navigatie naar verschillende paginas
const hbModalMenuList = document.getElementById("sidebar-menulist");
const modalBG = document.getElementById("modal--menu");

//Dit is een button waarbij je administratie modal opent
const addTransactionBtn = document.getElementById("add-transaction");
//Hier gaat de Modal van de invulvelden open
const addTransactionModal = document.getElementById("add-trans");
//Deze knop sluit de modal met de invulvelden
const addTransactionModalClose = document.getElementById(
  "close-trans-modal-btn"
);

const headingTransModal = document.getElementById("heading-modal");

const editTransactionBtn = document.getElementById("edit-btn");
//Hiermee stuur je alle invulvelden met een waarde naar de server.
const submitTransactionBtn = document.getElementById("submit-btn");

let revenueCalculation = document.getElementById("revenue");
let cashPayments = document.getElementById("cash");
let pinPayments = document.getElementById("pin");
let salaryPayments = document.getElementById("salary");
let purchaseCalculation = document.getElementById("purchaseCalc");
let profitLoss = document.getElementById("profitLoss");
const profitLosStyle = document.querySelector(".profitLosStyle");

const logOutBtn = document.getElementById("logout");

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/* Login / SignUp Form and Http request to server. */
///////////////////////////////////////////////////////////////////////
///// SignUP

// signUpBtn.addEventListener("click", getSignUpDetails);
//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// SET LIMIT SELECT BASED ON SEARCH QUERY VALUE
const params = new URLSearchParams(window.location.search);
params.forEach((value, key) => {
  if (key === "limit") {
    (document.getElementById(`limit-${value}`) || {}).selected = "selected";
  }
});

const renderPaginationButtons = (count) => {
  const limit = Number(document.getElementById("page").value);
  const numButtons = Math.ceil(count / limit);

  let buttonHTML = "";
  for (let i = 0; i < numButtons; i++) {
    buttonHTML += `<button class="page-btn" onclick="setPage(${
      i + 1
    })" value="${i}">${i + 1}</button>`;
  }

  document.getElementById("pagination").innerHTML = buttonHTML;
};

const setPage = (pageNumber) => {
  const params = new URLSearchParams(window.location.search);
  console.log(params);
  const search = [];
  params.forEach((value, key) => {
    if (key === "page") return search.push(`page=${pageNumber}`);
    return search.push(`${key}=${value}`);
  });
  document.location.search = search.join("&");
};

const setLimit = (limit) => {
  const params = new URLSearchParams(window.location.search);
  const search = [];
  params.forEach((value, key) => {
    if (key === "limit") return search.push(`limit=${limit}`);
    if (key === "page") return search.push(`page=1`);
    return search.push(`${key}=${value}`);
  });
  document.location.search = search.join("&");

  console.log(search);
};

const toggleMenuList = () => {
  hbModalMenuList.classList.toggle("menu-toggle");
};

/**
 * Funtion that gets all transaction from the database, according to the specified query filters
 */
const getAllTransactions = async () => {
  try {
    const query = location.search;
    const { transactions, count } = await api("GET", `/transactions${query}`);
    console.log("Got", count, "transactions from the server..");

    // Empty groups for divs from transaction items
    let transactionDates = "";
    let transactionDescriptions = "";
    let transactionNumbers = "";
    let transactionTypes = "";
    let transactionAmountType = "";
    let transactionAmounts = "";
    let transactionEditButtons = "";
    let transactionDeleteButtons = "";

    transactions.forEach((trans) => {
      transactionDates += `<div class="transaction-data-js js-transaction-date">${dayjs(
        trans.date
      ).format("DD MMM YYYY")} </div>`;
      transactionDescriptions += `<div class="transaction-data-js js-transaction-description"> ${trans.description}</div>`;
      transactionNumbers += `<div class="transaction-data-js js-transaction-number">${trans.transaction_number}</div>`;
      transactionTypes += `<div class="transaction-data-js js-transaction-type">${trans.type}</div>`;
      transactionAmountType += `<div class="transaction-data-js js-transaction-type">${trans.payment}</div>`;
      transactionAmounts += `<div class="transaction-data-js js-transaction-amount"> € ${trans.amount},-</div>`;
      transactionEditButtons += `<div class="transaction-data-js js-transaction-edit" onclick="getTransaction(this.id)" id="${trans._id}">
      <img src=${images[0]} alt="edit-trans" class="edit-trans"  style="pointer-events:none" /></div>`;
      transactionDeleteButtons += `<div class="transaction-data-js js-transaction-delete" onclick="deleteTransaction(this.id)" id="${trans._id}">
      <img src=${images[1]} alt="edit-trans" class="edit-trans" style="pointer-events:none"  /></div>`;
    });

    document.getElementById("insertDate").innerHTML = transactionDates;
    document.getElementById("description").innerHTML = transactionDescriptions;
    document.getElementById("transaction-number").innerHTML =
      transactionNumbers;
    document.getElementById("type").innerHTML = transactionTypes;
    document.getElementById("typeAmountTrans").innerHTML =
      transactionAmountType;
    document.getElementById("amountTrans").innerHTML = transactionAmounts;

    document.getElementById("editTrans").innerHTML = transactionEditButtons;
    document.getElementById("deleteTrans").innerHTML = transactionDeleteButtons;

    renderPaginationButtons(count);
  } catch (error) {
    alert(error.response?.data);
    console.log(error.response?.data);
  }
};

/**
 * Function that posts or patches the values of a transaction to the server
 * @param {formSubmitEvent} event the form submit event
 * @param {string} id the transaction id, only required for patching
 */
const setTransaction = async (event, target) => {
  try {
    event.preventDefault(); // Prevent the page from reloading;
    const id = target.getAttribute("rel");

    const formData = new FormData(event.target);
    const formDataAsObject = Object.fromEntries(formData.entries());
    console.log(formDataAsObject);

    await api(
      id ? "PATCH" : "POST",
      `/transactions${id ? `/${id}` : ""}`,
      formDataAsObject
    );

    window.location.reload();
  } catch (err) {
    console.error(err.response?.data);
  }
};

/**
 * This function gets a transaction by an id from the server
 * @param {string} id the id of the transaction to edit
 */
const getTransaction = async (id) => {
  // Make transaction modal visible
  addTransactionModal.classList.toggle("add-trans-visible");

  // Switch input:submit value from submit to edit
  document.getElementById("submitTransaction").value = "Edit";

  // Get the transaction by id
  const transaction = await api("GET", `/transactions/${id}`);

  // Fill the values of the form inputs
  document.getElementById("transactionDate").value = transaction.date;
  document.getElementById("companyName").value = transaction.description;
  document.getElementById("transactionNumber").value =
    transaction.transaction_number;
  document.getElementById("transactionAmount").value = transaction.amount;
  document.getElementById("transactionType").value = transaction.type;
  document.getElementById("transactionPaymentType").value = transaction.payment;

  // Give the form a 'rel' attribute with the transaction id as value
  document.getElementById("transactionForm").setAttribute("rel", id);
};

/**
 * This functions deletes a transactions from the database/server
 * @param {string} id the id of the transaction to delete
 */
const deleteTransaction = async (id) => {
  await api("DELETE", `/transactions/${id}`);
  getAllTransactions();
  window.location.reload();
};

getAllTransactions();

const logOut = async () => {
  try {
    await api("POST", `/auth/logout`);
    window.location.replace("/");
  } catch (error) {
    alert(error.message);
  }
};

// hbMenu.addEventListener("click", () => {
//   console.log("Menu Open");
//   hbMenuOpen.classList.toggle("sidebar--toggle");
//   modalBG.classList.toggle("modal-menu");
//   toggleMenuList();
// });

// Open transaction modal
addTransactionBtn.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
});

// Close tranasction modal and refresh
addTransactionModalClose.addEventListener("click", () => {
  addTransactionModal.classList.toggle("add-trans-visible");
  window.location.reload();
});

// deleteTrans.addEventListener("click", (e) => {
//   console.log(e.target.id);
//   const deleteTrans = new XMLHttpRequest();
//   deleteTrans.open(
//     "delete",
//     `http://localhost:7000/transactions/${e.target.id}`,
//     false
//   );
//   deleteTrans.send();
//   window.location.reload();
// });

// editTrans.addEventListener("click", (e) => {
//   console.log(e.target.id);
//   addTransactionModal.classList.toggle("add-trans-visible");
//   editTransactionBtn.style.display = "block";
//   submitTransactionBtn.style.display = "none";
//   headingTransModal.innerText = "Edit Transaction";

//   const editingTrans = new XMLHttpRequest();
//   editingTrans.open(
//     "get",
//     `http://localhost:7000/transactions/${e.target.id}`,
//     false
//   );
//   editingTrans.send();
//   const response = JSON.parse(editingTrans.response);
//   console.log(response);

//   inputDate.value = response.date;
//   inputCompanyName.value = response.description;
//   inputTransNumber.value = response.transaction_number;
//   inputAmount.value = response.amount;
//   inputTranscationType.value = response.type;

//   editTransactionBtn.setAttribute("rel", response._id);
// });

// editTransactionBtn.addEventListener("click", (e) => {
//   const dates = inputDate.value;
//   const compyNM = inputCompanyName.value;
//   const transNum = inputTransNumber.value;
//   const amount = inputAmount.value;
//   const type = inputTranscationType.value;

//   console.log(dates);

//   console.log(dates);
//   console.log("EDITING NOW.....................");
//   const sendChanges = new XMLHttpRequest();
//   console.log(e.target);
//   sendChanges.open(
//     "PATCH",
//     `http://localhost:7000/transactions/${e.target.getAttribute("rel")}`,
//     false
//   );
//   sendChanges.setRequestHeader("Content-Type", "application/json");

//   sendChanges.send(
//     JSON.stringify({
//       dates: dates,
//       descriptions: compyNM,
//       transaction_numbers: transNum,
//       amounts: amount,
//       types: type,
//     })
//   );
//   addTransactionModal.classList.remove("add-trans-visible");
//   window.location.reload();
// });

// let inputDate = document.getElementById("date");
// let inputCompanyName = document.getElementById("cpName");
// let inputTransNumber = document.getElementById("trans-numb");
// let inputAmount = document.getElementById("amount");
// let inputTranscationType = document.getElementById("transaction-type");

//Deze functie haalt alle waardes op van de invulvelden
// const getInputValues = () => {
//   inputDate = document.getElementById("date").value;
//   inputCompanyName = document.getElementById("cpName").value;
//   inputTransNumber = document.getElementById("trans-numb").value;
//   inputAmount = document.getElementById("amount").value;
//   inputTranscationType = document.getElementById("transaction-type").value;

//   return {
//     inputDate,
//     inputCompanyName,
//     inputTransNumber,
//     inputAmount,
//     inputTranscationType,
//   };
// };

// //Deze Functie neemt alle waardes en stuurt deze naar de server
// const setTransaction = () => {
//   const xmhttpReq = new XMLHttpRequest();
//   xmhttpReq.open("POST", "http://localhost:7000/transactions", false);
//   xmhttpReq.setRequestHeader("Content-Type", "application/json");

//   const values = getInputValues();

//   console.log(values);

//   const {
//     inputDate,
//     inputCompanyName,
//     inputTransNumber,
//     inputAmount,
//     inputTranscationType,
//   } = values;

//   console.log(inputDate);

//   xmhttpReq.send(
//     JSON.stringify({
//       date: inputDate,
//       name: inputCompanyName,
//       transaction_num: inputTransNumber,
//       amount: Number(inputAmount),
//       transcationType: inputTranscationType,
//       image: images[0],
//       deleteImage: images[1],
//     })
//   );
//   window.location.reload();
// };
