# Simple Content Flow Architecture

> **LLM INSTRUCTIONS**: This is the SIMPLE content flow. Every file has a purpose. Every step is clear.

## 🎯 Core Principle

**Everything flows through the web inbox → LLM decides final destination**

## 📁 Simple Structure

```
content/
├── inbox/                   # ALL content enters here first
│   └── {type}-{timestamp}.{ext}
├── storage/                 # LLM-organized final destinations  
│   ├── articles/
│   ├── notes/
│   ├── code/
│   ├── images/
│   ├── videos/
│   └── data/
└── metadata/                # One JSON per content item
    └── {content-id}.json
```

## 🔄 3-Step Flow

### Step 1: INBOX (Web Channel)
```
User adds content → content/inbox/{type}-{timestamp}.{ext}
                 → metadata/{id}.json (with full context)
```

### Step 2: LLM ANALYSIS
```
LLM reads metadata/{id}.json → analyzes content type/topic/purpose
                            → decides: storage/articles/ or storage/notes/ etc.
```

### Step 3: FINAL STORAGE
```
File moved: inbox/{file} → storage/{llm-chosen-category}/{file}
Metadata updated: final_location = "storage/articles/my-file.md"
```

## 📋 Metadata Schema (LLM-Friendly)

```json
{
  "id": "content-123",
  "status": "inbox|analyzed|stored",
  "content": {
    "type": "text|image|video|data",
    "source": "paste|upload|url|drop", 
    "title": "Auto-extracted title",
    "summary": "Brief content summary",
    "full_text": "Complete content for LLM analysis"
  },
  "llm_analysis": {
    "category": "articles|notes|code|images|videos|data",
    "reasoning": "Why this category was chosen",
    "confidence": 0.95,
    "suggested_filename": "my-article.md"
  },
  "location": {
    "inbox_path": "content/inbox/paste-123.txt",
    "final_path": "content/storage/articles/my-article.md"
  },
  "timestamps": {
    "received": "2024-01-15T10:00:00Z",
    "analyzed": "2024-01-15T10:01:00Z", 
    "stored": "2024-01-15T10:02:00Z"
  }
}
```

## 🤖 LLM Decision Logic

### LLM Prompt for Categorization:
```
Analyze this content and decide storage location:

Content: {metadata.content.full_text}
Type: {metadata.content.type}
Source: {metadata.content.source}

Choose category:
- articles: Long-form content, blog posts, documentation
- notes: Quick thoughts, snippets, reminders  
- code: Scripts, configs, technical files
- images: Photos, screenshots, diagrams
- videos: Video files, recordings
- data: Spreadsheets, JSON, databases

Respond with:
{
  "category": "articles",
  "reasoning": "This is a detailed technical explanation about...",
  "confidence": 0.95,
  "suggested_filename": "docker-setup-guide.md"
}
```

## 🎯 File Purposes

### Every File Has Clear Purpose:

1. **Inbox Files**: Temporary staging, awaiting LLM analysis
2. **Storage Files**: Final organized content, LLM-categorized
3. **Metadata Files**: Complete context for LLM decision-making

### Clear File Lifecycle:

```
CREATE → ANALYZE → STORE → USE
   ↓        ↓        ↓      ↓
inbox/   metadata/  storage/ (ready)
```

## 🚀 Implementation Steps

### Step 1: Simplified Inbox
```typescript
// When user adds content:
1. Save to content/inbox/{type}-{timestamp}.{ext}
2. Create metadata/{id}.json with full content
3. Status = "inbox"
```

### Step 2: LLM Analysis Service
```typescript
// Background process:
1. Scan metadata/ for status="inbox" 
2. Send content to LLM for categorization
3. Update metadata with LLM decision
4. Status = "analyzed"
```

### Step 3: Auto-Storage
```typescript
// Final step:
1. Move file from inbox/ to storage/{llm-category}/
2. Update metadata with final_path
3. Status = "stored"
```

## 💡 Benefits

### For LLMs:
- **Simple**: Only 3 statuses to understand
- **Clear**: Each file has obvious purpose  
- **Contextual**: Full content in metadata for analysis
- **Predictable**: Same flow every time

### For Developers:
- **Debuggable**: Easy to see where content is in pipeline
- **Maintainable**: Minimal complexity
- **Scalable**: LLM handles categorization logic

### For Users:
- **Fast**: Content appears in inbox immediately
- **Organized**: LLM puts content where it belongs
- **Discoverable**: Clear categories in storage/

## 🔍 Content Discovery

### Find Content By:
```bash
# All new content
ls content/inbox/

# All articles  
ls content/storage/articles/

# All metadata
ls content/metadata/

# Specific content
grep "docker" content/metadata/*.json
```

## ✅ Success Criteria

### This Works When:
1. ✅ User adds content → file appears in inbox/ instantly
2. ✅ LLM analyzes metadata → decides category
3. ✅ File auto-moves to storage/{category}/
4. ✅ Every file has clear purpose and location
5. ✅ LLM can easily understand the flow

**REMEMBER**: Keep it simple. Every file has a reason. LLM decides the destination.