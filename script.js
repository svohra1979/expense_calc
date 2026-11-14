// select elements
const addBtn = document.getElementById("addBtn");
const descInput = document.getElementById("descInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const errorMsg = document.getElementById("errorMsg");
const expenseList = document.getElementById("expenseList");
const filterSection = document.getElementById("filterSection");
const monthInput = document.getElementById("monthInput");
// state: expenses array, current filter
let expenses = [];
let currentCategory = "all";
// load / save (localStorage)
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
function loadExpenses() {
  const savedExpenses = localStorage.getItem("expenses");
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }
}
// add expense (validate first)
addBtn.addEventListener("click", () => {
  let description = descInput.value.trim();
  let amount = parseFloat(amountInput.value);
  let category = categoryInput.value;
  let date = dateInput.value;
  if (description && !isNaN(amount) && date) {
    const expense = { description, amount, category, date, id: Date.now() };
    expenses.push(expense);
    saveExpenses();
    render();
    descInput.value = "";
    amountInput.value = "";
    categoryInput.selectedIndex = 0;
    dateInput.value = "";
    errorMsg.textContent = "";
  } else {
    errorMsg.textContent = "Please fill in all fields correctly.";
  }
});

// render summary (list = the filtered expenses currently on screen)
function renderSummary(list) {
  const total = list.reduce((sum, e) => sum + e.amount, 0);
  const count = list.length;

  // totals per category, e.g. { food: 450, travel: 1200 }
  const totals = {};
  for (const e of list) {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  }

  // find the key with the highest total
  let topCategory = "-";
  let topAmount = -Infinity;
  for (const category in totals) {
    if (totals[category] > topAmount) {
      topAmount = totals[category];
      topCategory = category;
    }
  }

  document.getElementById("totalSpent").textContent = `$${total.toFixed(2)}`;
  document.getElementById("expenseCount").textContent = count;
  document.getElementById("topCategory").textContent = topCategory;
}

// render list
function render() {
  expenseList.innerHTML = "";
  const selectedMonth = monthInput.value; // "2026-11", or "" for all months
  const filtered = expenses
    .filter((e) => currentCategory === "all" || e.category === currentCategory)
    .filter((e) => !selectedMonth || e.date.startsWith(selectedMonth));
  renderSummary(filtered);
  filtered.forEach((expense) => {
    expenseList.innerHTML += `
            <div class="expense-item">
                <span>${expense.description}</span>
                <span>$${expense.amount.toFixed(2)}</span>
                <span>${expense.category}</span>
                <span>${expense.date}</span>
                <button class="deleteBtn" data-id="${expense.id}">Delete</button>
            </div>
        `;
  });
}
// delete expense (confirm)
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const id = Number(e.target.dataset.id); // dataset values are strings
    if (confirm("Delete this expense?")) {
      expenses = expenses.filter((exp) => exp.id !== id);
      saveExpenses();
      render();
    }
  }
});

// filter button listeners
const filterButtons = filterSection.querySelectorAll("button");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    render();
  });
});

monthInput.addEventListener("change", render);

// initialize
loadExpenses();
render();
