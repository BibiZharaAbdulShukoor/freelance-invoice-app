let editingInvoiceId = null;

/**
 * Let's define handle invoice form submission
 */
function handleInvoiceSubmit(e) {
  e.preventDefault();

  const clientId = parseFloat(document.getElementById("invoice-client").value);
  const serviceTitle = document.getElementById("invoice-service").value.trim();
  const description = document
    .getElementById("invoice-description")
    .value.trim();
  const amount = parseFloat(document.getElementById("invoice-amount").value);
  const date = document.getElementById("invoice-date").value;

  // Let's define the Validation part
  if (!clientId || clientId === 0) {
    showToast("Please select a client", "error");
    return;
  }

  if (!serviceTitle) {
    showToast("Service title is required", "error");
    return;
  }

  if (!isValidAmount(amount)) {
    showToast("Please enter a valid amount (greater than 0)", "error");
    return;
  }

  if (!date) {
    showToast("Date is required", "error");
    return;
  }

  if (editingInvoiceId) {
    // Let's define to update existing invoice
    updateInvoice(editingInvoiceId, {
      clientId,
      serviceTitle,
      description,
      amount,
      date,
    });
    showToast("Invoice updated successfully", "success");
  } else {
    // Let's define to add new invoice
    addInvoice({
      clientId,
      serviceTitle,
      description,
      amount,
      date,
    });
    showToast("Invoice created successfully", "success");
  }

  closeModal("invoice-modal");
  clearForm("invoice-form");
  editingInvoiceId = null;
  loadInvoicesPage();
}

/**
 * Let's define the populate client dropdown
 */
function populateClientDropdown() {
  const select = document.getElementById("invoice-client");
  if (!select) return;

  const allClients = getAllClients();

  // Let's define the clear existing options except the placeholder
  select.innerHTML = '<option value="">-- Select a Client --</option>';

  allClients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}

/**
 * Let's define the open invoice form for editing
 */
function editInvoice(invoiceId) {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) return;

  editingInvoiceId = invoiceId;
  document.getElementById("invoice-modal-title").textContent = "Edit Invoice";
  document.getElementById("invoice-client").value = invoice.clientId;
  document.getElementById("invoice-service").value = invoice.serviceTitle;
  document.getElementById("invoice-description").value = invoice.description;
  document.getElementById("invoice-amount").value = invoice.amount;
  document.getElementById("invoice-date").value = invoice.date;

  openModal("invoice-modal");
}

/**
 * Let's define to delete invoice with confirmation
 */
function deleteInvoiceAction(invoiceId) {
  if (confirm("Are you sure you want to delete this invoice?")) {
    deleteInvoice(invoiceId);
    showToast("Invoice deleted successfully", "success");
    loadInvoicesPage();
  }
}

/**
 * Let's define the toggle invoice paid status
 */
function toggleInvoiceStatus(invoiceId) {
  toggleInvoicePaidStatus(invoiceId);
  showToast("Invoice status updated", "success");
  loadInvoicesPage();
}

/**
 * Let's define the reset invoice form
 */
function resetInvoiceForm() {
  editingInvoiceId = null;
  document.getElementById("invoice-modal-title").textContent = "Create Invoice";
  clearForm("invoice-form");
  populateClientDropdown();
  document.getElementById("invoice-date").valueAsDate = new Date();
}

/**
 * Let's define the setup invoice form event listeners
 */
function setupInvoiceFormListeners() {
  const form = document.getElementById("invoice-form");
  if (form) {
    form.addEventListener("submit", handleInvoiceSubmit);
  }

  // Let's define the populate dropdown when modal is opened
  const modal = document.getElementById("invoice-modal");
  if (modal) {
    // Let's define to utilize a MutationObserver to detect when modal becomes active
    const observer = new MutationObserver(() => {
      if (modal.classList.contains("active")) {
        populateClientDropdown();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ["class"] });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", setupInvoiceFormListeners);
