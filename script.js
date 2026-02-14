/* Help Desk Intake – localStorage ticket tracker */
const STORAGE_KEY = "hd:tickets:v1";
const THEME_KEY = "hd:theme";

const form = document.getElementById("ticket-form");
const tableBody = document.querySelector("#ticket-table tbody");
const exportCsvBtn = document.getElementById("export-csv-btn");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");
const filterPriority = document.getElementById("filter-priority");
const ticketCountEl = document.getElementById("ticket-count");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const descriptionInput = document.getElementById("description");

/* --- Theme --- */

function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "Light Mode";
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, "light");
    themeToggle.textContent = "Dark Mode";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem(THEME_KEY, "dark");
    themeToggle.textContent = "Light Mode";
  }
}

/* --- Helpers --- */

function nowLocalString() {
  return new Date().toLocaleString();
}

/* --- Storage --- */

function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTickets(list) {
  try {
    const data = JSON.stringify(list);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      alert("Storage limit reached. Please export your tickets and clear old data.");
    }
  }
}

/* --- Validation --- */

function validateTicket(ticket) {
  if (!ticket.name.trim()) return "Name is required.";
  if (!ticket.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticket.email)) return "Email looks invalid.";
  if (!ticket.category) return "Category is required.";
  if (!ticket.priority) return "Priority is required.";
  if (!ticket.description.trim()) return "Description is required.";
  return "";
}

/* --- Filtering --- */

function getFilteredTickets() {
  const tickets = loadTickets();
  const query = searchInput.value.toLowerCase().trim();
  const statusFilter = filterStatus.value;
  const priorityFilter = filterPriority.value;

  return tickets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (query) {
      const searchable = [t.name, t.email, t.category, t.description, t.date]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

/* --- Rendering --- */

function renderTickets() {
  const allTickets = loadTickets();
  const filtered = getFilteredTickets();
  const fragment = document.createDocumentFragment();

  if (filtered.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 6;
    emptyCell.className = "empty-state";

    const msg = document.createElement("p");
    msg.textContent = allTickets.length === 0
      ? "No tickets yet. Submit one above to get started."
      : "No tickets match your filters.";
    emptyCell.append(msg);
    emptyRow.append(emptyCell);
    fragment.append(emptyRow);
  }

  for (const ticket of filtered) {
    const row = document.createElement("tr");
    row.dataset.id = String(ticket.id);

    const dateCell = document.createElement("td");
    dateCell.textContent = ticket.date;

    const nameCell = document.createElement("td");
    nameCell.textContent = ticket.name;

    const categoryCell = document.createElement("td");
    categoryCell.textContent = ticket.category;

    const priorityCell = document.createElement("td");
    priorityCell.textContent = ticket.priority;
    priorityCell.className = "priority-" + String(ticket.priority || "").toLowerCase();

    const statusCell = document.createElement("td");
    statusCell.textContent = ticket.status;
    statusCell.className = ticket.status === "Closed" ? "status-closed" : "status-open";

    const actionCell = document.createElement("td");

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "btn-toggle";
    toggleBtn.dataset.action = "toggle-status";
    toggleBtn.textContent = ticket.status === "Closed" ? "Reopen" : "Close";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.dataset.action = "delete";
    deleteBtn.textContent = "Delete";

    actionCell.append(toggleBtn, deleteBtn);
    row.append(dateCell, nameCell, categoryCell, priorityCell, statusCell, actionCell);
    fragment.append(row);
  }

  tableBody.replaceChildren(fragment);
  updateTicketCount(allTickets.length, filtered.length);
}

function updateTicketCount(total, shown) {
  if (total === 0) {
    ticketCountEl.textContent = "";
    return;
  }
  if (shown === total) {
    ticketCountEl.textContent = total + " ticket" + (total === 1 ? "" : "s");
  } else {
    ticketCountEl.textContent = "Showing " + shown + " of " + total + " tickets";
  }
}

/* --- Actions --- */

function toggleTicketStatus(id) {
  const tickets = loadTickets();
  const index = tickets.findIndex((t) => String(t.id) === String(id));
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      status: tickets[index].status === "Closed" ? "Open" : "Closed"
    };
    saveTickets(tickets);
  }
}

function deleteTicket(id) {
  const tickets = loadTickets();
  const index = tickets.findIndex((t) => String(t.id) === String(id));
  if (index === -1) return;

  const ok = confirm("Delete this ticket from " + tickets[index].name + "?");
  if (!ok) return;

  tickets.splice(index, 1);
  saveTickets(tickets);
  renderTickets();
}

/* --- CSV Export --- */

function escapeCsv(value) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? "\"" + s.replace(/"/g, "\"\"") + "\"" : s;
}

function exportCSV() {
  const tickets = loadTickets();
  if (tickets.length === 0) {
    alert("No tickets to export.");
    return;
  }

  const headers = ["Date", "Name", "Email", "Category", "Priority", "Status", "Description"];
  const lines = [headers.join(",")];

  for (const t of tickets) {
    lines.push(
      [
        escapeCsv(t.date),
        escapeCsv(t.name),
        escapeCsv(t.email),
        escapeCsv(t.category),
        escapeCsv(t.priority),
        escapeCsv(t.status),
        escapeCsv(t.description)
      ].join(",")
    );
  }

  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tickets-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* --- Event Listeners --- */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const ticket = {
    id: Date.now(),
    date: nowLocalString(),
    name: nameInput.value,
    email: emailInput.value,
    category: categoryInput.value,
    priority: priorityInput.value,
    description: descriptionInput.value,
    status: "Open"
  };

  const error = validateTicket(ticket);
  if (error) {
    alert(error);
    return;
  }

  const tickets = loadTickets();
  tickets.push(ticket);
  saveTickets(tickets);

  form.reset();
  nameInput.focus();
  renderTickets();
});

tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const tr = btn.closest("tr");
  const id = tr?.dataset.id;
  if (!id) return;

  if (btn.dataset.action === "toggle-status") {
    toggleTicketStatus(id);
    renderTickets();
  } else if (btn.dataset.action === "delete") {
    deleteTicket(id);
  }
});

searchInput.addEventListener("input", renderTickets);
filterStatus.addEventListener("change", renderTickets);
filterPriority.addEventListener("change", renderTickets);
exportCsvBtn.addEventListener("click", exportCSV);
themeToggle.addEventListener("click", toggleTheme);

/* --- Init --- */

applySavedTheme();
renderTickets();
