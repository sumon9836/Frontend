// Use our proxy server to avoid CORS issues
const API_BASE_URL = "/api";

export interface PairResponse {
  number: string;
  code?: string;
  status?: string;
  error?: string;
}

export interface SessionStatus {
  connected: boolean;
  user: string;
}

export interface SessionsResponse {
  active: string[];
  status: Record<string, SessionStatus>;
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw new Error(`Network error: Unable to connect to API server`);
    }
  }

  // Pair WhatsApp number
  async pairNumber(phoneNumber: string): Promise<PairResponse> {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    return this.request<PairResponse>(`/pair?number=${cleanNumber}`);
  }

  // Get active sessions
  async getSessions(): Promise<SessionsResponse> {
    return this.request<SessionsResponse>("/sessions");
  }

  // Get blocked users list
  async getBlocklist(): Promise<Record<string, { blocked: boolean }>> {
    return this.request<Record<string, { blocked: boolean }>>("/blocklist");
  }

  // Block user (admin only)
  async blockUser(phoneNumber: string): Promise<ApiResponse> {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    return this.request<ApiResponse>(`/block?number=${cleanNumber}`);
  }

  // Unblock user (admin only)
  async unblockUser(phoneNumber: string): Promise<ApiResponse> {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    return this.request<ApiResponse>(`/unblock?number=${cleanNumber}`);
  }

  // Delete session (admin only)
  async deleteSession(phoneNumber: string): Promise<ApiResponse> {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    return this.request<ApiResponse>(`/delete?number=${cleanNumber}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper functions to transform API data to our component types
export const transformSessionsData = (sessionsData: SessionsResponse) => {
  return sessionsData.active.map((phoneNumber) => {
    const status = sessionsData.status[phoneNumber];
    return {
      id: phoneNumber,
      phoneNumber: phoneNumber,
      status: status?.connected ? "connected" : "disconnected",
      pairingCode: null,
      lastSeen: status?.connected ? new Date() : null,
      createdAt: new Date(),
    };
  });
};

export const transformBlocklistData = (blocklistData: Record<string, { blocked: boolean }>) => {
  return Object.entries(blocklistData).map(([phoneNumber, data]) => ({
    id: phoneNumber,
    phoneNumber: phoneNumber,
    blockedAt: new Date(),
    reason: "Blocked by admin",
  }));
};

// Check if user is banned (for banned page)
export const checkUserBanned = async (phoneNumber: string): Promise<boolean> => {
  try {
    const blocklist = await apiClient.getBlocklist();
    return !!blocklist[phoneNumber.replace(/[^0-9]/g, "")]?.blocked;
  } catch (error) {
    console.error("Error checking ban status:", error);
    return false;
  }
};