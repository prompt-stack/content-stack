/**
 * @file features/content-inbox/components/ContentInboxTagEditor.tsx
 * @purpose [TODO: Add purpose]
 * @layer feature
 * @deps none
 * @used-by [ContentInboxQueuePanel]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, KeyboardEvent } from 'react';

interface ContentInboxTagEditorProps {
  tags: string[];
  onUpdate: (tags: string[]) => void;
}

export function ContentInboxTagEditor({ tags, onUpdate }: ContentInboxTagEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (keepInputOpen = false) => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onUpdate([...tags, trimmedTag]);
    }
    setNewTag('');
    if (!keepInputOpen) {
      setIsAdding(false);
    }
  };
  
  const handleAddMultipleTags = (input: string) => {
    const newTags = input
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !tags.includes(tag));
    
    if (newTags.length > 0) {
      onUpdate([...tags, ...newTags]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(true); // Keep input open for continuous adding
    } else if (e.key === 'Escape') {
      setNewTag('');
      setIsAdding(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if user typed a comma
    if (value.includes(',')) {
      // Handle multiple tags if pasted
      const beforeComma = value.substring(0, value.lastIndexOf(','));
      if (beforeComma.includes(',')) {
        handleAddMultipleTags(beforeComma);
        setNewTag('');
      } else if (beforeComma.trim()) {
        // Single tag before comma
        setNewTag(beforeComma);
        handleAddTag(true);
      }
    } else {
      setNewTag(value);
    }
  };

  return (
    <>
      {tags.map(tag => (
        <span key={tag} className="badge badge--tag badge--sm" style={{ marginRight: '4px' }}>
          {tag}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveTag(tag);
            }}
            style={{ marginLeft: '4px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
          >
            ×
          </button>
        </span>
      ))}
      {isAdding ? (
        <input
          type="text"
          value={newTag}
          onChange={handleInputChange}
          onBlur={() => handleAddTag(false)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="content-inbox__tag-input"
          autoFocus
        />
      ) : (
        <button
          onClick={(e) => {
            console.log('Add tag clicked');
            e.preventDefault();
            e.stopPropagation();
            setIsAdding(true);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="badge badge--tag badge--sm content-inbox__add-tag"
          type="button"
          style={{ position: 'relative', zIndex: 100 }}
        >
          + Add tag
        </button>
      )}
    </>
  );
}
