// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

/** Raw response from POST Auth/login */
export interface LoginResponse {
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Decoded JWT claims we care about */
export interface JwtClaims {
  sub: string;   // userId
  email: string;
  exp: number;
}

// ─── User ────────────────────────────────────────────────────────────────────

/** Response from GET User/profile */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  createdAt: string;
}

// ─── Behavior analysis ───────────────────────────────────────────────────────

export interface BehaviorAnalysis {
  analysis: {
    tone: string;
    writingStyle: string;
    sentimentPatterns: {
      positivityRatio: number;
      negativityRatio: number;
    };
    strictnessEstimate: number;
    positivityBias: number;
    emotionalConsistency: number;
    enthusiasmScore: number;
    sarcasmLikelihood: number;
    complaintFrequency: number;
    contextualPreferences: string[];
  };
  summary: string;
}

// ─── Conversations ───────────────────────────────────────────────────────────

/** role: 0 = user, 2 = assistant */
export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 0 | 1 | 2;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  startedAt: string;
  title?: string;
  messages: ConversationMessage[];
}

// ─── Parsed AI response ──────────────────────────────────────────────────────

/**
 * The AI returns arbitrary JSON with varying keys per request, so we use a
 * fully open recursive type rather than hard-coding field names.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface ParsedAIResponse {
  /** Every top-level section (goals, preferences, constraints, domains, …) */
  sections: { label: string; entries: { key: string; value: string }[] }[];
  /** The contextSummary text, lifted to the top level for easy access */
  contextSummary?: string;
  /** emotion field */
  emotion?: string;
}

// ─── Generic error ───────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  stack?: string;
}

