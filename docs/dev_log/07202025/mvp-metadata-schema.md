# MVP Metadata Schema (Solo Dev Local)

> **LLM INSTRUCTIONS**: This is the MINIMAL metadata schema for solo developer local-first setup. Every field has an immediate purpose.

## 🎯 MVP Principle

**Just enough metadata to make LLM decisions and track files. Nothing more.**

## 📋 MVP Metadata Schema

```json
{
  "id": "content-2024-01-15-abc123",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  
  "status": "inbox",
  
  "source": {
    "method": "paste",
    "url": null
  },
  
  "content": {
    "type": "text",
    "title": "Auto-extracted or user title",
    "full_text": "Complete content for LLM analysis",
    "word_count": 150,
    "hash": "sha256-deduplication-hash"
  },
  
  "location": {
    "inbox_path": "content/inbox/paste-2024-01-15-abc123.txt",
    "final_path": null
  },
  
  "llm_analysis": null
}
```

## 📋 After LLM Processing

```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:01:00Z",
  
  "llm_analysis": {
    "category": "articles",
    "reasoning": "This is a technical article about...",
    "confidence": 0.95,
    "suggested_filename": "docker-setup-guide.md"
  },
  
  "location": {
    "final_path": "content/storage/articles/docker-setup-guide-abc123.md"
  }
}
```

## 🔍 Field Purposes

### Core Identity
- **id**: Unique file identifier
- **created_at/updated_at**: Basic timestamps
- **status**: Where in pipeline (`inbox` → `stored`)

### Source Tracking
- **method**: How added (`paste`, `upload`, `url`, `drop`)
- **url**: If from URL extraction (else `null`)

### Content for LLM
- **type**: `text`, `image`, `video`, `data` 
- **title**: First line or extracted title
- **full_text**: Everything LLM needs to categorize
- **word_count**: Quick size reference
- **hash**: Prevent duplicate files

### File Management
- **inbox_path**: Where file currently lives
- **final_path**: Where it goes after processing

### LLM Decision
- **category**: Which storage folder (`articles`, `notes`, `code`, etc.)
- **reasoning**: Why LLM chose this (for debugging)
- **confidence**: How sure LLM is (0-1)
- **suggested_filename**: Friendly filename

## 🎯 That's It!

**8 core fields + 4 LLM fields = 12 total fields**

Compare to full schema: **50+ fields** → **12 fields** (76% reduction!)

## 🚀 Implementation

### Creating New Content
```typescript
const createMetadata = (content: string, method: string, url?: string) => {
  const id = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  return {
    id,
    created_at: timestamp,
    updated_at: timestamp,
    status: "inbox",
    source: {
      method,
      url: url || null
    },
    content: {
      type: detectContentType(content),
      title: extractTitle(content),
      full_text: content,
      word_count: content.split(/\s+/).length,
      hash: generateHash(content)
    },
    location: {
      inbox_path: `content/inbox/${method}-${Date.now()}-${id.split('-')[2]}.txt`,
      final_path: null
    },
    llm_analysis: null
  };
};
```

### After LLM Processing
```typescript
const updateWithLLMAnalysis = (metadata: any, analysis: any) => {
  return {
    ...metadata,
    status: "stored",
    updated_at: new Date().toISOString(),
    llm_analysis: analysis,
    location: {
      ...metadata.location,
      final_path: `content/storage/${analysis.category}/${analysis.suggested_filename}`
    }
  };
};
```

## 📊 Status Flow

```
1. User adds content
   → status: "inbox"
   → file: content/inbox/paste-123.txt
   → metadata: {basic fields}

2. LLM analyzes  
   → status: "stored"
   → file: content/storage/articles/my-doc.md
   → metadata: {+ llm_analysis}
```

## 🔧 Content Type Detection

```typescript
const detectContentType = (content: string): string => {
  if (content.includes('```') || content.includes('function')) return 'code';
  if (content.includes('<html') || content.includes('<!DOCTYPE')) return 'html';
  if (content.length < 100) return 'note';
  return 'text';
};

const extractTitle = (content: string): string => {
  const firstLine = content.split('\n')[0];
  if (firstLine.startsWith('# ')) return firstLine.replace('# ', '');
  return firstLine.slice(0, 50) + (firstLine.length > 50 ? '...' : '');
};
```

## ✅ MVP Success Criteria

1. ✅ Content gets unique ID and timestamp
2. ✅ Source method tracked (paste/upload/url/drop)  
3. ✅ Full content available for LLM analysis
4. ✅ File paths tracked (inbox → storage)
5. ✅ LLM can decide storage category
6. ✅ Deduplication via content hash
7. ✅ Simple status tracking (inbox → stored)

## 🚀 What We're NOT Tracking (Yet)

- ❌ Users (solo dev)
- ❌ Sessions (not needed)
- ❌ Processing metrics (can add later)
- ❌ User preferences (can add later)
- ❌ Content relationships (can add later)
- ❌ Search optimization (can add later)
- ❌ Content safety (can add later)

**Start here. Add complexity only when actually needed!**