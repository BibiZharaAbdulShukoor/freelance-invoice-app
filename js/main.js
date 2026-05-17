function navigateTo(page) {
  // Let's define Store current page in sessionStorage
  sessionStorage.setItem("currentPage", page);

  // Let's define Update active nav item
  document.querySelectorAll(".sidebar-items").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href") === page) {
      item.classList.add("active");
    }
  });

  // Let's define Load the appropriate page
  switch (page) {
    case "dashboard":
      loadDashboard();
      break;
    case "clients":
      loadClientsPage();
      break;
    case "invoices":
      loadInvoicesPage();
      break;
    default:
      loadDashboard();
  }
}

/**
 * Let's define Initialize navigation on page load
 */
function initializeNavigation() {
  const navItems = document.querySelectorAll(".sidebar-items");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      navigateTo(page);
    });
  });

  // Let's define Load dashboard by default
  navigateTo("dashboard");
}

/**
 * Let's define Setup modal close buttons
 */
function setupModalCloseButtons() {
  document.querySelectorAll(".modal-closes").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal1");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Let's define Close modal when clicking outside
  document.querySelectorAll(".modal1").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

/**
 * Let's define Load dashboard page
 */
function loadDashboard() {
  const content = document.getElementById("main-content");
  if (!content) return;

  const allClients = getAllClients();
  const allInvoices = getAllInvoices();

  const totalRevenue = calculateTotalRevenue(allInvoices);
  const paidRevenue = calculatePaidRevenue(allInvoices);
  const unpaidRevenue = calculateUnpaidRevenue(allInvoices);
  const paidCount = countPaidInvoices(allInvoices);
  const unpaidCount = countUnpaidInvoices(allInvoices);

  const collectionRate =
    allInvoices.length === 0
      ? 0
      : Math.round((paidCount / allInvoices.length) * 100);

  content.innerHTML = `
    <div class="containers">
      <div class="mb-8">
        <h1>Dashboard</h1>
        <p class="texts-muted">A general review of your business metrics and performance</p>
      </div>
      
      <div class="grids grid-cols-3 mb-8">
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Total Clients</div>
            <div class="metric-values">${allClients.length}</div>
          </div>
          <div class="metric-icons">👥</div>
        </div>
        
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Total Invoices</div>
            <div class="metric-values">${allInvoices.length}</div>
          </div>
          <div class="metric-icons">📄</div>
        </div>
        
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Total Revenue</div>
            <div class="metric-values currency">${formatCurrency(totalRevenue)}</div>
          </div>
          <div class="metric-icons">💰</div>
        </div>
        
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Paid Revenue</div>
            <div class="metric-values currency" style="color: var(--success);">${formatCurrency(paidRevenue)}</div>
            <div class="text-sm1 text-muted">${paidCount} invoice${paidCount !== 1 ? "s" : ""}</div>
          </div>
          <div class="metric-icons">✓</div>
        </div>
        
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Unpaid Revenue</div>
            <div class="metric-values currency" style="color: var(--warning);">${formatCurrency(unpaidRevenue)}</div>
            <div class="text-sm1 text-muted">${unpaidCount} invoice${unpaidCount !== 1 ? "s" : ""}</div>
          </div>
          <div class="metric-icons">⚠</div>
        </div>
        
        <div class="metric-cards">
          <div>
            <div class="metric-labels">Collection Rate</div>
            <div class="metric-values">${collectionRate}%</div>
            <div class="text-sm1 text-muted">${paidCount} of ${allInvoices.length} invoices paid</div>
          </div>
          <div class="metric-icons">📊</div>
        </div>
      </div>
      
      <div id="quote-section" class="quote-cards">
        <div class="spinners" style="margin: 0 auto;"></div>
        <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">Loading motivational quote...</p>
      </div>
      
      <div class="cards mt-6">
        <h2 class="mb-4">Summary</h2>
        <div class="card-body1">
          <p>You have <strong>${allClients.length}</strong> client${allClients.length !== 1 ? "s" : ""} and <strong>${allInvoices.length}</strong> invoice${allInvoices.length !== 1 ? "s" : ""} in your system.</p>
          <p>Your total revenue is <strong class="currency">${formatCurrency(totalRevenue)}</strong>, with <strong class="currency" style="color: var(--success);">${formatCurrency(paidRevenue)}</strong> paid and <strong class="currency" style="color: var(--warning);">${formatCurrency(unpaidRevenue)}</strong> awaiting payment.</p>
          <p>Your collection rate is <strong>${collectionRate}%</strong>. Keep up the great work!</p>
        </div>
      </div>
    </div>
  `;

  // Load quote
  loadQuote();
}

/**
 * Let's define Load motivational quote
 */
async function loadQuote() {
  const quoteSection = document.getElementById("quote-section");
  if (!quoteSection) return;

  const quote = await fetchMotivationalQuote();
  quoteSection.innerHTML = `
    <div>
      <p class="quote-texts">"${quote.text}"</p>
      <p class="quote-authors">— ${quote.author}</p>
    </div>
  `;
}

/**
 * Let's define Load clients page
 */
function loadClientsPage() {
  const content = document.getElementById("main-content");
  if (!content) return;

  const allClients = getAllClients();

  let clientsHTML = `
    <div class="containers">
      <div class="flx justify-between items-center mb-8">
        <div>
          <h1>Clients</h1>
          <p class="text-muted">Administer your client information and details</p>
        </div>
        <button class="button btn-primary" onclick="openModal('client-modal')">
          ➕ Add Client
        </button>
      </div>
  `;

  if (allClients.length === 0) {
    clientsHTML += `
      <div class="cards text-center p-8">
        <p class="text-muted mb-4">No clients yet. Please add your first client to get onset.</p>
        <button class="button btn-primary" onclick="openModal('client-modal')">
          ➕ Add First Client
        </button>
      </div>
    `;
  } else {
    clientsHTML += `
      <div class="grids grid-cols-3">
    `;

    allClients.forEach((client) => {
      clientsHTML += `
        <div class="cards">
          <h3>${client.name}</h3>
          <p class="text-sm1 text-muted">${client.email}</p>
          ${client.company ? `<p class="text-sm1"><strong>Company:</strong> ${client.company}</p>` : ""}
          ${client.notes ? `<p class="text-sm1 text-muted">${client.notes}</p>` : ""}
          <div class="card-footers">
            <button class="button btn-secondary btn-sm flex-1" onclick="editClient(${client.id})">
              ✏️ Edit
            </button>
            <button class="button btn-danger btn-sm flex-1" onclick="deleteClientAction(${client.id})">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    });

    clientsHTML += `</div>`;
  }

  clientsHTML += `</div>`;
  content.innerHTML = clientsHTML;
}

/**
 * Let's define Load invoices page
 */
function loadInvoicesPage() {
  const content = document.getElementById("main-content");
  if (!content) return;

  const allInvoices = getAllInvoices();
  const allClients = getAllClients();

  let invoicesHTML = `
    <div class="containers">
      <div class="flx justify-between items-center mb-8">
        <div>
          <h1>Invoices</h1>
          <p class="text-muted">Create and manage your invoices</p>
        </div>
        <button class="button btn-primary" onclick="openModal('invoice-modal')">
          ➕ Create Invoice
        </button>
      </div>
  `;

  if (allInvoices.length === 0) {
    invoicesHTML += `
      <div class="cards text-center p-8">
        <p class="text-muted mb-4">No invoices yet. Provide your first invoice to get onset.</p>
        <button class="button btn-primary" onclick="openModal('invoice-modal')">
          ➕ Create First Invoice
        </button>
      </div>
    `;
  } else {
    invoicesHTML += `
      <div class="cards">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    allInvoices.forEach((invoice) => {
      const clientName = getClientName(invoice.clientId, allClients);
      const statusBadge = invoice.paid
        ? '<span class="badges badge-success1">✓ Paid</span>'
        : '<span class="badges badge-warning1">⚠ Unpaid</span>';

      invoicesHTML += `
        <tr>
          <td>${clientName}</td>
          <td>${invoice.serviceTitle}</td>
          <td class="currency">${formatCurrency(invoice.amount)}</td>
          <td>${formatDate(invoice.date)}</td>
          <td>
            <button onclick="toggleInvoiceStatus(${invoice.id})" style="background: none; border: none; cursor: pointer;">
              ${statusBadge}
            </button>
          </td>
          <td>
            <button class="button btn-secondary btn-sm" onclick="editInvoice(${invoice.id})">
              ✏️ Edit
            </button>
            <button class="button btn-danger btn-sm" onclick="deleteInvoiceAction(${invoice.id})">
              🗑️ Delete
            </button>
          </td>
        </tr>
      `;
    });

    invoicesHTML += `
          </tbody>
        </table>
      </div>
    `;
  }

  invoicesHTML += `</div>`;
  content.innerHTML = invoicesHTML;
}

/**
 * Let's define Initialize main app
 */
function initializeApp() {
  initializeNavigation();
  setupModalCloseButtons();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeApp);
