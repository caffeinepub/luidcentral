import type { Client, Staff, Admin, Ticket, ChatMessage, Message, SupportTier } from '../types/db';

// Simple hash function (not cryptographic, just for demo purposes)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function hashPassword(password: string): string {
  return simpleHash(password + 'luidcentral_salt_2024');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ─── Clients ────────────────────────────────────────────────────────────────

const CLIENTS_KEY = 'luidcentral_clients';

export function getClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function createClient(luidId: string, password: string): Client | null {
  const clients = getClients();
  if (clients.find((c) => c.luidId === luidId)) return null;
  const client: Client = {
    luidId,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    tier: 'Basic',
  };
  clients.push(client);
  saveClients(clients);
  return client;
}

export function findClient(luidId: string): Client | undefined {
  return getClients().find((c) => c.luidId === luidId);
}

export function deleteClient(luidId: string): void {
  const clients = getClients().filter((c) => c.luidId !== luidId);
  saveClients(clients);
}

export function updateClientTier(luidId: string, tier: SupportTier): Client | null {
  const clients = getClients();
  const idx = clients.findIndex((c) => c.luidId === luidId);
  if (idx === -1) return null;
  clients[idx].tier = tier;
  saveClients(clients);
  return clients[idx];
}

export function validateClientLogin(luidId: string, password: string): Client | null {
  const client = findClient(luidId);
  if (!client) return null;
  if (!verifyPassword(password, client.passwordHash)) return null;
  return client;
}

// ─── Staff ──────────────────────────────────────────────────────────────────

const STAFF_KEY = 'luidcentral_staff';

export function getStaff(): Staff[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStaff(staff: Staff[]): void {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function createStaffMember(username: string, password: string, role: string = 'support'): Staff | null {
  const staff = getStaff();
  if (staff.find((s) => s.username === username)) return null;
  const member: Staff = {
    id: generateId(),
    username,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  };
  staff.push(member);
  saveStaff(staff);
  return member;
}

export function validateStaffLogin(username: string, password: string): Staff | null {
  const staff = getStaff();
  const member = staff.find((s) => s.username === username);
  if (!member) return null;
  if (!verifyPassword(password, member.passwordHash)) return null;
  return member;
}

export function deleteStaffMember(id: string): void {
  const staff = getStaff().filter((s) => s.id !== id);
  saveStaff(staff);
}

// ─── Admins ─────────────────────────────────────────────────────────────────

const ADMINS_KEY = 'luidcentral_admins';

function getAdmins(): Admin[] {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAdmins(admins: Admin[]): void {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

export function validateAdminLogin(username: string, password: string): Admin | null {
  const admins = getAdmins();
  const admin = admins.find((a) => a.username === username);
  if (!admin) return null;
  if (!verifyPassword(password, admin.passwordHash)) return null;
  return admin;
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

const TICKETS_KEY = 'luidcentral_tickets';

export function getTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets: Ticket[]): void {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function getTicketsByLuidId(luidId: string): Ticket[] {
  return getTickets().filter((t) => t.luidId === luidId);
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function createTicket(luidId: string, subject: string, initialMessage: string, senderName: string): Ticket {
  const tickets = getTickets();
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: generateId(),
    luidId,
    subject,
    messages: [
      {
        id: generateId(),
        sender: senderName,
        senderType: 'client',
        content: initialMessage,
        timestamp: now,
      },
    ],
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };
  tickets.push(ticket);
  saveTickets(tickets);
  return ticket;
}

export function addMessageToTicket(
  ticketId: string,
  sender: string,
  senderType: 'client' | 'staff' | 'admin',
  content: string
): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const message: Message = {
    id: generateId(),
    sender,
    senderType,
    content,
    timestamp: now,
  };
  tickets[idx].messages.push(message);
  tickets[idx].updatedAt = now;
  saveTickets(tickets);
  return tickets[idx];
}

export function updateTicketStatus(ticketId: string, status: 'open' | 'resolved'): void {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();
  saveTickets(tickets);
}

export function deleteTicket(ticketId: string): void {
  const tickets = getTickets().filter((t) => t.id !== ticketId);
  saveTickets(tickets);
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

const CHAT_KEY = 'luidcentral_chat_messages';

export function getChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

export function getChatMessagesByLuidId(luidId: string): ChatMessage[] {
  return getChatMessages().filter((m) => m.luidId === luidId);
}

export function sendChatMessage(
  luidId: string,
  sender: string,
  senderType: 'client' | 'staff' | 'admin',
  content: string
): ChatMessage {
  const messages = getChatMessages();
  const msg: ChatMessage = {
    id: generateId(),
    luidId,
    sender,
    senderType,
    content,
    timestamp: new Date().toISOString(),
  };
  messages.push(msg);
  saveChatMessages(messages);
  return msg;
}

export function deleteChatMessage(id: string): void {
  const messages = getChatMessages().filter((m) => m.id !== id);
  saveChatMessages(messages);
}

// ─── Chat Status ─────────────────────────────────────────────────────────────

const CHAT_STATUS_KEY = 'chat_status';

export function getChatStatus(): 'Online' | 'Offline' {
  const val = localStorage.getItem(CHAT_STATUS_KEY);
  return val === 'Offline' ? 'Offline' : 'Online';
}

export function setChatStatus(status: 'Online' | 'Offline'): void {
  localStorage.setItem(CHAT_STATUS_KEY, status);
}

// ─── Initialization ──────────────────────────────────────────────────────────

export function initializeDB(): void {
  const admins = getAdmins();
  if (!admins.find((a) => a.username === 'SidneiCosta00')) {
    admins.push({
      username: 'SidneiCosta00',
      passwordHash: hashPassword('Nikebolado@4'),
    });
    saveAdmins(admins);
  }
}
