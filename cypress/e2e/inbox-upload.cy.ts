/**
 * @fileoverview E2E tests for inbox upload functionality
 * @module inbox-upload.cy
 * @llm-test-e2e
 * @user-journey Upload files → Add metadata → Process content
 */

describe('Inbox Upload Flow', () => {
  beforeEach(() => {
    // Clear any existing data
    cy.task('clearDatabase');
    
    // Visit the inbox page
    cy.visit('/inbox');
    
    // Wait for page to load
    cy.waitForLoading();
  });

  describe('File Upload', () => {
    it('should upload a single file via drag and drop', () => {
      // Check initial state
      cy.findByText(/drop files here/i).should('be.visible');
      
      // Upload a test image
      cy.fixture('test-image.jpg', 'base64').then(fileContent => {
        cy.get('[data-testid="dropzone"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'test-image.jpg',
          mimeType: 'image/jpeg',
          encoding: 'base64'
        });
      });
      
      // Verify upload success
      cy.checkToast('File uploaded successfully', 'success');
      
      // Verify file appears in queue
      cy.get('[data-testid="inbox-queue"]')
        .should('contain', 'test-image.jpg');
    });

    it('should upload multiple files at once', () => {
      const files = ['test-image.jpg', 'test-document.pdf'];
      
      // Upload multiple files
      files.forEach(fileName => {
        cy.fixture(fileName).then(fileContent => {
          cy.get('[data-testid="dropzone"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: fileName,
            mimeType: 'application/octet-stream'
          });
        });
      });
      
      // Verify all files uploaded
      files.forEach(fileName => {
        cy.get('[data-testid="inbox-queue"]')
          .should('contain', fileName);
      });
      
      // Verify count
      cy.get('[data-testid="queue-count"]')
        .should('contain', '2 items');
    });

    it('should handle upload errors gracefully', () => {
      // Mock upload failure
      cy.intercept('POST', '/api/upload', { 
        statusCode: 500,
        body: { error: 'Upload failed' }
      }).as('uploadFail');
      
      // Attempt upload
      cy.get('[data-testid="dropzone"]').attachFile({
        fileContent: 'test',
        fileName: 'test.txt',
        mimeType: 'text/plain'
      });
      
      // Wait for failed request
      cy.wait('@uploadFail');
      
      // Verify error handling
      cy.checkToast('Upload failed', 'error');
      
      // File should not appear in queue
      cy.get('[data-testid="inbox-queue"]')
        .should('not.contain', 'test.txt');
    });
  });

  describe('Metadata Management', () => {
    beforeEach(() => {
      // Upload a test file first
      cy.uploadToInbox('test-image.jpg');
      cy.waitForLoading();
    });

    it('should add tags to uploaded content', () => {
      // Click on the uploaded item
      cy.get('[data-testid="inbox-item"]').first().click();
      
      // Open tag editor
      cy.findByRole('button', { name: /add tags/i }).click();
      
      // Add tags
      const tags = ['photography', 'landscape', 'nature'];
      tags.forEach(tag => {
        cy.get('[data-testid="tag-input"]').type(`${tag}{enter}`);
      });
      
      // Save tags
      cy.findByRole('button', { name: /save/i }).click();
      
      // Verify tags are displayed
      tags.forEach(tag => {
        cy.get('[data-testid="tag-list"]').should('contain', tag);
      });
    });

    it('should edit content metadata', () => {
      // Select item
      cy.get('[data-testid="inbox-item"]').first().click();
      
      // Edit title
      cy.findByLabelText(/title/i).clear().type('Beautiful Sunset Photo');
      
      // Edit description
      cy.findByLabelText(/description/i)
        .clear()
        .type('A stunning sunset captured at the beach');
      
      // Save changes
      cy.findByRole('button', { name: /save metadata/i }).click();
      
      // Verify changes persisted
      cy.checkToast('Metadata updated', 'success');
      cy.get('[data-testid="item-title"]')
        .should('contain', 'Beautiful Sunset Photo');
    });
  });

  describe('Queue Management', () => {
    beforeEach(() => {
      // Upload multiple test files
      cy.uploadToInbox(['test-1.jpg', 'test-2.jpg', 'test-3.jpg']);
      cy.waitForLoading();
    });

    it('should process queue items', () => {
      // Click process all button
      cy.findByRole('button', { name: /process all/i }).click();
      
      // Confirm in dialog
      cy.findByRole('button', { name: /confirm/i }).click();
      
      // Wait for processing
      cy.waitForLoading();
      
      // Verify success message
      cy.checkToast('3 items processed successfully', 'success');
      
      // Queue should be empty
      cy.get('[data-testid="inbox-queue"]')
        .should('contain', 'No items in queue');
    });

    it('should remove individual items from queue', () => {
      // Get first item
      cy.get('[data-testid="inbox-item"]').first().within(() => {
        // Click remove button
        cy.findByRole('button', { name: /remove/i }).click();
      });
      
      // Confirm removal
      cy.findByRole('button', { name: /confirm/i }).click();
      
      // Verify item removed
      cy.get('[data-testid="queue-count"]')
        .should('contain', '2 items');
    });

    it('should clear entire queue', () => {
      // Click clear queue button
      cy.findByRole('button', { name: /clear queue/i }).click();
      
      // Confirm in dialog
      cy.findByRole('button', { name: /clear all/i }).click();
      
      // Verify queue is empty
      cy.get('[data-testid="inbox-queue"]')
        .should('contain', 'No items in queue');
      cy.checkToast('Queue cleared', 'success');
    });
  });

  describe('Responsive Behavior', () => {
    ['iphone-x', 'ipad-2', [1920, 1080]].forEach(viewport => {
      it(`should work correctly on ${viewport}`, () => {
        // Set viewport
        if (Array.isArray(viewport)) {
          cy.viewport(viewport[0], viewport[1]);
        } else {
          cy.viewport(viewport as Cypress.ViewportPreset);
        }
        
        // Upload should still work
        cy.uploadToInbox('test-mobile.jpg');
        
        // Verify responsive layout
        if (viewport === 'iphone-x') {
          // Mobile layout - stacked
          cy.get('[data-testid="inbox-sidebar"]').should('not.be.visible');
          cy.findByRole('button', { name: /menu/i }).should('be.visible');
        } else {
          // Desktop layout - side by side
          cy.get('[data-testid="inbox-sidebar"]').should('be.visible');
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      // Tab to dropzone
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'dropzone');
      
      // Upload via keyboard
      cy.focused().attachFile({
        fileContent: 'test',
        fileName: 'keyboard-test.txt',
        mimeType: 'text/plain'
      });
      
      // Tab through queue items
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'inbox-item');
      
      // Activate with Enter
      cy.focused().type('{enter}');
      
      // Should open detail view
      cy.get('[data-testid="item-details"]').should('be.visible');
    });

    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="dropzone"]')
        .should('have.attr', 'aria-label', 'File upload area');
      
      cy.get('[data-testid="inbox-queue"]')
        .should('have.attr', 'role', 'list')
        .and('have.attr', 'aria-label', 'Upload queue');
    });
  });
});