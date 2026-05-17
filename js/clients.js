let editingClientId = null;

/**
 * Let's define handle client form submission
 */
function handleClientSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("client-name").value.trim();
  const email = document.getElementById("client-email").value.trim();
  const company = document.getElementById("client-company").value.trim();
  const notes = document.getElementById("client-notes").value.trim();

  // Let's define the Validation part
  if (!name) {
    showToast("Client name is necessary", "error");
    return;
  }

  if (!email) {
    showToast("Email is necessary", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Sorry your email is not a valid email address", "error");
    return;
  }

  if (editingClientId) {
    // Let's define to Update existing client
    updateClient(editingClientId, { name, email, company, notes });
    showToast("Client updated successfully done", "success");
  } else {
    // Let's define to add new client
    addClient({ name, email, company, notes });
    showToast("Client added successfully done", "success");
  }

  closeModal("client-modal");
  clearForm("client-form");
  editingClientId = null;
  loadClientsPage();
}

/**
 * Let's define the open client form for editing
 */
function editClient(clientId) {
  const client = getClientById(clientId);
  if (!client) return;

  editingClientId = clientId;
  document.getElementById("client-modal-title").textContent = "Edit Client";
  document.getElementById("client-name").value = client.name;
  document.getElementById("client-email").value = client.email;
  document.getElementById("client-company").value = client.company;
  document.getElementById("client-notes").value = client.notes;

  openModal("client-modal");
}

/**
 * Let's define the delete client with confirmation
 */
function deleteClientAction(clientId) {
  if (
    confirm("Are you confident you want to delete this client from your list?")
  ) {
    deleteClient(clientId);
    showToast("Client deleted successfully done", "success");
    loadClientsPage();
  }
}

/**
 * Let's define teh reset client form
 */
function resetClientForm() {
  editingClientId = null;
  document.getElementById("client-modal-title").textContent = "Add Client";
  clearForm("client-form");
}

/**
 * Let's define the setup client form event listeners
 */
function setupClientFormListeners() {
  const form = document.getElementById("client-form");
  if (form) {
    form.addEventListener("submit", handleClientSubmit);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", setupClientFormListeners);
