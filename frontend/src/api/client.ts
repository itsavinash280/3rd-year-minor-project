const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const token = localStorage.getItem('asraverse_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await res.text();
    let data: any = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn(`[API] Received non-JSON response from ${endpoint}:`, text.slice(0, 100));
        return {
          success: false,
          message: res.status >= 500
            ? 'Backend server error. Please ensure the backend server is running.'
            : `Server returned non-JSON response (${res.status} ${res.statusText})`,
        };
      }
    } else {
      if (!res.ok) {
        return {
          success: false,
          message: `Backend server error (${res.status} ${res.statusText}). Is the backend running?`,
        };
      }
    }

    if (!res.ok && data && !data.message) {
      data.message = `Request failed with status ${res.status}`;
      data.success = false;
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    return {
      success: false,
      message: error.message?.includes('Failed to fetch')
        ? 'Cannot connect to backend server. Please make sure backend is running on http://localhost:5000.'
        : error.message || 'Failed to connect to backend server',
    };
  }
}
