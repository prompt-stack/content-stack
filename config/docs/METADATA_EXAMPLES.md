# Metadata Examples

## Overview

This document provides examples of metadata at different stages and for different content types.

## Example 1: Raw Content (Just Created)

```json
{
  "id": "content-1753319664670-46u6y7",
  "created_at": "2025-07-24T01:14:24.670Z",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "text",
    "full_text": "This is the original content...",
    "hash": "sha256-abc123..."
  },
  "updated_at": "2025-07-24T01:14:24.670Z",
  "status": "raw",
  "location": {
    "inbox_path": "content/inbox/content-1753319664670-46u6y7.txt",
    "final_path": null
  },
  "storage": {
    "path": "content/inbox/content-1753319664670-46u6y7.txt",
    "size": 1234
  },
  "tags": [],
  "llm_analysis": null
}
```

## Example 2: Enriched Educational Content

```json
{
  "id": "content-1753319664670-46u6y7",
  "created_at": "2025-07-24T01:14:24.670Z",
  "source": {
    "method": "url",
    "url": "https://chatgpt.com/c/6876c97a-e470-8007-9521-873fa99d8f0f"
  },
  "content": {
    "type": "text",
    "full_text": "Data structures are just ways to organize information...",
    "hash": "sha256-2b9fa7bdae61eb7d13239ec7342464c37856549dd860016533941ecf97654b68"
  },
  "updated_at": "2025-07-24T01:25:00.000Z",
  "status": "enriched",
  "location": {
    "inbox_path": "storage/code/content-1753319664670-46u6y7.js",
    "final_path": null
  },
  "storage": {
    "path": "storage/code/content-1753319664670-46u6y7.js",
    "size": 3857
  },
  "tags": ["data-structures", "tutorial"],
  "metadata": {
    "author": "Rudi",
    "language": "en"
  },
  "llm_analysis": {
    "category": "education",
    "title": "Data Structures & JSON for Non-Technical Builders",
    "tags": ["data-structures", "json", "plain-english", "llm-education"],
    "summary": "A comprehensive guide teaching data structures to non-CS users who want to build with AI tools.",
    "reasoning": "This content is educational material designed to teach technical concepts to non-technical audiences.",
    "confidence": 0.95,
    "suggested_filename": "data-structures-json-plain-english-guide",
    "extracted_entities": ["Rudi", "ChatGPT", "JSON", "Zapier"],
    "word_count": 3857,
    "analyzed_at": "2025-07-24T01:25:00.000Z",
    "model_version": "claude-3-sonnet"
  }
}
```

## Example 3: Video Content

```json
{
  "id": "content-1753320000000-xyz123",
  "created_at": "2025-07-24T02:00:00.000Z",
  "source": {
    "method": "url",
    "url": "https://youtube.com/watch?v=abc123"
  },
  "content": {
    "type": "video",
    "full_text": "Transcript: Welcome to this tutorial on APIs...",
    "hash": "sha256-def456...",
    "duration": "15:30",
    "dimensions": {
      "width": 1920,
      "height": 1080
    }
  },
  "updated_at": "2025-07-24T02:30:00.000Z",
  "status": "enriched",
  "location": {
    "inbox_path": "content/inbox/content-1753320000000-xyz123.json",
    "final_path": null
  },
  "storage": {
    "path": "content/inbox/content-1753320000000-xyz123.json",
    "size": 5432
  },
  "tags": ["api", "tutorial"],
  "metadata": {
    "author": "TechEducator",
    "source_platform": "youtube",
    "original_date": "2025-01-20"
  },
  "llm_analysis": {
    "category": "technical",
    "title": "Understanding REST APIs - Complete Beginner Guide",
    "tags": ["api", "rest", "http", "web-development", "tutorial"],
    "summary": "A 15-minute tutorial explaining REST APIs, HTTP methods, and how to make API calls.",
    "reasoning": "Technical tutorial content focused on web development concepts for beginners.",
    "confidence": 0.92,
    "suggested_filename": "rest-api-beginner-guide",
    "extracted_entities": ["REST", "HTTP", "JSON", "Postman"],
    "word_count": 2145,
    "analyzed_at": "2025-07-24T02:30:00.000Z",
    "model_version": "gpt-4"
  }
}
```

## Example 4: Code Snippet

```json
{
  "id": "content-1753321000000-abc789",
  "created_at": "2025-07-24T03:00:00.000Z",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "code",
    "full_text": "function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}",
    "hash": "sha256-ghi789...",
    "file_type": "javascript"
  },
  "updated_at": "2025-07-24T03:05:00.000Z",
  "status": "enriched",
  "location": {
    "inbox_path": "content/inbox/content-1753321000000-abc789.js",
    "final_path": null
  },
  "storage": {
    "path": "content/inbox/content-1753321000000-abc789.js",
    "size": 89
  },
  "tags": ["javascript", "utility"],
  "llm_analysis": {
    "category": "reference",
    "title": "Calculate Total Price from Items Array",
    "tags": ["javascript", "array-reduce", "utility-function", "ecommerce"],
    "summary": "A utility function that calculates the total price from an array of items using reduce.",
    "reasoning": "This is a reference code snippet showing a common pattern for summing values in an array.",
    "confidence": 0.98,
    "suggested_filename": "calculate-total-price-utility",
    "extracted_entities": ["calculateTotal", "reduce"],
    "word_count": 15,
    "analyzed_at": "2025-07-24T03:05:00.000Z",
    "model_version": "claude-3-haiku"
  }
}
```

## Field Guidelines

### Categories (llm_analysis.category)
- `education` - Teaching materials, tutorials, guides
- `technical` - Technical documentation, API references
- `reference` - Code snippets, cheat sheets, quick references
- `research` - Studies, analysis, deep dives
- `business` - Business strategies, marketing content
- `creative` - Creative writing, stories, artistic content

### Source Methods
- `paste` - Content pasted directly
- `upload` - File uploaded
- `url` - Content fetched from URL
- `drop` - Drag and drop
- `manual` - Manually created
- `api` - Created via API

### Content Types
- `text` - Plain text content
- `code` - Source code
- `document` - PDF, Word docs
- `image` - Images
- `video` - Video content
- `audio` - Audio content
- `data` - CSV, JSON data files

### Status Values
- `raw` - Newly created, not enriched
- `enriched` - AI has analyzed and enriched the metadata