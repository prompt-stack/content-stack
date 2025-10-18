# Content Inbox Backend Integration Plan

> **LLM INSTRUCTIONS**: This document outlines the backend integration strategy for the Content Inbox feature, maintaining local-first architecture with easy database transition.

## 📍 Current Status

**What We Have**:
- ✅ Content Inbox UI feature implemented (`src/features/content-inbox/`)
- ✅ Mock data implementation in `useContentQueue.ts` hook
- ✅ Comprehensive API service (`src/services/api.ts`) ready for backend calls
- ✅ Global types defined (`src/types/index.ts`) matching API expectations

**What We're Doing Now**:
- 🔄 Replace mock implementation with API service calls
- 🔄 Maintain local-first behavior with easy backend transition
- 🔄 Add proper error handling and loading states

## 🏗️ Architecture Strategy

### Local-First with Backend Ready

```
Frontend State Management:
├── Local Storage (immediate persistence)
├── In-Memory Queue (real-time operations)  
├── API Service Layer (backend integration)
└── Fallback to Local (offline capability)
```

### Data Flow Design

```
User Action → Local State Update → Local Storage → API Call (background)
                    ↓
              Immediate UI Feedback
                    ↓
         API Success/Error Handling
```

## 📁 Implementation Plan

### Phase 1: API Integration (Current)
```typescript
// Replace mock useContentQueue with API calls
✅ 1. Update imports to include API service
🔄 2. Replace addContent mock with api.addInboxItem()
🔄 3. Add loadQueue function using api.getInboxItems()
🔄 4. Update removeContent with api.deleteInboxItem()
🔄 5. Add proper error handling and loading states
```

### Phase 2: Local-First Enhancement
```typescript
// Add local storage persistence
⏳ 1. Add localStorage backup for queue data
⏳ 2. Implement offline detection
⏳ 3. Add sync mechanism for when online
⏳ 4. Queue operations for offline mode
```

### Phase 3: Backend Transition Ready
```typescript
// Ensure smooth database transition
⏳ 1. Validate API endpoint compatibility
⏳ 2. Add data migration utilities
⏳ 3. Performance optimization for large datasets
⏳ 4. Batch operations for efficiency
```

## 🔌 API Integration Details

### Current API Service Capabilities
```typescript
// From src/services/api.ts - Already Available:
- getInboxItems(): Promise<ContentItem[]>        // Load queue
- addInboxItem(data): Promise<ContentItem>       // Add content  
- deleteInboxItem(id): Promise<void>             // Remove content
- extractURL(url): Promise<ContentItem>          // URL extraction
- moveToLibrary(id): Promise<ContentItem>        // Move to library
```

### Hook Transformation Strategy
```typescript
// Before (Mock):
const [queue, setQueue] = useState<ContentItem[]>([]);

// After (API Integrated):
const [queue, setQueue] = useState<ContentItem[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Load from API on mount
useEffect(() => {
  loadQueue();
}, []);

const loadQueue = async () => {
  try {
    setIsLoading(true);
    const items = await api.getInboxItems();
    setQueue(items);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

## 💾 Local-First Storage Strategy

### localStorage Schema
```typescript
interface LocalStorageSchema {
  'content-inbox-queue': ContentItem[];
  'content-inbox-sync-queue': PendingOperation[];
  'content-inbox-last-sync': string;
  'content-inbox-offline-mode': boolean;
}

interface PendingOperation {
  id: string;
  type: 'add' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
}
```

### Sync Strategy
```typescript
// Background sync when online
const syncWithBackend = async () => {
  const pendingOps = getPendingOperations();
  
  for (const op of pendingOps) {
    try {
      await executeOperation(op);
      removePendingOperation(op.id);
    } catch (error) {
      incrementRetryCount(op.id);
    }
  }
};
```

## 🎯 Implementation Steps

### Step 1: Update useContentQueue Hook ⏳
```typescript
// File: src/features/content-inbox/hooks/useContentQueue.ts

// Add API integration while maintaining local state
const useContentQueue = () => {
  // Existing state + new loading/error states
  const [queue, setQueue] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load queue from API on mount
  const loadQueue = async () => { /* API call */ };
  
  // Transform addContent to use API
  const addContent = async (submission: ContentSubmission) => {
    // Optimistic update to local state
    // API call in background
    // Handle errors gracefully
  };
  
  // Other operations...
};
```

### Step 2: Add Error Handling & Loading States ⏳
```typescript
// Update UI components to handle loading/error states
- ContentInboxInputPanel: Disable during loading
- ContentInboxQueuePanel: Show loading spinner
- Add error notifications for failed operations
```

### Step 3: Local Storage Backup ⏳
```typescript
// Add persistence layer
const persistQueue = (queue: ContentItem[]) => {
  localStorage.setItem('content-inbox-queue', JSON.stringify(queue));
};

const restoreQueue = (): ContentItem[] => {
  const stored = localStorage.getItem('content-inbox-queue');
  return stored ? JSON.parse(stored) : [];
};
```

### Step 4: Offline Capability ⏳
```typescript
// Add network detection and offline queue
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};
```

## 🔍 Type Alignment

### Current Type Mismatch Resolution
```typescript
// Global types (src/types/index.ts) vs Local types (features/content-inbox/types.ts)

// Strategy: Extend global types for local needs
export interface ContentItem extends GlobalContentItem {
  timestamp?: Date;        // Local-only field for UI sorting
  sourceUrl?: string;      // Local-only field for debugging
  localId?: string;        // Temporary ID for offline operations
}
```

## 🧪 Testing Strategy

### Integration Tests
```typescript
// Test API integration without backend dependency
describe('useContentQueue with API', () => {
  it('loads queue from API on mount');
  it('falls back to localStorage when API fails');
  it('syncs changes to API when online');
  it('queues operations when offline');
});
```

### Error Scenarios
```typescript
// Handle common failure cases
- Network timeout
- API server down  
- Invalid content format
- Storage quota exceeded
- Authentication errors
```

## 🚀 Database Transition Readiness

### Migration Path
```typescript
// When ready for database backend:
1. API endpoints already match expected format
2. Local queue structure maps directly to DB schema
3. Sync mechanism handles batch operations
4. Error handling supports partial failures
```

### Performance Considerations
```typescript
// For large datasets:
- Implement pagination in API calls
- Add virtual scrolling to queue UI
- Batch local storage operations
- Implement incremental sync
```

## ✅ Success Criteria

### Phase 1 Complete When:
- ✅ Content can be added via API calls
- ✅ Queue loads from backend on app start
- ✅ Operations work with proper error handling
- ✅ Loading states provide user feedback

### Phase 2 Complete When:
- ⏳ Works offline with localStorage backup
- ⏳ Syncs automatically when back online
- ⏳ Handles network failures gracefully
- ⏳ Provides clear offline/online indicators

### Phase 3 Complete When:
- ⏳ Ready for production database
- ⏳ Handles large datasets efficiently
- ⏳ Supports bulk operations
- ⏳ Migration path documented

## 🎯 Current Action Items

```bash
# Immediate next steps:
1. Update useContentQueue.ts with API integration
2. Add loading/error states to UI components  
3. Test with mock API responses
4. Add localStorage backup layer
5. Implement offline detection
```

**REMEMBER**: Maintain local-first UX while building backend-ready architecture!