# Test Coverage Analysis

## Summary
- **Total Source Files**: 90 files that should have tests
- **Total Test Files**: 2 files (2.2% coverage)
- **Missing Tests**: 88 files (97.8%)

## Frontend Test Coverage

### Components (26 files, 2 tested = 7.7% coverage)
**Has Tests:**
- Badge.tsx ✓
- Button.tsx ✓

**Missing Tests:**
- Box.tsx
- Card.tsx
- Checkbox.tsx
- Dropdown.tsx
- Dropzone.tsx
- EditableField.tsx
- EditableText.tsx
- FileInput.tsx
- Image.tsx
- Input.tsx
- Label.tsx
- Link.tsx
- Modal.tsx
- Radio.tsx
- ScrollContainer.tsx
- Select.tsx
- Sidebar/Sidebar.tsx
- Sidebar/SidebarItem.tsx
- Sidebar/SidebarSection.tsx
- Sidebar/SidebarToggle.tsx
- Tag.tsx
- Text.tsx
- Textarea.tsx
- VirtualList.tsx

### Pages (7 files, 0 tested = 0% coverage)
**Missing Tests:**
- HealthPage.tsx
- InboxPage.tsx
- PlaygroundPage.tsx
- SearchPage.tsx
- StoragePage.tsx
- SubscriptionPage.tsx
- TestSidebarPage.tsx

### Features (12 files, 0 tested = 0% coverage)
**Missing Tests:**
- content-inbox/ContentInboxFeature.tsx
- content-inbox/components/ContentInboxInputPanel.tsx
- content-inbox/components/ContentInboxQueuePanel.tsx
- content-inbox/components/ContentInboxTagEditor.tsx
- content-inbox/config.ts
- content-inbox/hooks/useContentQueue.ts
- content-inbox/hooks/useModalFormReducer.ts
- content-inbox/types.ts
- search/SearchFeature.tsx
- search/index.ts
- storage/components/StorageView.tsx
- storage/index.ts

### Hooks (10 files, 0 tested = 0% coverage)
**Missing Tests:**
- useBodyScrollLock.ts
- useBreakpoint.ts
- useDebounce.ts
- useInbox.ts
- useMediaQuery.ts
- useScrollPosition.ts
- useSidebarShortcuts.ts
- useTheme.ts
- useUser.ts
- useUserTier.ts

### Services (2 files, 0 tested = 0% coverage)
**Missing Tests:**
- ApiService.ts
- ContentInboxApi.ts

### Contexts (2 files, 0 tested = 0% coverage)
**Missing Tests:**
- ContentInboxContext.tsx
- SidebarContext.tsx

### Layout (6 files, 0 tested = 0% coverage)
**Missing Tests:**
- BaseLayout.tsx
- Header.tsx
- InboxLayout.tsx
- Layout.tsx
- MobileMenu.tsx
- index.ts

### Utils/Lib (5 files, 0 tested = 0% coverage)
**Missing Tests:**
- lib/api.ts
- lib/breakpoints.ts
- lib/constants.ts
- lib/formatters.ts
- lib/validators.ts

### Types (1 file, 0 tested = 0% coverage)
**Missing Tests:**
- types/index.ts

## Backend Test Coverage

### Routes (2 files, 0 tested = 0% coverage)
**Missing Tests:**
- contentInbox.ts
- storage.ts

### Services (2 files, 0 tested = 0% coverage)
**Missing Tests:**
- ContentInboxService.ts
- MetadataService.ts

### Utils (7 files, 0 tested = 0% coverage)
**Missing Tests:**
- calculateWordCount.ts
- createMetadata.ts
- detectContentType.ts
- detectFileType.ts
- extractTitle.ts
- generateContentId.ts
- generateHash.ts

### Types (1 file, 0 tested = 0% coverage)
**Missing Tests:**
- ContentTypes.ts

## Config Files (7 files, 0 tested = 0% coverage)
**Missing Tests:**
- categories.js
- content-types.config.ts
- metadata-schema.js
- paths.config.ts
- paths.js
- pipeline.config.ts
- tier-system/features.js

## Priority Recommendations

### High Priority (Core functionality)
1. **Frontend Services** - API communication layer
2. **Backend Services** - Business logic
3. **Frontend Hooks** - Reusable logic
4. **Backend Routes** - API endpoints
5. **Core Components** - Most used UI components

### Medium Priority
1. **Feature Components** - Feature-specific components
2. **Utils/Lib** - Helper functions
3. **Contexts** - State management
4. **Layout Components** - Page structure

### Lower Priority
1. **Pages** - Integration tested through E2E
2. **Config Files** - Static configuration
3. **Types** - TypeScript definitions

## Test Infrastructure Status
- Jest is configured (src/test/jest.setup.ts exists)
- Testing libraries installed (@testing-library/react, @testing-library/jest-dom)
- Only 2 component tests exist currently
- No backend tests exist
- No integration or E2E tests found