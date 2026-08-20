import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ChatThread, ChatMessage, Property } from '../types/property';

interface ChatContextType {
  threads: ChatThread[];
  activeThread: ChatThread | null;
  activeThreadId: string | null;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  openChatForProperty: (property: Property, initialGreeting?: string) => void;
  selectThread: (threadId: string) => void;
  sendMessage: (text: string) => void;
  sendOffer: (amount: number) => void;
  scheduleVisit: (date: string, timeSlot: string, type: 'Physical Visit' | 'Video Tour') => void;
  totalUnreadCount: number;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-dlf-crest',
    propertyId: 'prop-dlf-crest-gurgaon',
    propertyTitle: 'Ultra-Luxury 4 BHK Park View Residence in DLF 5',
    propertyPrice: '₹8.85 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    propertyLocality: 'Golf Course Road, Gurugram',
    participant: {
      id: 'owner-rajiv-sharma',
      name: 'Rajiv Sharma',
      role: 'Owner',
      phoneMasked: '+91 9810X XXXXX',
      phoneFull: '+91 98101 23890',
      email: 'rajiv.sharma.dlf@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      responseRate: '98%',
      responseTime: 'Under 10 mins',
      isVerified: true,
      memberSince: 'Mar 2022',
      listingsCount: 2,
    },
    encryptionFingerprint: 'AES-256-GCM • Fingerprint: 4E:7B:A2:89:D3:91',
    unreadCount: 1,
    lastMessageAt: '12:45 PM',
    messages: [
      {
        id: 'msg-1',
        threadId: 'thread-dlf-crest',
        senderId: 'user-delhi-01',
        senderName: 'Rohan Mehra',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isMe: true,
        text: 'Hello Rajiv ji, is this DLF The Crest 4 BHK still available? Are the 3 parking spots included in the price?',
        timestamp: '12:40 PM',
        isEncrypted: true,
      },
      {
        id: 'msg-2',
        threadId: 'thread-dlf-crest',
        senderId: 'owner-rajiv-sharma',
        senderName: 'Rajiv Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isMe: false,
        text: 'Namaste Rohan! Yes, the flat is available directly from me (no brokers). All 3 stilt parking slots and club membership are included in the price. Would you like to view it this weekend?',
        timestamp: '12:45 PM',
        isEncrypted: true,
      },
    ],
  },
  {
    id: 'thread-hauz-khas',
    propertyId: 'prop-hauz-khas-rent-delhi',
    propertyTitle: 'Sunny 2 BHK Designer Studio Flat in Hauz Khas',
    propertyPrice: '₹48,000 / mo',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    propertyLocality: 'Hauz Khas Enclave, South Delhi',
    participant: {
      id: 'owner-priya-kapoor',
      name: 'Priya Kapoor',
      role: 'Owner',
      phoneMasked: '+91 9999X XXXXX',
      phoneFull: '+91 99990 44123',
      email: 'priyakapoor.hk@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      responseRate: '95%',
      responseTime: 'Within 30 mins',
      isVerified: true,
      memberSince: 'Aug 2023',
      listingsCount: 1,
    },
    encryptionFingerprint: 'AES-256-GCM • Fingerprint: 9A:1C:3F:82:11:EB',
    unreadCount: 0,
    lastMessageAt: 'Yesterday',
    messages: [
      {
        id: 'msg-hk-1',
        threadId: 'thread-hauz-khas',
        senderId: 'user-delhi-01',
        senderName: 'Rohan Mehra',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isMe: true,
        text: 'Hi Priya, does the rent include maintenance, and are pets allowed?',
        timestamp: 'Yesterday, 4:10 PM',
        isEncrypted: true,
      },
      {
        id: 'msg-hk-2',
        threadId: 'thread-hauz-khas',
        senderId: 'owner-priya-kapoor',
        senderName: 'Priya Kapoor',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        isMe: false,
        text: 'Hi Rohan! Maintenance is ₹2,000 extra per month. And yes, pets are very welcome!',
        timestamp: 'Yesterday, 4:18 PM',
        isEncrypted: true,
      },
    ],
  },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('ekthikana_chats');
    return saved ? JSON.parse(saved) : INITIAL_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ekthikana_chats', JSON.stringify(threads));
  }, [threads]);

  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  const totalUnreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  const selectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    // Mark thread as read
    setThreads(prev =>
      prev.map(t => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  const openChatForProperty = (property: Property, initialGreeting?: string) => {
    let thread = threads.find(t => t.propertyId === property.id);

    if (!thread) {
      const newThreadId = `thread-${property.id}-${Date.now()}`;
      const newThread: ChatThread = {
        id: newThreadId,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.priceDisplay,
        propertyImage: property.images[0] || '',
        propertyLocality: `${property.locality}, ${property.region}`,
        participant: property.owner,
        encryptionFingerprint: `AES-256-GCM • Fingerprint: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        unreadCount: 0,
        lastMessageAt: 'Just now',
        messages: initialGreeting
          ? [
              {
                id: `msg-${Date.now()}`,
                threadId: newThreadId,
                senderId: 'user-delhi-01',
                senderName: 'Rohan Mehra',
                senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                isMe: true,
                text: initialGreeting,
                timestamp: 'Just now',
                isEncrypted: true,
              },
            ]
          : [],
      };

      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThreadId);
    } else {
      setActiveThreadId(thread.id);
      if (initialGreeting) {
        sendMessage(initialGreeting);
      }
    }

    setIsChatOpen(true);
  };

  const sendMessage = (text: string) => {
    if (!activeThreadId || !text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: activeThreadId,
      senderId: 'user-delhi-01',
      senderName: 'Rohan Mehra',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isMe: true,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, newMessage],
            lastMessageAt: 'Just now',
          };
        }
        return t;
      })
    );

    // Realistic smart simulated reply from owner
    setTimeout(() => {
      simulateOwnerResponse(activeThreadId, text);
    }, 1800);
  };

  const sendOffer = (amount: number) => {
    if (!activeThreadId) return;

    const formattedAmount = amount >= 10000000 
      ? `₹${(amount / 10000000).toFixed(2)} Cr`
      : amount >= 100000
      ? `₹${(amount / 100000).toFixed(2)} Lakhs`
      : `₹${amount.toLocaleString('en-IN')}`;

    const offerMessage: ChatMessage = {
      id: `msg-offer-${Date.now()}`,
      threadId: activeThreadId,
      senderId: 'user-delhi-01',
      senderName: 'Rohan Mehra',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isMe: true,
      text: `Official Direct Offer submitted: ${formattedAmount}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      offer: {
        amount,
        status: 'pending',
      },
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, offerMessage],
            lastMessageAt: 'Just now',
          };
        }
        return t;
      })
    );

    setTimeout(() => {
      const currentThread = threads.find(t => t.id === activeThreadId);
      const ownerName = currentThread?.participant.name || 'Owner';
      const autoReply: ChatMessage = {
        id: `msg-rep-${Date.now()}`,
        threadId: activeThreadId,
        senderId: currentThread?.participant.id || 'owner-auto',
        senderName: ownerName,
        senderAvatar: currentThread?.participant.avatar || '',
        isMe: false,
        text: `Thank you for your sincere offer of ${formattedAmount}! Let's discuss final closure over a quick site visit. Are you available this Saturday or Sunday morning?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEncrypted: true,
      };

      setThreads(prev =>
        prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, autoReply],
              lastMessageAt: 'Just now',
            };
          }
          return t;
        })
      );
    }, 2000);
  };

  const scheduleVisit = (date: string, timeSlot: string, type: 'Physical Visit' | 'Video Tour') => {
    if (!activeThreadId) return;

    const visitMessage: ChatMessage = {
      id: `msg-visit-${Date.now()}`,
      threadId: activeThreadId,
      senderId: 'user-delhi-01',
      senderName: 'Rohan Mehra',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isMe: true,
      text: `Requested a ${type} for ${date} at ${timeSlot}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      visit: {
        date,
        timeSlot,
        type,
        status: 'confirmed',
      },
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, visitMessage],
            lastMessageAt: 'Just now',
          };
        }
        return t;
      })
    );

    setTimeout(() => {
      const currentThread = threads.find(t => t.id === activeThreadId);
      const ownerName = currentThread?.participant.name || 'Owner';
      const autoReply: ChatMessage = {
        id: `msg-rep-visit-${Date.now()}`,
        threadId: activeThreadId,
        senderId: currentThread?.participant.id || 'owner-auto',
        senderName: ownerName,
        senderAvatar: currentThread?.participant.avatar || '',
        isMe: false,
        text: `Confirmed! I have blocked ${date} (${timeSlot}) for your ${type}. I will be present at the premises to show you around. Looking forward to meeting you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEncrypted: true,
      };

      setThreads(prev =>
        prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, autoReply],
              lastMessageAt: 'Just now',
            };
          }
          return t;
        })
      );
    }, 1800);
  };

  const simulateOwnerResponse = (threadId: string, userText: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    let replyText = `Thanks for reaching out! The property is in mint condition with all clear legal documents. Feel free to ask any specifics or schedule a walkthrough.`;
    const lower = userText.toLowerCase();

    if (lower.includes('price') || lower.includes('negotiable') || lower.includes('discount')) {
      replyText = `Yes, the price is slightly negotiable for serious direct buyers with immediate payment terms.`;
    } else if (lower.includes('metro') || lower.includes('station') || lower.includes('distance')) {
      replyText = `The nearest metro station is within comfortable walking distance. Very convenient for daily commute!`;
    } else if (lower.includes('parking') || lower.includes('car')) {
      replyText = `Dedicated covered parking is reserved inside the gated premises with 24/7 security.`;
    } else if (lower.includes('available') || lower.includes('vacant')) {
      replyText = `Yes, it is ready for immediate possession/move-in. Clear title and freehold registry!`;
    }

    const replyMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      threadId,
      senderId: thread.participant.id,
      senderName: thread.participant.name,
      senderAvatar: thread.participant.avatar,
      isMe: false,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: [...t.messages, replyMsg],
            lastMessageAt: 'Just now',
          };
        }
        return t;
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThread,
        activeThreadId,
        isChatOpen,
        setIsChatOpen,
        openChatForProperty,
        selectThread,
        sendMessage,
        sendOffer,
        scheduleVisit,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
