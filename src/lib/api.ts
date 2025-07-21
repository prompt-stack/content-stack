const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3457';
console.log('API_BASE configured as:', API_BASE); // Debug log

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    // Try to parse error message from response body
    let errorMessage = `API Error: ${response.statusText}`;
    if (isJson) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parse errors
      }
    }
    throw new ApiError(response.status, errorMessage);
  }
  
  if (isJson) {
    return response.json();
  }
  
  throw new Error('Response is not JSON');
}

export const api = {
  get: async <T = any>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE}${path}`);
    return handleResponse<T>(response);
  },
  
  post: async <T = any>(path: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<T>(response);
  },
  
  put: async <T = any>(path: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<T>(response);
  },
  
  delete: async <T = any>(path: string): Promise<T> => {
    const fullUrl = `${API_BASE}${path}`;
    console.log('DELETE request to:', fullUrl);
    const response = await fetch(fullUrl, {
      method: 'DELETE'
    });
    console.log('DELETE response status:', response.status);
    return handleResponse<T>(response);
  },

  // Special method for file uploads
  upload: async <T = any>(path: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body: formData // Don't set Content-Type, let browser set it with boundary
    });
    return handleResponse<T>(response);
  }
};

// Export the API base URL for cases where direct access is needed
export const getApiUrl = () => API_BASE;

// Export the error class for type checking
export { ApiError };