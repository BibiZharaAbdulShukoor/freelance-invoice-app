/**
 * Let's define the safely retrieve data from localStorage with JSON parsing
 */
function getFromStorage(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Let's define the safely store data to localStorage with JSON stringification
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Fetch initial clients from Random User API
 * Returns array of 5 client profiles with name, email, and placeholder company
 */
async function fetchInitialClients() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=5&nat=us");
    if (!response.ok) throw new Error("Failed to fetch clients");

    const data = await response.json();
    return data.results.map((user) => ({
      id: Date.now() + Math.random(),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      company: "Freelance Inc.",
      notes: "",
    }));
  } catch (error) {
    console.error("Error fetching initial clients:", error);
    return [];
  }
}

/**
 * Let's define the Fetch motivational quote from ZenQuotes API
 * Returns object with text and author
 */
async function fetchMotivationalQuote() {
  try {
    const response = await fetch("https://zenquotes.io/api/quotes");
    if (!response.ok) throw new Error("Failed to fetch quote");

    const data = await response.json();
    const randomQuote = data[Math.floor(Math.random() * data.length)];
    return {
      text: randomQuote.q,
      author: randomQuote.a?.replace(/,\s*$/, "") || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return {
      text: "The only way to do great work is to love what you doYou don't need millions of dollars or millions of people if you're doing what you love.",
      author: "Felicia Day",
    };
  }
}

/**
 * Let's define the validate email format using regex
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Let's define the validate that required fields are not empty
 */
function validateRequiredFields(fields) {
  const errors = [];
  Object.entries(fields).forEach(([key, value]) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors.push(`${key} is required`);
    }
  });
  return errors;
}

/**
 * Let's define the validate numeric amount (positive number)
 */
function isValidAmount(amount) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
}

/**
 * Let's define the format currency to USD with 2 decimal places
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Let's define the format date to readable format (e.g., "May 12, 2026")
 */
function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Let's define the format date to input format (YYYY-MM-DD)
 */
function formatDateForInput(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Let's define the calculate total revenue from invoices using reduce()
 */
function calculateTotalRevenue(invoices) {
  return invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
}

/**
 * Let's define the calculate paid revenue from invoices using reduce() and filter()
 */
function calculatePaidRevenue(invoices) {
  return invoices
    .filter((invoice) => invoice.paid)
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
}

/**
 * Let's define the calculate unpaid revenue from invoices using reduce() and filter()
 */
function calculateUnpaidRevenue(invoices) {
  return invoices
    .filter((invoice) => !invoice.paid)
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
}

/**
 * Let's define the count paid invoices using filter()
 */
function countPaidInvoices(invoices) {
  return invoices.filter((invoice) => invoice.paid).length;
}

/**
 * Let's define the count unpaid invoices using filter()
 */
function countUnpaidInvoices(invoices) {
  return invoices.filter((invoice) => !invoice.paid).length;
}

/**
 * Let's define the generate unique ID using timestamp and random number
 */
function generateUniqueId() {
  return Date.now() + Math.random();
}

/**
 * Let's define the show toast notification
 */
function showToast(message, type = "success") {
  const container =
    document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Let's define to create toast container if it doesn't exist
 */
function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

/**
 * Let's define to get client name by ID
 */
function getClientName(clientId, clients) {
  const client = clients.find((c) => c.id === clientId);
  return client ? client.name : "Unknown Client";
}

/**
 * Let's define to clear all form inputs
 */
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
}

/**
 * Let's define the close modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

/**
 * Let's define the open modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

/**
 * Let's define the format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
