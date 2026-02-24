export type SupportTier = 'Basic' | 'Premium' | 'Enterprise';

export interface Client {
  luidId: string;
  passwordHash: string;
  createdAt: string;
  tier?: SupportTier;
  clientName?: string;
}

export interface Staff {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface Admin {
  username: string;
  passwordHash: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: 'client' | 'staff' | 'admin';
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  luidId: string;
  subject: string;
  messages: Message[];
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  luidId: string;
  sender: string;
  senderType: 'client' | 'staff' | 'admin';
  content: string;
  timestamp: string;
}

export type UserType = 'client' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  userType: UserType;
  displayName: string;
}
