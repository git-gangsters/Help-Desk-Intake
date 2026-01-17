# Testing Guide

Comprehensive testing documentation for the Help Desk Intake application.

## Table of Contents

- [Manual Testing](#manual-testing)
  - [Functional Testing](#functional-testing)
  - [Validation Testing](#validation-testing)
  - [UI/UX Testing](#uiux-testing)
- [Browser Testing](#browser-testing)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Data Persistence Testing](#data-persistence-testing)
- [Future: Automated Testing](#future-automated-testing)

## Manual Testing

### Functional Testing

#### Ticket Creation

**Test Case 1: Create Valid Ticket**

Steps:
1. Open `index.html` in browser
2. Fill in Name: "John Doe"
3. Fill in Email: "john.doe@example.com"
4. Select Category: "Hardware"
5. Select Priority: "High"
6. Fill in Description: "Monitor not working properly"
7. Click "Submit Ticket"

Expected Result:
- Form clears
- Ticket appears in dashboard table
- Status shows "Open"
- Priority is color-coded

**Test Case 2: Form Validation**

Steps:
1. Click "Submit Ticket" with empty form
2. Observe validation

Expected Result:
- Alert shows "Name is required."

**Test Case 3: Email Validation**

Steps:
1. Fill Name: "Jane Smith"
2. Fill Email: "invalid-email"
3. Fill other required fields
4. Click "Submit Ticket"

Expected Result:
- Alert shows "Email looks invalid."

#### Ticket Status Toggle

**Test Case 4: Close Ticket**

Steps:
1. Create a ticket
2. Click "Close" button in Action column

Expected Result:
- Status changes from "Open" to "Closed"
- Button text changes to "Reopen"

**Test Case 5: Reopen Ticket**

Steps:
1. Click "Reopen" on a closed ticket

Expected Result:
- Status changes from "Closed" to "Open"
- Button text changes to "Close"

#### CSV Export

**Test Case 6: Export Empty**

Steps:
1. Clear localStorage
2. Reload page
3. Click "Export CSV"

Expected Result:
- CSV file downloads with headers only
- Filename: `tickets-YYYY-MM-DD.csv`

**Test Case 7: Export With Data**

Steps:
1. Create 3-5 tickets with various data
2. Click "Export CSV"
3. Open file in Excel/spreadsheet

Expected Result:
- All tickets exported
- All fields present and correct
- Special characters properly escaped
- UTF-8 encoding displays correctly

### Validation Testing

**Test Case 8: Required Field Validation**

For each field, test submitting with that field empty:
- Name (empty): "Name is required."
- Email (empty): "Email is required."
- Email (invalid): "Email looks invalid."
- Category (not selected): "Category is required."
- Priority (not selected): "Priority is required."
- Description (empty): "Description is required."

**Test Case 9: Edge Cases**

Test with:
- Very long name (100+ characters)
- Very long description (1000+ characters)
- Email with special characters
- Name/description with quotes and commas (for CSV)

### UI/UX Testing

**Test Case 10: Form Reset**

Steps:
1. Fill form completely
2. Submit

Expected Result:
- All fields clear
- Focus returns to Name field

**Test Case 11: Responsive Design**

Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Expected Result:
- Layout adapts appropriately
- All elements accessible
- No horizontal scrolling
- Text remains readable

## Browser Testing

### Compatibility Matrix

Test on:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✓ Pass |
| Firefox | 88+     | ✓ Pass |
| Safari  | 14+     | ✓ Pass |
| Edge    | 90+     | ✓ Pass |

### Browser-Specific Tests

**localStorage Support**

Steps:
1. Open browser console
2. Run: `typeof(Storage) !== "undefined"`

Expected: `true`

**CSV Download**

Test CSV export in each browser:
- File downloads correctly
- UTF-8 BOM is present
- Excel opens correctly

## Accessibility Testing

### Keyboard Navigation

**Test Case 12: Tab Through Form**

Steps:
1. Load page
2. Press Tab repeatedly
3. Navigate through all form elements

Expected Result:
- Tab order is logical
- All elements focusable
- Focus indicator visible
- No keyboard traps

**Test Case 13: Form Submission via Keyboard**

Steps:
1. Fill form using only keyboard
2. Press Enter to submit

Expected Result:
- Form submits
- No page reload

### Screen Reader Testing

**Test Case 14: ARIA Labels**

Using NVDA/JAWS/VoiceOver:
1. Navigate form
2. Check all labels are announced
3. Check button purposes are clear

Expected Result:
- All form fields have labels
- Error messages announced
- Table data accessible

### WCAG Compliance

Check:
- Color contrast ratios (AA standard)
- Alt text for icons (if any)
- Proper heading hierarchy
- Form label associations

## Performance Testing

**Test Case 15: Large Dataset**

Steps:
1. Create 100 tickets via console:
```javascript
const tickets = [];
for(let i = 0; i < 100; i++) {
  tickets.push({
    id: Date.now() + i,
    date: nowLocalString(),
    name: `User ${i}`,
    email: `user${i}@example.com`,
    category: "Software",
    priority: ["Low", "Medium", "High"][i % 3],
    description: `Test ticket ${i}`,
    status: "Open"
  });
}
saveTickets(tickets);
renderTickets();
```
2. Measure render time
3. Test CSV export

Expected Result:
- Render completes in < 1 second
- No browser lag
- CSV export works correctly

**Test Case 16: localStorage Limits**

Test filling localStorage near 5MB limit.

Expected Result:
- Graceful handling of quota exceeded errors

## Data Persistence Testing

**Test Case 17: Page Reload**

Steps:
1. Create tickets
2. Reload page (F5)

Expected Result:
- All tickets persist
- Table re-renders correctly

**Test Case 18: Browser Close/Reopen**

Steps:
1. Create tickets
2. Close browser completely
3. Reopen and navigate to page

Expected Result:
- All tickets persist

**Test Case 19: localStorage Clear**

Steps:
1. Clear localStorage via DevTools
2. Reload page

Expected Result:
- Empty table
- No errors
- Form still functional

## Linting & Code Quality

### Running Linters

```bash
npm install
npm run lint
```

**Expected Output:**
- No ESLint errors
- No Stylelint errors
- No HTMLHint errors

### CI/CD Testing

GitHub Actions runs automatically on:
- Push to main
- Pull requests

Check `.github/workflows/ci.yml` for details.

## Future: Automated Testing

For automated test coverage, consider implementing:

### Unit Tests (Jest)

```javascript
describe('validateTicket', () => {
  test('rejects empty name', () => {
    const ticket = {name: '', email: 'test@test.com', ...};
    expect(validateTicket(ticket)).toBe('Name is required.');
  });

  test('rejects invalid email', () => {
    const ticket = {name: 'Test', email: 'invalid', ...};
    expect(validateTicket(ticket)).toBe('Email looks invalid.');
  });
});
```

### Integration Tests (Cypress/Playwright)

```javascript
describe('Ticket Creation', () => {
  it('creates and displays a new ticket', () => {
    cy.visit('/index.html');
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#category').select('Hardware');
    cy.get('#priority').select('High');
    cy.get('#description').type('Test description');
    cy.get('button[type="submit"]').click();
    cy.get('#ticketTable tbody tr').should('have.length', 1);
  });
});
```

### Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Critical user paths
- E2E tests: Full workflows

## Test Data

### Sample Valid Tickets

```javascript
const sampleTickets = [
  {
    name: "Alice Johnson",
    email: "alice.j@company.com",
    category: "Hardware",
    priority: "High",
    description: "Laptop won't turn on"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@company.com",
    category: "Software",
    priority: "Medium",
    description: "Can't install application"
  },
  {
    name: "Charlie Brown",
    email: "c.brown@company.com",
    category: "Network",
    priority: "Low",
    description: "Slow WiFi in conference room"
  }
];
```

### Edge Case Data

```javascript
const edgeCases = [
  {
    name: "Test \"Quote\" User",
    email: "test+alias@example.com",
    description: "Description with, commas, and \"quotes\""
  },
  {
    name: "A".repeat(100),
    description: "X".repeat(1000)
  }
];
```

## Regression Testing Checklist

Before each release, verify:

- [ ] All form fields accept and validate input
- [ ] Tickets save to localStorage
- [ ] Tickets persist after reload
- [ ] Status toggle works
- [ ] CSV export generates valid file
- [ ] Responsive design works on all viewports
- [ ] No console errors
- [ ] Linting passes
- [ ] CI/CD pipeline passes
- [ ] Cross-browser testing complete

## Bug Reporting Template

When reporting bugs, include:

**Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Result:**
What should happen

**Actual Result:**
What actually happens

**Environment:**
- Browser: [Name] [Version]
- OS: [Windows/Mac/Linux] [Version]
- Screen size: [Resolution]

**Screenshots:**
[If applicable]

**Console Errors:**
```
[Paste any errors]
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Cypress Documentation](https://docs.cypress.io/)
- [Jest Documentation](https://jestjs.io/)
