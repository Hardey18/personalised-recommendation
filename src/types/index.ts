export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message: string;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  stack?: string;
}

// Mock types for recommendations until API is ready
export interface Recommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  score: number;
  tags: string[];
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  context?: string;
  timestamp: string;
  resultsCount: number;
  recommendations: Recommendation[];
  domain?: string;
}