const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apexsim-backend.onrender.com/api";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    console.log(`[API] Request: ${options.method || 'GET'} ${endpoint}`, options.body ? JSON.parse(options.body as string) : '');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[API] Error ${response.status} on ${endpoint}:`, errorData);
            throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json();
        console.log(`[API] Success ${endpoint}:`, data);
        return data;
    } catch (err: any) {
        console.error(`[API] Fetch Failure on ${endpoint}:`, err.message);
        throw err;
    }
};
