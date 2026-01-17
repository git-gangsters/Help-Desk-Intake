# API Documentation

Complete reference for all JavaScript functions and data structures in the Help Desk Intake application.

## Table of Contents

- [Constants](#constants)
- [Data Structures](#data-structures)
- [Core Functions](#core-functions)
- [Utility Functions](#utility-functions)
- [Event Handlers](#event-handlers)
- [Data Storage](#data-storage)

## Constants

### STORAGE_KEY

```javascript
const STORAGE_KEY = "hd:tickets:v1";
```

**Type:** `string`

**Description:** localStorage key used to persist ticket data. The `v1` suffix allows for future schema migrations.

**Value:** `"hd:tickets:v1"`

## Data Structures

### Ticket Object

Represents a single help desk ticket.

```javascript
{
  id: number,
  date: string,
  name: string,
  email: string,
  category: string,
  priority: "Low" | "Medium" | "High",
  description: string,
  status: "Open" | "Closed"
}
```

**Properties:**

- **id** (`number`): Unique identifier generated using `Date.now()`
- **date** (`string`): Timestamp when ticket was created (locale string format)
- **name** (`string`): Name of person submitting the ticket
- **email** (`string`): Email address of person submitting the ticket
- **category** (`string`): Issue category (Hardware, Software, Network, Access)
- **priority** (`"Low" | "Medium" | "High"`): Priority level of the ticket
- **description** (`string`): Detailed description of the issue
- **status** (`"Open" | "Closed"`): Current status of the ticket

## Core Functions

### nowLocalString()

```javascript
function nowLocalString(): string
```

**Description:** Returns the current date and time as a localized string.

**Parameters:** None

**Returns:** `string` - Current date/time in user's locale format

**Example:**
```javascript
const timestamp = nowLocalString();
// "1/17/2026, 11:07:23 AM"
```

---

### loadTickets()

```javascript
function loadTickets(): Array<Ticket>
```

**Description:** Retrieves all tickets from localStorage. Returns an empty array if no tickets exist or if parsing fails.

**Parameters:** None

**Returns:** `Array<Ticket>` - Array of ticket objects

**Error Handling:** Returns empty array on JSON parse errors

**Example:**
```javascript
const tickets = loadTickets();
console.log(tickets.length); // Number of tickets
```

---

### saveTickets(list)

```javascript
function saveTickets(list: Array<Ticket>): void
```

**Description:** Persists the ticket array to localStorage.

**Parameters:**
- **list** (`Array<Ticket>`): Array of ticket objects to save

**Returns:** `void`

**Side Effects:** Writes to `localStorage[STORAGE_KEY]`

**Example:**
```javascript
const tickets = loadTickets();
tickets.push(newTicket);
saveTickets(tickets);
```

---

### validateTicket(ticket)

```javascript
function validateTicket(ticket: Ticket): string
```

**Description:** Validates ticket data and returns an error message if validation fails.

**Parameters:**
- **ticket** (`Ticket`): Ticket object to validate

**Returns:** `string` - Error message if validation fails, empty string if valid

**Validation Rules:**
- name must not be empty (after trim)
- email must not be empty (after trim)
- email must match pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- category must not be empty
- priority must not be empty
- description must not be empty (after trim)

**Example:**
```javascript
const error = validateTicket(newTicket);
if (error) {
  alert(error);
  return;
}
```

---

### renderTickets()

```javascript
function renderTickets(): void
```

**Description:** Renders all tickets to the dashboard table. Clears existing table content and rebuilds from current ticket data.

**Parameters:** None

**Returns:** `void`

**Side Effects:** 
- Clears `tableBody` innerHTML
- Creates and appends table rows for each ticket
- Attaches data-id attributes for event delegation

**DOM Elements Created:**
- `<tr>` with `data-id` attribute
- `<td>` elements for each ticket field
- `<button>` for status toggle

**Example:**
```javascript
renderTickets(); // Refreshes the ticket table
```

---

### toggleTicketStatus(id)

```javascript
function toggleTicketStatus(id: string | number): void
```

**Description:** Toggles a ticket's status between "Open" and "Closed".

**Parameters:**
- **id** (`string | number`): Unique ID of the ticket to toggle

**Returns:** `void`

**Side Effects:** 
- Updates ticket status in memory
- Persists changes to localStorage

**Logic:**
- "Open" → "Closed"
- "Closed" → "Open"

**Example:**
```javascript
toggleTicketStatus(1705506443123);
```

---

### exportCSV()

```javascript
function exportCSV(): void
```

**Description:** Exports all tickets to a CSV file with UTF-8 BOM for Excel compatibility.

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Creates a Blob with CSV content
- Triggers download in browser
- Revokes object URL after 1 second

**CSV Format:**
- Headers: Date, Name, Email, Category, Priority, Status, Description
- Fields are properly escaped using `escapeCsv()`
- UTF-8 BOM prefix (\ufeff) for Excel compatibility

**Filename:** `tickets-YYYY-MM-DD.csv`

**Example:**
```javascript
exportCSV(); // Downloads tickets-2026-01-17.csv
```

## Utility Functions

### escapeCsv(value)

```javascript
function escapeCsv(value: any): string
```

**Description:** Escapes values for CSV format according to RFC 4180.

**Parameters:**
- **value** (`any`): Value to escape (converted to string)

**Returns:** `string` - Escaped CSV field

**Escaping Rules:**
- Wraps in quotes if contains: comma, quote, newline, or carriage return
- Doubles internal quotes: `"` → `""`
- Handles null/undefined as empty string

**Example:**
```javascript
escapeCsv('Hello "World"'); // "Hello ""World"""
escapeCsv('Name, Title'); // "Name, Title"
escapeCsv('Simple'); // Simple
```

## Event Handlers

### Form Submit Handler

**Element:** `#ticketForm`

**Event:** `submit`

**Behavior:**
1. Prevents default form submission
2. Collects form data into ticket object
3. Validates ticket data
4. Appends to ticket list if valid
5. Saves to localStorage
6. Resets form
7. Sets focus to name input
8. Re-renders ticket table

**Error Handling:** Displays alert if validation fails

---

### Table Click Handler (Event Delegation)

**Element:** `#ticketTable tbody`

**Event:** `click`

**Behavior:**
1. Detects clicks on toggle status buttons
2. Finds parent row's data-id
3. Calls `toggleTicketStatus(id)`
4. Re-renders ticket table

**Event Delegation:** Uses closest() to handle button clicks

---

### Export Button Handler

**Element:** `#exportCsvBtn`

**Event:** `click`

**Behavior:** Calls `exportCSV()` to download tickets

## Data Storage

### localStorage Schema

**Key:** `hd:tickets:v1`

**Format:** JSON string containing array of Ticket objects

**Example:**
```json
[
  {
    "id": 1705506443123,
    "date": "1/17/2026, 11:07:23 AM",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "category": "Hardware",
    "priority": "High",
    "description": "Monitor not working",
    "status": "Open"
  }
]
```

### Storage Operations

**Read:** `JSON.parse(localStorage.getItem(STORAGE_KEY))`

**Write:** `localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))`

**Clear:** `localStorage.removeItem(STORAGE_KEY)`

## Initialization

The application initializes on page load:

```javascript
// Initial render on page load
renderTickets();
```

This ensures the ticket table is populated with existing data from localStorage when the page loads.

## Browser Compatibility

**Required Features:**
- `localStorage` API
- ES6+ JavaScript (const, arrow functions, template literals)
- DOM APIs (querySelector, createElement, addEventListener)
- Blob and URL.createObjectURL for CSV export

**Tested Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

1. **Data Storage:** All data is stored client-side in localStorage (no server transmission)
2. **Email Validation:** Basic regex validation (not exhaustive)
3. **XSS Protection:** Uses `textContent` instead of `innerHTML` for user data
4. **Input Sanitization:** No HTML rendering of user input

## Performance Notes

- **O(n) operations:** renderTickets(), exportCSV()
- **O(n) search:** toggleTicketStatus() uses map()
- **Memory:** All tickets kept in memory during session
- **Storage Limit:** localStorage typically 5-10MB per domain

## Migration Guide

If storage schema changes in future:

1. Create new STORAGE_KEY (e.g., `"hd:tickets:v2"`)
2. Write migration function to read v1 and convert to v2
3. Update all read/write operations to use new key
4. Optionally clean up old v1 data

## Usage Examples

### Creating a New Ticket Programmatically

```javascript
const newTicket = {
  id: Date.now(),
  date: nowLocalString(),
  name: "Jane Smith",
  email: "jane.smith@example.com",
  category: "Software",
  priority: "Medium",
  description: "Application crashes on startup",
  status: "Open"
};

const tickets = loadTickets();
tickets.push(newTicket);
saveTickets(tickets);
renderTickets();
```

### Bulk Status Update

```javascript
const tickets = loadTickets();
const updated = tickets.map(t => ({
  ...t,
  status: t.priority === "High" ? "Open" : t.status
}));
saveTickets(updated);
renderTickets();
```

### Filtering Tickets

```javascript
const tickets = loadTickets();
const openTickets = tickets.filter(t => t.status === "Open");
const highPriority = tickets.filter(t => t.priority === "High");
```
