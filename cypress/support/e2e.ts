/**
 * Cypress E2E Support File
 * This file is loaded before every test file
 */

// Import commands
import './commands';

// Import code coverage support
import '@cypress/code-coverage/support';

// Import testing library commands
import '@testing-library/cypress/add-commands';

// Import file upload support
import 'cypress-file-upload';

// Global before hook
before(() => {
  // Clear any existing test data
  cy.task('clearDatabase');
});

// Global after hook
after(() => {
  // Clean up test data
  cy.task('clearDatabase');
});

// Uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions from the application
  console.error('Uncaught exception:', err.message);
  return false;
});