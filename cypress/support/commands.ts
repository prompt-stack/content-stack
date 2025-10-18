/**
 * Cypress Custom Commands
 * Based on grammar-ops/config/cypress-commands.template.ts
 */

/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="cypress-file-upload" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via UI
       */
      login(email?: string, password?: string): Chainable<void>;
      
      /**
       * Custom command to seed content inbox with test data
       */
      seedInbox(itemCount?: number): Chainable<void>;
      
      /**
       * Custom command to upload files to inbox
       */
      uploadToInbox(fileName: string | string[]): Chainable<void>;
      
      /**
       * Custom command to wait for loading states to complete
       */
      waitForLoading(): Chainable<void>;
      
      /**
       * Custom command to drag and drop elements
       */
      dragAndDrop(subject: string, target: string): Chainable<void>;
      
      /**
       * Custom command to check toast notifications
       */
      checkToast(message: string, type?: 'success' | 'error'): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
  cy.url().should('include', '/inbox');
});

// Seed inbox with test data
Cypress.Commands.add('seedInbox', (itemCount = 5) => {
  const items = Array.from({ length: itemCount }, (_, i) => ({
    id: `test-${i + 1}`,
    name: `Test Item ${i + 1}`,
    type: i % 2 === 0 ? 'image' : 'document',
    size: Math.floor(Math.random() * 1000000),
    createdAt: new Date().toISOString(),
  }));
  
  cy.task('seedDatabase', { inbox: items });
});

// Upload files to inbox
Cypress.Commands.add('uploadToInbox', (fileNames) => {
  const files = Array.isArray(fileNames) ? fileNames : [fileNames];
  
  cy.get('[data-testid="dropzone"]').as('dropzone');
  
  files.forEach(fileName => {
    cy.fixture(fileName).then(fileContent => {
      cy.get('@dropzone').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName,
        mimeType: 'application/octet-stream'
      });
    });
  });
});

// Wait for loading states
Cypress.Commands.add('waitForLoading', () => {
  // Wait for any loading indicators to disappear
  cy.get('[data-testid="loading"]').should('not.exist');
  cy.get('[data-testid="spinner"]').should('not.exist');
  cy.get('.loading').should('not.exist');
  cy.get('[aria-busy="true"]').should('not.exist');
});

// Drag and drop
Cypress.Commands.add('dragAndDrop', (subject: string, target: string) => {
  cy.get(subject)
    .trigger('dragstart', { dataTransfer: new DataTransfer() });
  
  cy.get(target)
    .trigger('drop', { dataTransfer: new DataTransfer() });
  
  cy.get(subject)
    .trigger('dragend');
});

// Check toast notifications
Cypress.Commands.add('checkToast', (message: string, type = 'success') => {
  cy.get('[role="alert"]')
    .should('be.visible')
    .and('contain', message);
  
  if (type === 'success') {
    cy.get('[role="alert"]').should('have.class', 'toast--success');
  } else if (type === 'error') {
    cy.get('[role="alert"]').should('have.class', 'toast--error');
  }
});

// Export to satisfy TypeScript
export {};