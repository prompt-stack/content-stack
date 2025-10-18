# MVP Metadata Examples

> **LLM INSTRUCTIONS**: These are real examples of metadata for all 4 upload methods with different content types.

## 📋 Example 1: PASTE - Text Article

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
    "title": "How to Set Up Docker for Development",
    "full_text": "# How to Set Up Docker for Development\n\nDocker has revolutionized how we develop and deploy applications. In this guide, we'll walk through setting up Docker for local development...\n\n## Prerequisites\n- Basic command line knowledge\n- Understanding of containers\n\n## Step 1: Install Docker\nFirst, download Docker Desktop from the official website...",
    "word_count": 847,
    "hash": "sha256-a1b2c3d4e5f6789"
  },
  "location": {
    "inbox_path": "content/inbox/paste-2024-01-15-abc123.txt",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:01:30Z",
  "llm_analysis": {
    "category": "articles",
    "reasoning": "This is a comprehensive technical tutorial with step-by-step instructions for Docker setup. Contains structured sections, prerequisites, and detailed explanations suitable for the articles category.",
    "confidence": 0.95,
    "suggested_filename": "docker-development-setup-guide.md"
  },
  "location": {
    "final_path": "content/storage/articles/docker-development-setup-guide-abc123.md"
  }
}
```

## 📋 Example 2: PASTE - Code Snippet

```json
{
  "id": "content-2024-01-15-def456",
  "created_at": "2024-01-15T10:05:00Z",
  "updated_at": "2024-01-15T10:05:00Z",
  "status": "inbox",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "code",
    "title": "function createUser(email, password) {",
    "full_text": "function createUser(email, password) {\n  if (!email || !password) {\n    throw new Error('Email and password required');\n  }\n  \n  const hashedPassword = bcrypt.hash(password, 10);\n  \n  return db.users.create({\n    email,\n    password: hashedPassword,\n    createdAt: new Date()\n  });\n}",
    "word_count": 31,
    "hash": "sha256-x7y8z9a1b2c3456"
  },
  "location": {
    "inbox_path": "content/inbox/paste-2024-01-15-def456.txt",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:05:45Z",
  "llm_analysis": {
    "category": "code",
    "reasoning": "This is a JavaScript function for user creation with password hashing. It's a code snippet rather than documentation, suitable for the code category.",
    "confidence": 0.98,
    "suggested_filename": "user-creation-function.js"
  },
  "location": {
    "final_path": "content/storage/code/user-creation-function-def456.js"
  }
}
```

## 📋 Example 3: UPLOAD - PDF Document

```json
{
  "id": "content-2024-01-15-ghi789",
  "created_at": "2024-01-15T10:10:00Z",
  "updated_at": "2024-01-15T10:10:00Z",
  "status": "inbox",
  "source": {
    "method": "upload",
    "url": null
  },
  "content": {
    "type": "document",
    "title": "Q4-2023-Business-Report.pdf",
    "full_text": "Q4 2023 BUSINESS REPORT\n\nEXECUTIVE SUMMARY\nThis quarter showed remarkable growth across all key metrics...\n\nFINANCIAL HIGHLIGHTS\n- Revenue: $2.4M (+15% YoY)\n- Gross Margin: 68%\n- Customer Acquisition Cost: $47\n\nKEY ACHIEVEMENTS\n1. Launched new product line\n2. Expanded to 3 new markets\n3. Hired 12 new team members...",
    "word_count": 1247,
    "hash": "sha256-m9n8o7p6q5r4321"
  },
  "location": {
    "inbox_path": "content/inbox/upload-2024-01-15-ghi789.pdf",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:11:20Z",
  "llm_analysis": {
    "category": "data",
    "reasoning": "This is a business report containing financial data, metrics, and performance analysis. Best categorized as data/business intelligence rather than a general document.",
    "confidence": 0.92,
    "suggested_filename": "q4-2023-business-report.pdf"
  },
  "location": {
    "final_path": "content/storage/data/q4-2023-business-report-ghi789.pdf"
  }
}
```

## 📋 Example 4: URL - YouTube Video

```json
{
  "id": "content-2024-01-15-jkl012",
  "created_at": "2024-01-15T10:15:00Z",
  "updated_at": "2024-01-15T10:15:00Z",
  "status": "inbox",
  "source": {
    "method": "url",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  "content": {
    "type": "video",
    "title": "Advanced React Patterns - Custom Hooks and Context",
    "full_text": "TRANSCRIPT:\n\n[00:00] Welcome back to React Mastery. Today we're diving into advanced patterns that will make your React applications more maintainable and performant.\n\n[00:30] Let's start with custom hooks. Custom hooks are a way to extract component logic into reusable functions...\n\n[05:45] Now let's talk about context. React Context provides a way to pass data through the component tree without having to pass props down manually at every level...\n\n[12:30] Here's a real-world example of combining custom hooks with context for state management...",
    "word_count": 2156,
    "hash": "sha256-v1w2x3y4z5a6789"
  },
  "location": {
    "inbox_path": "content/inbox/url-2024-01-15-jkl012.txt",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:16:45Z",
  "llm_analysis": {
    "category": "articles",
    "reasoning": "This is educational content about React programming concepts with detailed explanations and examples. Though originally a video, the transcript content is more suitable for the articles category as reference material.",
    "confidence": 0.89,
    "suggested_filename": "react-advanced-patterns-hooks-context.md"
  },
  "location": {
    "final_path": "content/storage/articles/react-advanced-patterns-hooks-context-jkl012.md"
  }
}
```

## 📋 Example 5: URL - News Article

```json
{
  "id": "content-2024-01-15-mno345",
  "created_at": "2024-01-15T10:20:00Z",
  "updated_at": "2024-01-15T10:20:00Z",
  "status": "inbox",
  "source": {
    "method": "url",
    "url": "https://techcrunch.com/2024/01/15/ai-breakthrough-announcement"
  },
  "content": {
    "type": "text",
    "title": "Major AI Breakthrough Announced by Research Team",
    "full_text": "Major AI Breakthrough Announced by Research Team\n\nA team of researchers at Stanford University announced today a significant breakthrough in artificial intelligence that could revolutionize how we approach machine learning.\n\nThe new technique, called 'Adaptive Neural Architecture Search' (ANAS), allows AI systems to automatically design and optimize their own neural network architectures in real-time...\n\nKey implications include:\n- 40% improvement in training efficiency\n- Reduced computational requirements\n- Better performance on complex tasks\n\nThe research paper will be published in Nature AI next month...",
    "word_count": 532,
    "hash": "sha256-b7c8d9e1f2g3456"
  },
  "location": {
    "inbox_path": "content/inbox/url-2024-01-15-mno345.txt",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:20:30Z",
  "llm_analysis": {
    "category": "articles",
    "reasoning": "This is a news article about AI research developments. Contains factual information, research findings, and implications that would be valuable for reference in the articles category.",
    "confidence": 0.94,
    "suggested_filename": "ai-breakthrough-adaptive-neural-architecture-search.md"
  },
  "location": {
    "final_path": "content/storage/articles/ai-breakthrough-adaptive-neural-architecture-search-mno345.md"
  }
}
```

## 📋 Example 6: DROP - Image File

```json
{
  "id": "content-2024-01-15-pqr678",
  "created_at": "2024-01-15T10:25:00Z",
  "updated_at": "2024-01-15T10:25:00Z",
  "status": "inbox",
  "source": {
    "method": "drop",
    "url": null
  },
  "content": {
    "type": "image",
    "title": "architecture-diagram-v2.png",
    "full_text": "IMAGE ANALYSIS:\nThis appears to be a system architecture diagram showing:\n- Frontend React application\n- Node.js backend API\n- PostgreSQL database\n- Redis cache layer\n- AWS S3 for file storage\n- Docker containers for deployment\n\nThe diagram shows data flow between components with arrows indicating request/response patterns. Color coding: blue for frontend, green for backend services, orange for databases.",
    "word_count": 58,
    "hash": "sha256-f5g6h7i8j9k0123"
  },
  "location": {
    "inbox_path": "content/inbox/drop-2024-01-15-pqr678.png",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:25:45Z",
  "llm_analysis": {
    "category": "images",
    "reasoning": "This is a technical architecture diagram that would be useful for reference and documentation purposes. Images like this are best stored in the images category for easy visual browsing.",
    "confidence": 0.97,
    "suggested_filename": "system-architecture-diagram-v2.png"
  },
  "location": {
    "final_path": "content/storage/images/system-architecture-diagram-v2-pqr678.png"
  }
}
```

## 📋 Example 7: PASTE - Quick Note

```json
{
  "id": "content-2024-01-15-stu901",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "status": "inbox",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "note",
    "title": "Remember to update the API docs before release",
    "full_text": "Remember to update the API docs before release\n\n- Add new authentication endpoints\n- Update rate limiting info\n- Fix the webhook examples\n- Check all code samples work",
    "word_count": 27,
    "hash": "sha256-k3l4m5n6o7p8901"
  },
  "location": {
    "inbox_path": "content/inbox/paste-2024-01-15-stu901.txt",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:30:15Z",
  "llm_analysis": {
    "category": "notes",
    "reasoning": "This is a short reminder/todo list rather than a full article or documentation. The brief, action-oriented format makes it perfect for the notes category.",
    "confidence": 0.99,
    "suggested_filename": "api-docs-release-checklist.md"
  },
  "location": {
    "final_path": "content/storage/notes/api-docs-release-checklist-stu901.md"
  }
}
```

## 📋 Example 8: UPLOAD - CSV Data

```json
{
  "id": "content-2024-01-15-vwx234",
  "created_at": "2024-01-15T10:35:00Z",
  "updated_at": "2024-01-15T10:35:00Z",
  "status": "inbox",
  "source": {
    "method": "upload",
    "url": null
  },
  "content": {
    "type": "data",
    "title": "user-analytics-december-2023.csv",
    "full_text": "CSV PREVIEW:\ndate,users,sessions,bounce_rate,conversion_rate\n2023-12-01,1247,1589,0.34,0.067\n2023-12-02,1356,1712,0.31,0.072\n2023-12-03,1189,1445,0.38,0.059\n...\n\nSUMMARY:\n- 31 days of user analytics data\n- Daily metrics for users, sessions, bounce rate, conversion rate\n- Average 1,298 users per day\n- Peak day: December 15th with 1,847 users\n- Lowest bounce rate: 0.28 on December 22nd",
    "word_count": 89,
    "hash": "sha256-q8r9s1t2u3v4567"
  },
  "location": {
    "inbox_path": "content/inbox/upload-2024-01-15-vwx234.csv",
    "final_path": null
  },
  "llm_analysis": null
}
```

**After LLM Processing:**
```json
{
  "status": "stored",
  "updated_at": "2024-01-15T10:35:30Z",
  "llm_analysis": {
    "category": "data",
    "reasoning": "This is structured analytics data in CSV format containing quantitative metrics. Best suited for the data category where it can be easily found for analysis and reporting purposes.",
    "confidence": 0.96,
    "suggested_filename": "user-analytics-december-2023.csv"
  },
  "location": {
    "final_path": "content/storage/data/user-analytics-december-2023-vwx234.csv"
  }
}
```

## 🎯 Pattern Summary

### Content Type Detection
- **text**: Articles, blog posts, documentation (>100 words)
- **note**: Short reminders, todos, quick thoughts (<100 words)
- **code**: Code snippets, functions, scripts (contains code patterns)
- **document**: PDFs, Word docs (binary files with extracted text)
- **image**: PNG, JPG, screenshots (with AI description)
- **video**: Video files or video transcripts
- **data**: CSV, JSON, spreadsheets (structured data)

### LLM Categorization Logic
- **articles**: Long-form content, tutorials, documentation
- **notes**: Short thoughts, reminders, quick captures
- **code**: Programming-related content, scripts, configs
- **images**: Visual content, diagrams, screenshots
- **data**: Structured data, analytics, reports

### Filename Patterns
- **Articles**: `descriptive-title-{id}.md`
- **Code**: `function-name-{id}.js` or `descriptive-name-{id}.py`
- **Images**: `descriptive-name-{id}.png`
- **Data**: `original-filename-{id}.csv`
- **Notes**: `brief-description-{id}.md`

This gives the LLM clear patterns to follow for consistent categorization!