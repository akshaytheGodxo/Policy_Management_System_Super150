const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const creds = localStorage.getItem("auth_creds");
  if (!creds) return {};
  return { Authorization: `Basic ${creds}` };
}

export function getCredentials(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_creds");
}

export function setCredentials(email: string, password: string): void {
  const encoded = btoa(`${email}:${password}`);
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_creds", encoded);
  }
}

export function clearCredentials(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_creds");
    localStorage.removeItem("user");
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `Request failed: ${res.status}` }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export interface User {
  id: number;
  email: string;
  name: string;
  age: number | null;
  smoker: boolean | null;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  basePremium: string;
  type: string;
  coverageAmount: string | null;
}

export interface Policy {
  id: number;
  policyNumber: string;
  userName: string;
  productName: string;
  premium: string;
  startDate: string;
  endDate: string;
  status: string;
  pdfPath: string | null;
}

export interface Claim {
  id: number;
  policyNumber: string;
  userName: string;
  description: string | null;
  claimAmount: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

export interface PremiumResponse {
  basePremium: string;
  ageSurcharge: string;
  smokerSurcharge: string;
  coverageSurcharge: string;
  sportsVehicleSurcharge: string;
  finalPremium: string;
}
