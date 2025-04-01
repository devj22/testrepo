import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuthHeader } from "./auth";

// Helper to determine if we're in production or development
const isProd = import.meta.env.PROD;

// Use the proper base URL depending on environment
const getBaseUrl = () => {
  return isProd ? '' : '';
};

// Transform an API URL to include the proper prefix in production
export const getApiUrl = (path: string): string => {
  const apiPath = path.startsWith('/api') ? path : `/api${path}`;
  
  if (isProd) {
    // In production, use the Netlify functions path
    return `/.netlify/functions/api${apiPath.replace('/api', '')}`;
  }
  
  // In development, use the path as is
  return apiPath;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const apiUrl = getApiUrl(url);
  const authHeader = getAuthHeader();
  
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...authHeader
  };

  const res = await fetch(apiUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const apiUrl = getApiUrl(url);
    const authHeader = getAuthHeader();
    
    const res = await fetch(apiUrl, {
      credentials: "include",
      headers: {
        ...authHeader
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
