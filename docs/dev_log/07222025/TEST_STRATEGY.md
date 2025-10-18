# Test Strategy for Content Stack React

## Current State
- **Overall Coverage**: 2.2% (2/90 files)
- **Test Infrastructure**: ✅ Ready (Jest + Cypress)
- **Test Patterns**: ✅ Defined (grammar-ops)

## Testing Priorities

### Phase 1: Foundation (Week 1)
**Goal**: 30% coverage focusing on critical paths

1. **Backend API Routes** (2 files)
   - `/api/inbox/*` endpoints
   - `/api/storage/*` endpoints
   - Use supertest for API testing

2. **Utility Functions** (12 files)
   - Pure functions are easiest to test
   - High confidence, low effort
   - Examples: detectFileType, createMetadata, formatters

3. **Core Services** (4 files)
   - ContentInboxService (backend)
   - MetadataService (backend)
   - ContentInboxApi (frontend)
   - ApiService (frontend)

### Phase 2: Business Logic (Week 2)
**Goal**: 50% coverage on stateful logic

4. **Custom Hooks** (10 files)
   - useInbox, useContentQueue
   - useTheme, useSidebar
   - Test state management and effects

5. **Feature Components** (12 files)
   - ContentInboxFeature and sub-components
   - Test complete user workflows
   - Integration with services

### Phase 3: User Interface (Week 3)
**Goal**: 70% coverage on UI

6. **Page Components** (7 files)
   - Test page-level integration
   - Mock API responses
   - Test loading states

7. **Remaining Components** (24 files)
   - Focus on interactive components
   - Skip pure display components initially

### Phase 4: End-to-End (Week 4)
**Goal**: Critical path E2E coverage

8. **E2E Test Suites**
   - Complete inbox workflow
   - File upload → process → storage
   - Error scenarios
   - Cross-browser testing

## Test Types by Layer

### Backend Testing Stack
```javascript
// API Route Testing
import request from 'supertest';
import { app } from './server';

// Service Testing  
import { ContentInboxService } from './services';

// Utility Testing
import { createMetadata } from './utils';
```

### Frontend Testing Stack
```javascript
// Component Testing
import { render, screen } from '@testing-library/react';

// Hook Testing
import { renderHook, act } from '@testing-library/react';

// Integration Testing
import { renderWithProviders } from './test-utils';

// E2E Testing
import { cy } from 'cypress';
```

## Coverage Goals

### Minimum Coverage by Type
- **Utils**: 95% (pure functions)
- **Services**: 90% (business logic)
- **Hooks**: 90% (stateful logic)
- **API Routes**: 85% (critical paths)
- **Components**: 80% (user interactions)
- **Pages**: 70% (integration)
- **E2E**: All critical user journeys

### Overall Goals
- **Sprint 1**: 30% overall coverage
- **Sprint 2**: 50% overall coverage
- **Sprint 3**: 70% overall coverage
- **Sprint 4**: 80% overall coverage

## Testing Patterns

### 1. Unit Tests (Jest)
- Fast, isolated, numerous
- Mock external dependencies
- Test individual functions/components

### 2. Integration Tests (Jest + RTL)
- Test feature workflows
- Mock API, use real components
- Test component interactions

### 3. E2E Tests (Cypress)
- Test complete user journeys
- Real browser, real API (or mocked)
- Focus on critical paths only

### 4. Contract Tests
- Test API contracts
- Ensure frontend/backend alignment
- Use shared TypeScript types

## Quick Wins

### Start Here (High Value, Low Effort):
1. `detectFileType.test.ts` - Pure function
2. `formatters.test.ts` - Pure functions
3. `validators.test.ts` - Pure functions
4. `createMetadata.test.ts` - Pure function
5. `useDebounce.test.ts` - Simple hook

### Command to Generate All:
```bash
# Generate tests for all utils
find backend/utils -name "*.ts" -exec npm run generate:test {} \;
find src/lib -name "*.ts" -exec npm run generate:test {} \;
```

## Continuous Integration

### Pre-commit
```json
{
  "husky": {
    "pre-commit": "npm test -- --findRelatedTests"
  }
}
```

### GitHub Actions
```yaml
- name: Test
  run: |
    npm test -- --coverage
    npm run test:e2e
```

### Coverage Reporting
- Use codecov.io or similar
- Block PRs below 70% coverage
- Celebrate coverage improvements

## Next Actions

1. **Today**: Test all utils (12 files) → +13% coverage
2. **Tomorrow**: Test backend routes → +5% coverage  
3. **This Week**: Test services & hooks → +15% coverage
4. **Next Week**: Test features & pages → +20% coverage

Total achievable in 2 weeks: ~55% coverage

## Remember

> "Test the behavior, not the implementation"
> "Test what users do, not how code works"
> "A test is better than no test"