# Server Services

Business logic layer for server-side operations.

## Inbox Services

- `ps-inbox-service.js` - Core business logic
- `ps-inbox-storage.js` - File and metadata operations
- `ps-inbox-processor.js` - Content processing
- `ps-inbox-validator.js` - Input validation

## Architecture

Services are separated from routes to enable:
- Better testability
- Reusability
- Clear separation of concerns
- Easier maintenance