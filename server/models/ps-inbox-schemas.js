export const InboxItemSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^[a-zA-Z0-9\-_]+$/
  },
  filename: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: false
  },
  metadata: {
    type: 'object',
    required: false
  }
};

export const CreateTextItemRequest = {
  content: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 1000000
  },
  source: {
    type: 'string',
    required: false,
    enum: ['paste', 'manual', 'api'],
    default: 'paste'
  }
};

export const UpdateItemRequest = {
  title: {
    type: 'string',
    required: false,
    maxLength: 200
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 1000
  },
  tags: {
    type: 'array',
    required: false,
    items: {
      type: 'string',
      maxLength: 50
    }
  },
  status: {
    type: 'string',
    required: false,
    enum: ['raw', 'processed', 'archived']
  }
};

export const LinkItemsRequest = {
  targetId: {
    type: 'string',
    required: true,
    pattern: /^[a-zA-Z0-9\-_]+$/
  },
  linkType: {
    type: 'string',
    required: false,
    enum: ['related', 'describes', 'uploaded_with'],
    default: 'related'
  }
};

export const ExtractURLRequest = {
  url: {
    type: 'string',
    required: true,
    format: 'url'
  },
  platform: {
    type: 'string',
    required: false,
    enum: ['youtube', 'tiktok', 'reddit', 'article']
  }
};

export const PrepareRequest = {
  format: {
    type: 'string',
    required: false,
    enum: ['markdown', 'json', 'text'],
    default: 'markdown'
  },
  includeMetadata: {
    type: 'boolean',
    required: false,
    default: true
  }
};

export const ErrorResponse = {
  error: {
    type: 'string',
    required: true
  },
  details: {
    type: 'object',
    required: false
  }
};

export const SuccessResponse = {
  success: {
    type: 'boolean',
    required: true
  },
  message: {
    type: 'string',
    required: false
  },
  data: {
    type: 'object',
    required: false
  }
};