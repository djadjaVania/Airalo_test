# Project Overview

This project includes two types of automated tests:
1. **UI Tests**: Validate the functionality and user interface of the application.
2. **API Tests**: Ensure the reliability and correctness of the application's backend API.

The tests are written using **Playwright JS**, a powerful framework for end-to-end testing.

---

## Prerequisites

Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright and its browser dependencies:
   ```bash
   npx playwright install
   ```

---

## Running the Tests

### Run All Tests
To execute all tests:
```bash
npx playwright test
```

### Run UI Tests Only
To run only the UI tests:
```bash
npx playwright test tests/ui
```

### Run API Tests Only
To run only the API tests:
```bash
npx playwright test tests/api
```

### Run a Specific Test
To run a specific test file:
```bash
npx playwright test <path-to-test-file>
```

---

## Additional Commands

### View Test Reports
To generate and view a detailed HTML report after running tests:
```bash
npx playwright show-report
```

### Debug Tests
To run tests in debug mode:
```bash
npx playwright test --debug
```

---

Feel free to contribute or raise issues to improve the project!

