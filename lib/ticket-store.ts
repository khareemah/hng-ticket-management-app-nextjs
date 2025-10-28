export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "ticketapp_tickets";

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  const tickets = localStorage.getItem(STORAGE_KEY);
  return tickets ? JSON.parse(tickets) : [];
}

export function createTicket(
  ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">
): Ticket {
  const newTicket: Ticket = {
    ...ticket,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tickets = getTickets();
  tickets.push(newTicket);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  return newTicket;
}

export function updateTicket(
  id: string,
  updates: Partial<Omit<Ticket, "id" | "createdAt">>
): Ticket | null {
  const tickets = getTickets();
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) return null;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  return tickets[index];
}

export function deleteTicket(id: string): boolean {
  const tickets = getTickets();
  const filtered = tickets.filter((t) => t.id !== id);

  if (filtered.length === tickets.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getTicketStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}
