/**
 * @file server/routes/inbox.js
 * @purpose Server-side inbox logic
 * @layer backend
 * @deps [import multer from 'multer';, import os from 'os';, import path from 'path';, import { PSInboxValidator } from '../services/ps-inbox-validator.js';, import { Router } from 'express';, import { extractContent } from '../extractors.js';, import { inboxService } from '../services/ps-inbox-service.js';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { inboxService } from '../services/ps-inbox-service.js';
import { PSInboxValidator } from '../services/ps-inbox-validator.js';
import { extractContent } from '../extractors.js';

const router = Router();
const validator = new PSInboxValidator();

const upload = multer({
  dest: path.join(os.tmpdir(), 'uploads'),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all items
router.get('/items', asyncHandler(async (req, res) => {
  const { status } = req.query;
  const items = await inboxService.getItems({ status });
  res.json({ items });
}));

// Get single item
router.get('/items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await inboxService.getItem(id);
  res.json(item);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { content, source = 'paste' } = req.body;
  
  const validation = validator.validateTextContent(content);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const result = await inboxService.createTextItem(content, source);
  
  if (!result.success) {
    return res.status(409).json(result);
  }

  res.status(201).json(result);
}));

router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  
  const validation = validator.validateFileUpload(file);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const result = await inboxService.createFileItem(file);
  
  if (!result.success) {
    return res.status(409).json(result);
  }

  res.status(201).json(result);
}));

router.post('/extract', asyncHandler(async (req, res) => {
  const { url, platform } = req.body;
  
  const validation = validator.validateExtractRequest(url, platform);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const result = await extractContent(url);
  
  if (!result.success) {
    return res.status(400).json({ 
      error: result.error || 'Extraction failed' 
    });
  }

  const { content, metadata: extractedMetadata } = result;
  const source = extractedMetadata?.platform || 'url';
  
  const saveResult = await inboxService.createTextItem(content, `url-${source}`);
  
  if (!saveResult.success) {
    return res.status(409).json(saveResult);
  }

  res.status(201).json({
    ...saveResult,
    extractedMetadata
  });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await inboxService.deleteItem(id);
  res.json(result);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const result = await inboxService.updateItem(id, updates);
  res.json(result);
}));

router.post('/link', asyncHandler(async (req, res) => {
  const { sourceId, targetId, linkType = 'related' } = req.body;
  
  if (!sourceId || !targetId) {
    return res.status(400).json({ 
      error: 'Both sourceId and targetId are required' 
    });
  }

  const result = await inboxService.linkItems(sourceId, targetId, linkType);
  res.json(result);
}));

router.post('/prepare', asyncHandler(async (req, res) => {
  const options = req.body || {};
  
  const validation = validator.validatePrepareRequest(options);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const result = await inboxService.prepareForProcessing(options);
  res.json(result);
}));

router.post('/:id/process-manually', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await inboxService.processManually(id);
  
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
}));

router.use((error, req, res, next) => {
  console.error('Inbox route error:', error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

export default router;
