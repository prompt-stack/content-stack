# Tag and Title Flow

## How Tags and Titles Work

### Initial State (Raw)
```json
{
  "title": "content-1753319664670-46u6y7",  // System default from filename
  "filename": "content-1753319664670-46u6y7.js",
  "user_tags": [],
  "llm_analysis": null
}
```

### After LLM Enrichment
```json
{
  "title": "content-1753319664670-46u6y7",  // Still the same
  "filename": "content-1753319664670-46u6y7.js",
  "user_tags": [],
  "llm_analysis": {
    "title": "Data Structures & JSON for Non-Technical Builders",  // LLM suggestion
    "tags": ["data-structures", "json", "api", "tutorial"],       // LLM tags
    "category": "education"
  }
}
```

### After User Adds Tags
```json
{
  "title": "content-1753319664670-46u6y7",
  "filename": "content-1753319664670-46u6y7.js",
  "user_tags": ["important", "to-review"],  // User's personal tags
  "llm_analysis": {
    "title": "Data Structures & JSON for Non-Technical Builders",
    "tags": ["data-structures", "json", "api", "tutorial"],
    "category": "education"
  }
}
```

### Display Logic

**Title Display:**
- Shows: `title` field (system field)
- Suggests: `llm_analysis.title` as an improvement
- User can accept suggestion to update the main title

**Tags Display:**
- Shows combined: `user_tags + llm_analysis.tags`
- In UI: ["important", "to-review", "data-structures", "json", "api", "tutorial"]
- Different colors/icons for user vs AI tags

**Search:**
- Searches across both tag arrays
- Searches both titles (system and suggested)

### User Accepts LLM Title Suggestion
```json
{
  "title": "Data Structures & JSON for Non-Technical Builders",  // Updated!
  "filename": "data-structures-json-non-technical-builders.js",  // Updated!
  "user_tags": ["important", "to-review"],
  "llm_analysis": {
    "title": "Data Structures & JSON for Non-Technical Builders",
    "tags": ["data-structures", "json", "api", "tutorial"],
    "category": "education"
  }
}
```

## Benefits of This Approach

1. **Clear Ownership**: 
   - User tags = personal organization
   - LLM tags = content-based suggestions

2. **Non-Destructive**: 
   - LLM never overwrites user data
   - Original filename preserved in history

3. **Flexible Display**:
   - Can show/hide AI suggestions
   - Can filter by tag source
   - Can accept/reject individually

4. **Better UX**:
   - Users see their tags aren't touched by AI
   - AI suggestions are clearly marked
   - Easy to bulk-accept AI suggestions