/* Help Desk Intake – localStorage ticket tracker */
const STORAGE_KEY = "hd:tickets:v1";

const form = document.getElementById("ticketForm");
const tableBody = document.querySelector("#ticketTable tbody");
const exportCsvBtn = document.getElementById("exportCsvBtn");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const descriptionInput = document.getElementById("description");

function nowLocalString() {
  return new Date().toLocaleString();
}

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function validateTicket(ticket) {
  if (!ticket.name.trim()) return "Name is required.";
  if (!ticket.email.trim()) return "Email is required.";
  // simple, pragmatic email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticket.email)) return "Email looks invalid.";
  if (!ticket.category) return "Category is required.";
  if (!ticket.priority) return "Priority is required.";
  if (!ticket.description.trim()) return "Description is required.";
  return "";
}

function escapeCsv(value) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function renderTickets() {
  const tickets = loadTickets();
  tableBody.replaceChildren();

  for (const ticket of tickets) {
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
    priorityCell.className = `priority-${String(ticket.priority || "").toLowerCase()}`;

    const statusCell = document.createElement("td");
    statusCell.textContent = ticket.status;

    const actionCell = document.createElement("td");
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle-status";
    toggleBtn.textContent = ticket.status === "Closed" ? "Reopen" : "Close";
    actionCell.append(toggleBtn);

    row.append(dateCell, nameCell, categoryCell, priorityCell, statusCell, actionCell);
    tableBody.append(row);
  }
}

function toggleTicketStatus(id) {
  const tickets = loadTickets();
  const next = tickets.map((t) => {
    if (String(t.id) !== String(id)) return t;
    return { ...t, status: t.status === "Closed" ? "Open" : "Closed" };
  });
  saveTickets(next);
}

function exportCSV() {
  const tickets = loadTickets();
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

  // BOM helps Excel open UTF-8 CSV correctly.
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tickets-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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
    // minimal UX: keep this as an alert to avoid adding new UI complexity
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
  if (btn.dataset.action !== "toggle-status") return;

  const tr = btn.closest("tr");
  const id = tr?.dataset.id;
  if (!id) return;

  toggleTicketStatus(id);
  renderTickets();
});

exportCsvBtn.addEventListener("click", exportCSV);

renderTickets();
