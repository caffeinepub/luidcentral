import { useState, useEffect, useCallback, useRef } from 'react';
import { getTickets, getChatMessages } from '../lib/db';
import type { Ticket, ChatMessage } from '../types/db';

interface NotificationCounts {
  tickets: number;
  chat: number;
}

interface UseNotificationsOptions {
  role: 'client' | 'staff' | 'master';
  clientId?: string;
  pollInterval?: number;
}

export function useNotifications({ role, clientId, pollInterval = 4000 }: UseNotificationsOptions) {
  const [counts, setCounts] = useState<NotificationCounts>({ tickets: 0, chat: 0 });
  const lastTicketsRef = useRef<string>('');
  const lastChatRef = useRef<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clearTicketNotifications = useCallback(() => {
    setCounts(prev => ({ ...prev, tickets: 0 }));
  }, []);

  const clearChatNotifications = useCallback(() => {
    setCounts(prev => ({ ...prev, chat: 0 }));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(() => {
    const getRelevant = () => {
      const allTickets = getTickets();
      const allChats = getChatMessages();

      let relevantTickets: Ticket[];
      let relevantChats: ChatMessage[];

      if (role === 'client' && clientId) {
        // Ticket uses luidId, ChatMessage uses luidId
        relevantTickets = allTickets.filter(t => t.luidId === clientId);
        relevantChats = allChats.filter(c => c.luidId === clientId);
      } else {
        relevantTickets = allTickets;
        relevantChats = allChats;
      }

      return { relevantTickets, relevantChats };
    };

    const check = () => {
      const { relevantTickets, relevantChats } = getRelevant();

      const ticketSig = JSON.stringify(
        relevantTickets.map(t => ({ id: t.id, msgs: t.messages.length, status: t.status }))
      );
      const chatSig = JSON.stringify(
        relevantChats.map(c => ({ id: c.id, sender: c.sender, ts: c.timestamp }))
      );

      if (lastTicketsRef.current && lastTicketsRef.current !== ticketSig) {
        const prevData = JSON.parse(lastTicketsRef.current) as { id: string; msgs: number; status: string }[];
        const currData = JSON.parse(ticketSig) as { id: string; msgs: number; status: string }[];

        let newCount = 0;
        currData.forEach(curr => {
          const prev = prevData.find(p => p.id === curr.id);
          if (!prev) {
            newCount++;
          } else if (curr.msgs > prev.msgs) {
            newCount++;
          }
        });

        if (newCount > 0) {
          setCounts(prev => ({ ...prev, tickets: prev.tickets + newCount }));
          if (role === 'client') {
            showToast('Nova resposta no seu ticket!');
          } else {
            showToast(`${newCount} nova(s) atividade(s) em tickets`);
          }
        }
      }

      if (lastChatRef.current && lastChatRef.current !== chatSig) {
        const prevIds = new Set(
          (JSON.parse(lastChatRef.current) as { id: string }[]).map(c => c.id)
        );
        const currData = JSON.parse(chatSig) as { id: string; sender: string; senderType?: string }[];
        const newMsgs = currData.filter(c => !prevIds.has(c.id));

        let relevantNew = newMsgs;
        if (role === 'client') {
          // Client only cares about staff/admin replies
          relevantNew = newMsgs.filter(m => m.sender !== clientId);
        } else {
          // Staff/master only care about client messages
          relevantNew = newMsgs.filter(m => m.senderType === 'client');
        }

        if (relevantNew.length > 0) {
          setCounts(prev => ({ ...prev, chat: prev.chat + relevantNew.length }));
          showToast(`${relevantNew.length} nova(s) mensagem(ns) no chat`);
        }
      }

      lastTicketsRef.current = ticketSig;
      lastChatRef.current = chatSig;
    };

    // Initialize refs without triggering notifications
    const { relevantTickets, relevantChats } = getRelevant();

    lastTicketsRef.current = JSON.stringify(
      relevantTickets.map(t => ({ id: t.id, msgs: t.messages.length, status: t.status }))
    );
    lastChatRef.current = JSON.stringify(
      relevantChats.map(c => ({ id: c.id, sender: c.sender, ts: c.timestamp }))
    );

    const interval = setInterval(check, pollInterval);
    return () => clearInterval(interval);
  }, [role, clientId, pollInterval, showToast]);

  return {
    counts,
    toastMessage,
    clearTicketNotifications,
    clearChatNotifications,
  };
}
