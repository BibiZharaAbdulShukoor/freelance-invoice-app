// Let's define the initialize data from localStorage
let clients = getFromStorage("clients", []);
let invoices = getFromStorage("invoices", []);

/**
 * Let's define to add a new client
 */
function addClient(clientData) {
  const newClient = {
    id: generateUniqueId(),
    ...clientData,
  };
  clients.push(newClient);
  saveToStorage("clients", clients);
  return newClient;
}

/**
 * Let's define to update an existing client
 */
function updateClient(clientId, updates) {
  const index = clients.findIndex((c) => c.id === clientId);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates };
    saveToStorage("clients", clients);
    return clients[index];
  }
  return null;
}

/**
 * Let's define to delete a client
 */
function deleteClient(clientId) {
  const index = clients.findIndex((c) => c.id === clientId);
  if (index !== -1) {
    clients.splice(index, 1);
    saveToStorage("clients", clients);
    return true;
  }
  return false;
}

/**
 * Let's define to get all clients
 */
function getAllClients() {
  return clients;
}

/**
 * Let's define to get client by ID
 */
function getClientById(clientId) {
  return clients.find((c) => c.id === clientId);
}

/**
 * Let's define to add a new invoice
 */
function addInvoice(invoiceData) {
  const newInvoice = {
    id: generateUniqueId(),
    paid: false,
    ...invoiceData,
  };
  invoices.push(newInvoice);
  saveToStorage("invoices", invoices);
  return newInvoice;
}

/**
 * Let's define to update an existing invoice
 */
function updateInvoice(invoiceId, updates) {
  const index = invoices.findIndex((i) => i.id === invoiceId);
  if (index !== -1) {
    invoices[index] = { ...invoices[index], ...updates };
    saveToStorage("invoices", invoices);
    return invoices[index];
  }
  return null;
}

/**
 * Let's define to delete an invoice
 */
function deleteInvoice(invoiceId) {
  const index = invoices.findIndex((i) => i.id === invoiceId);
  if (index !== -1) {
    invoices.splice(index, 1);
    saveToStorage("invoices", invoices);
    return true;
  }
  return false;
}

/**
 * Let's define to toggle invoice paid status
 */
function toggleInvoicePaidStatus(invoiceId) {
  const invoice = invoices.find((i) => i.id === invoiceId);
  if (invoice) {
    invoice.paid = !invoice.paid;
    saveToStorage("invoices", invoices);
    return invoice;
  }
  return null;
}

/**
 * Let's define to get all invoices
 */
function getAllInvoices() {
  return invoices;
}

/**
 * Let's define to get invoice by ID
 */
function getInvoiceById(invoiceId) {
  return invoices.find((i) => i.id === invoiceId);
}

/**
 * Let's define to get invoices by client ID
 */
function getInvoicesByClientId(clientId) {
  return invoices.filter((i) => i.clientId === clientId);
}

/**
 * Let's define to initialize data from API on first load
 */
async function initializeData() {
  //Let's define to load initial clients from Random User API if empty
  if (clients.length === 0) {
    const initialClients = await fetchInitialClients();
    if (initialClients.length > 0) {
      clients = initialClients;
      saveToStorage("clients", clients);
    }
  }
}

// Call initialization on page load
document.addEventListener("DOMContentLoaded", initializeData);
