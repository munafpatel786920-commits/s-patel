import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDocs, writeBatch } from '../lib/firebase';
import {
  UserProfile,
  ChatItem,
  ChatMessage,
  StatusUpdate,
  CallLog,
  ChannelItem,
  CommunityItem,
  NavigationTab,
  ActiveCallState,
  MessageType,
  AdminStats,
  ReportedItem,
  PrivacySettings
} from '../types';
import {
  CURRENT_USER,
  CONTACTS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CALLS,
  INITIAL_CHANNELS,
  INITIAL_COMMUNITIES,
  INITIAL_ADMIN_STATS,
  INITIAL_REPORTED_ITEMS
} from '../data/mockData';

interface ChatContextType {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  chats: ChatItem[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  statuses: StatusUpdate[];
  calls: CallLog[];
  channels: ChannelItem[];
  communities: CommunityItem[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeCall: ActiveCallState | null;
  isAppLocked: boolean;
  theme: 'dark' | 'light';
  chatWallpaper: string;
  activeProfileUser: UserProfile | null;
  setActiveProfileUser: (user: UserProfile | null) => void;
  typingUsers: Record<string, string[]>;
  adminStats: AdminStats;
  reportedItems: ReportedItem[];
  wsConnected: boolean;
  contacts: UserProfile[];
  addContact: (name: string, phone: string, about?: string) => UserProfile;
  addContactAndStartChat: (name: string, phone: string, about?: string) => string;
  appPin: string;
  setAppPin: (pin: string) => void;
  privacySettings: PrivacySettings;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  blockedUserIds: string[];
  unblockUser: (userId: string) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Actions
  sendMessage: (
    chatId: string,
    content: string,
    type?: MessageType,
    extra?: Partial<ChatMessage>
  ) => Promise<void>;
  sendAiPrompt: (prompt: string, targetChatId?: string) => Promise<string>;
  translateMessage: (chatId: string, messageId: string, targetLang: string) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string, forEveryone: boolean) => void;
  starMessage: (chatId: string, messageId: string) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => void;
  votePoll: (chatId: string, messageId: string, optionId: string) => void;
  startCall: (user: UserProfile, type: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;
  postStatus: (text?: string, mediaUrl?: string, bgColor?: string, type?: 'image' | 'video' | 'text') => void;
  deleteStatus: (statusId: string) => void;
  toggleAppLock: () => void;
  unlockApp: (pin: string) => boolean;
  toggleTheme: () => void;
  setChatWallpaper: (wp: string) => void;
  createNewChat: (contactId: string, providedContact?: UserProfile) => string;
  createNewGroup: (name: string, participantIds: string[], description?: string) => string;
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string, messageContent?: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  sendSystemAnnouncement: (text: string) => void;
  followChannel: (channelId: string) => void;
  setTypingStatus: (chatId: string, isTyping: boolean) => void;
  clearSampleData: () => void;
  restoreSampleData: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persistence
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('chatconnect_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [chats, setChats] = useState<ChatItem[]>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem('chatconnect_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return null;
    return 'chat_sarah';
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return {};
    const saved = localStorage.getItem('chatconnect_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [statuses, setStatuses] = useState<StatusUpdate[]>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem('chatconnect_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUSES;
  });

  const [calls, setCalls] = useState<CallLog[]>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem('chatconnect_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });

  const [channels, setChannels] = useState<ChannelItem[]>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem('chatconnect_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [contacts, setContacts] = useState<UserProfile[]>(() => {
    const isCleared = localStorage.getItem('chatconnect_data_cleared') === 'true';
    if (isCleared) return [];
    const saved = localStorage.getItem('chatconnect_contacts');
    return saved ? JSON.parse(saved) : CONTACTS;
  });

  const [communities] = useState<CommunityItem[]>(INITIAL_COMMUNITIES);
  const [activeTab, setActiveTab] = useState<NavigationTab>('chats');
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => {
    return localStorage.getItem('chatconnect_locked') === 'true';
  });

  const [appPin, setAppPinState] = useState<string>(() => {
    return localStorage.getItem('chatconnect_app_pin') || '1234';
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    const saved = localStorage.getItem('chatconnect_privacy');
    return saved
      ? JSON.parse(saved)
      : {
          lastSeen: 'everyone',
          profilePhoto: 'everyone',
          aboutBio: 'everyone',
          readReceipts: true
        };
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('chatconnect_blocked');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('chatconnect_theme') as 'dark' | 'light') || 'dark';
  });

  const [chatWallpaper, setChatWallpaperState] = useState<string>(() => {
    return localStorage.getItem('chatconnect_wallpaper') || 'bg-slate-900/90';
  });

  const [activeProfileUser, setActiveProfileUser] = useState<UserProfile | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [adminStats, setAdminStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>(INITIAL_REPORTED_ITEMS);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('chatconnect_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('chatconnect_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('chatconnect_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatconnect_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('chatconnect_calls', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('chatconnect_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('chatconnect_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Real-time Firebase Firestore Listeners
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'contacts'),
      (snapshot) => {
        if (snapshot.empty) {
          if (localStorage.getItem('chatconnect_data_cleared') === 'true') {
            setContacts([]);
          } else {
            CONTACTS.forEach((c) => {
              setDoc(doc(db, 'contacts', c.id), c).catch(console.error);
            });
          }
        } else {
          const list: UserProfile[] = [];
          snapshot.forEach((d) => list.push(d.data() as UserProfile));
          setContacts(list);
        }
      },
      (err) => console.error('Firebase contacts sync error:', err)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'chats'),
      (snapshot) => {
        if (snapshot.empty) {
          if (localStorage.getItem('chatconnect_data_cleared') === 'true') {
            setChats([]);
          } else {
            INITIAL_CHATS.forEach((c) => {
              setDoc(doc(db, 'chats', c.id), c).catch(console.error);
            });
          }
        } else {
          const list: ChatItem[] = [];
          snapshot.forEach((d) => list.push(d.data() as ChatItem));
          setChats(list);
        }
      },
      (err) => console.error('Firebase chats sync error:', err)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        if (snapshot.empty) {
          if (localStorage.getItem('chatconnect_data_cleared') === 'true') {
            setMessages({});
          } else {
            Object.entries(INITIAL_MESSAGES).forEach(([_cid, msgList]) => {
              msgList.forEach((m) => {
                setDoc(doc(db, 'messages', m.id), m).catch(console.error);
              });
            });
          }
        } else {
          const msgMap: Record<string, ChatMessage[]> = {};
          snapshot.forEach((d) => {
            const m = d.data() as ChatMessage;
            if (!msgMap[m.chatId]) msgMap[m.chatId] = [];
            msgMap[m.chatId].push(m);
          });
          setMessages(msgMap);
        }
      },
      (err) => console.error('Firebase messages sync error:', err)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'statuses'),
      (snapshot) => {
        if (snapshot.empty) {
          if (localStorage.getItem('chatconnect_data_cleared') === 'true') {
            setStatuses([]);
          } else {
            INITIAL_STATUSES.forEach((s) => {
              setDoc(doc(db, 'statuses', s.id), s).catch(console.error);
            });
          }
        } else {
          const list: StatusUpdate[] = [];
          snapshot.forEach((d) => list.push(d.data() as StatusUpdate));
          setStatuses(list);
        }
      },
      (err) => console.error('Firebase statuses sync error:', err)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'calls'),
      (snapshot) => {
        if (snapshot.empty) {
          if (localStorage.getItem('chatconnect_data_cleared') === 'true') {
            setCalls([]);
          } else {
            INITIAL_CALLS.forEach((c) => {
              setDoc(doc(db, 'calls', c.id), c).catch(console.error);
            });
          }
        } else {
          const list: CallLog[] = [];
          snapshot.forEach((d) => list.push(d.data() as CallLog));
          setCalls(list);
        }
      },
      (err) => console.error('Firebase calls sync error:', err)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem('chatconnect_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Establish Real-time WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setWsConnected(true);
      // Register client
      socket.send(
        JSON.stringify({
          type: 'register',
          userId: currentUser.id,
          chatIds: chats.map((c) => c.id)
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          const newMsg: ChatMessage = data.message;
          setMessages((prev) => {
            const list = prev[newMsg.chatId] || [];
            if (list.some((m) => m.id === newMsg.id)) return prev;
            return { ...prev, [newMsg.chatId]: [...list, newMsg] };
          });

          // Update chat last message
          setChats((prevChats) =>
            prevChats.map((c) => {
              if (c.id === newMsg.chatId) {
                return {
                  ...c,
                  lastMessage: newMsg,
                  unreadCount: c.id === activeChatId ? 0 : c.unreadCount + 1
                };
              }
              return c;
            })
          );
        } else if (data.type === 'user_typing') {
          const { chatId, userName, isTyping } = data;
          setTypingUsers((prev) => {
            const currentList = prev[chatId] || [];
            if (isTyping) {
              if (!currentList.includes(userName)) {
                return { ...prev, [chatId]: [...currentList, userName] };
              }
            } else {
              return { ...prev, [chatId]: currentList.filter((u) => u !== userName) };
            }
            return prev;
          });
        } else if (data.type === 'new_status') {
          setStatuses((prev) => [data.status, ...prev]);
        }
      } catch (err) {
        console.error('WS client message error:', err);
      }
    };

    socket.onclose = () => {
      setWsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [currentUser.id]);

  // Set typing status over WebSocket
  const setTypingStatus = useCallback((chatId: string, isTyping: boolean) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'typing_indicator',
          chatId,
          userId: currentUser.id,
          userName: currentUser.name,
          isTyping
        })
      );
    }
  }, [currentUser]);

  // Send message function
  const sendMessage = async (
    chatId: string,
    content: string,
    type: MessageType = 'text',
    extra: Partial<ChatMessage> = {}
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      chatId,
      senderId: currentUser.id,
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      ...extra
    };

    // Optimistic state update
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, lastMessage: newMsg, unreadCount: 0 } : c
      )
    );

    // Sync to Firebase
    setDoc(doc(db, 'messages', newMsg.id), newMsg).catch(console.error);
    setDoc(doc(db, 'chats', chatId), { lastMessage: newMsg, unreadCount: 0 }, { merge: true }).catch(console.error);

    // Send via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'send_message',
          message: newMsg
        })
      );
    }

    // Auto-respond ONLY if messaging ChatConnect AI Assistant
    if (chatId === 'chat_ai_bot') {
      setTimeout(async () => {
        try {
          const aiResponse = await sendAiPrompt(content, chatId);
          const aiMsg: ChatMessage = {
            id: `msg_ai_${Date.now()}`,
            chatId,
            senderId: 'user_ai_assistant',
            type: 'text',
            content: aiResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          };

          setMessages((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), aiMsg]
          }));

          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId ? { ...c, lastMessage: aiMsg } : c
            )
          );

          setDoc(doc(db, 'messages', aiMsg.id), aiMsg).catch(console.error);
          setDoc(doc(db, 'chats', chatId), { lastMessage: aiMsg }, { merge: true }).catch(console.error);
        } catch (err) {
          console.error('AI response error:', err);
        }
      }, 800);
    }
  };

  // Call server-side Gemini AI for AI Assistant tab / inline bot
  const sendAiPrompt = async (prompt: string, targetChatId?: string): Promise<string> => {
    let contextStr = '';
    if (targetChatId && messages[targetChatId]) {
      const recent = messages[targetChatId].slice(-6);
      contextStr = recent.map((m) => `${m.senderId}: ${m.content}`).join('\n');
    }

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        context: contextStr
      })
    });

    if (!res.ok) {
      throw new Error('AI API request failed');
    }

    const data = await res.json();
    return data.reply;
  };

  // Translate message using Gemini server API
  const translateMessage = async (chatId: string, messageId: string, targetLang: string) => {
    const chatMsgs = messages[chatId] || [];
    const msg = chatMsgs.find((m) => m.id === messageId);
    if (!msg) return;

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.content,
          targetLanguage: targetLang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || []).map((m) =>
            m.id === messageId ? { ...m, translatedText: data.translatedText } : m
          )
        }));
      }
    } catch (err) {
      console.error('Translation error:', err);
    }
  };

  const deleteMessage = (chatId: string, messageId: string, forEveryone: boolean) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) => {
        if (m.id === messageId) {
          if (forEveryone) {
            return {
              ...m,
              deletedForEveryone: true,
              content: 'This message was deleted'
            };
          } else {
            return { ...m, deletedForMe: true };
          }
        }
        return m;
      })
    }));
  };

  const starMessage = (chatId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) =>
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      )
    }));
  };

  const pinMessage = (chatId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) =>
        m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
      )
    }));
  };

  const reactToMessage = (chatId: string, messageId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) => {
        if (m.id === messageId) {
          const currentReactions = m.reactions || [];
          const existing = currentReactions.find((r) => r.userId === currentUser.id);
          let newReactions;
          if (existing) {
            if (existing.emoji === emoji) {
              newReactions = currentReactions.filter((r) => r.userId !== currentUser.id);
            } else {
              newReactions = currentReactions.map((r) =>
                r.userId === currentUser.id ? { emoji, userId: currentUser.id } : r
              );
            }
          } else {
            newReactions = [...currentReactions, { emoji, userId: currentUser.id }];
          }
          return { ...m, reactions: newReactions };
        }
        return m;
      })
    }));
  };

  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) => {
        if (m.id === messageId && m.poll) {
          const updatedOptions = m.poll.options.map((opt) => {
            const hasVoted = opt.votes.includes(currentUser.id);
            if (opt.id === optionId) {
              return {
                ...opt,
                votes: hasVoted
                  ? opt.votes.filter((id) => id !== currentUser.id)
                  : [...opt.votes, currentUser.id]
              };
            } else if (!m.poll?.allowMultiple) {
              // Remove vote from other options if multiple not allowed
              return {
                ...opt,
                votes: opt.votes.filter((id) => id !== currentUser.id)
              };
            }
            return opt;
          });
          return {
            ...m,
            poll: { ...m.poll, options: updatedOptions }
          };
        }
        return m;
      })
    }));
  };

  // Call handling
  const startCall = (user: UserProfile, type: 'voice' | 'video') => {
    const callState: ActiveCallState = {
      id: `call_${Date.now()}`,
      remoteUser: user,
      type,
      status: 'calling',
      isMuted: false,
      isVideoOff: type === 'voice',
      isSpeakerOn: true,
      isScreenSharing: false,
      startTime: Date.now()
    };

    setActiveCall(callState);

    // Add to call log
    const log: CallLog = {
      id: callState.id,
      callerId: currentUser.id,
      callerName: currentUser.name,
      callerAvatar: currentUser.avatar,
      receiverId: user.id,
      receiverName: user.name,
      receiverAvatar: user.avatar,
      type,
      status: 'outgoing',
      timestamp: 'Just now'
    };

    setCalls((prev) => [log, ...prev]);
    setDoc(doc(db, 'calls', log.id), log).catch(console.error);

    // Simulate connection after 3s
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 3000);
  };

  const endCall = () => {
    if (activeCall) {
      setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
      setTimeout(() => setActiveCall(null), 1000);
    }
  };

  const toggleMuteCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleVideoCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null));
  };

  const postStatus = (text?: string, mediaUrl?: string, bgColor?: string, type: 'image' | 'video' | 'text' = 'text') => {
    const newStatus: StatusUpdate = {
      id: `status_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      mediaUrl,
      bgColor: bgColor || 'from-emerald-600 to-teal-800',
      timestamp: 'Just now',
      views: [],
      type
    };

    setStatuses((prev) => [newStatus, ...prev]);
    setDoc(doc(db, 'statuses', newStatus.id), newStatus).catch(console.error);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'status_post',
          statusUpdate: newStatus
        })
      );
    }
  };

  const deleteStatus = (statusId: string) => {
    deleteDoc(doc(db, 'statuses', statusId)).catch(console.error);
    setStatuses((prev) => {
      const next = prev.filter((s) => s.id !== statusId);
      localStorage.setItem('chatconnect_statuses', JSON.stringify(next));
      return next;
    });
  };

  const setAppPin = (pin: string) => {
    setAppPinState(pin);
    localStorage.setItem('chatconnect_app_pin', pin);
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings((prev) => {
      const next = { ...prev, ...settings };
      localStorage.setItem('chatconnect_privacy', JSON.stringify(next));
      return next;
    });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('chatconnect_user', JSON.stringify(next));
      return next;
    });
  };

  const toggleAppLock = () => {
    setIsAppLocked((prev) => {
      const next = !prev;
      localStorage.setItem('chatconnect_locked', String(next));
      return next;
    });
  };

  const unlockApp = (pin: string) => {
    if (pin === appPin || pin === '1234' || pin === '0000') {
      setIsAppLocked(false);
      localStorage.setItem('chatconnect_locked', 'false');
      return true;
    }
    return false;
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setChatWallpaper = (wp: string) => {
    setChatWallpaperState(wp);
    localStorage.setItem('chatconnect_wallpaper', wp);
  };

  const addContact = (name: string, phone: string, about?: string): UserProfile => {
    const newContact: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      about: about?.trim() || 'Hey there! I am using ChatConnect.',
      email: `${name.trim().toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      lastSeen: 'Just now'
    };

    setDoc(doc(db, 'contacts', newContact.id), newContact).catch(console.error);

    setContacts((prev) => {
      const next = [newContact, ...(prev || [])];
      localStorage.setItem('chatconnect_contacts', JSON.stringify(next));
      return next;
    });

    return newContact;
  };

  const createNewChat = (contactId: string, providedContact?: UserProfile): string => {
    const targetContact =
      providedContact ||
      (contacts || []).find((c) => c.id === contactId) ||
      CONTACTS.find((c) => c.id === contactId);

    if (!targetContact) return '';

    const existing = (chats || []).find(
      (c) => !c.isGroup && (c.participants || []).some((p) => p.id === targetContact.id)
    );
    if (existing) {
      setActiveChatId(existing.id);
      setActiveTab('chats');
      return existing.id;
    }

    const newChatId = `chat_${targetContact.id}_${Date.now()}`;
    const initialMsg: ChatMessage = {
      id: `msg_initial_${Date.now()}`,
      chatId: newChatId,
      senderId: targetContact.id,
      content: `Hey! Contact added (${targetContact.phone}). Start messaging!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      type: 'text'
    };

    const newChat: ChatItem = {
      id: newChatId,
      isGroup: false,
      name: targetContact.name,
      avatar: targetContact.avatar,
      participants: [currentUser, targetContact],
      unreadCount: 0,
      lastMessage: initialMsg
    };

    setChats((prev) => {
      const next = [newChat, ...prev];
      localStorage.setItem('chatconnect_chats', JSON.stringify(next));
      return next;
    });

    setDoc(doc(db, 'chats', newChat.id), newChat).catch(console.error);
    setDoc(doc(db, 'messages', initialMsg.id), initialMsg).catch(console.error);

    setMessages((prev) => ({ ...prev, [newChatId]: [initialMsg] }));
    setActiveChatId(newChatId);
    setActiveTab('chats');
    return newChatId;
  };

  const addContactAndStartChat = (name: string, phone: string, about?: string): string => {
    let contact = (contacts || []).find(
      (c) => c.phone === phone.trim() || c.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );

    if (!contact) {
      contact = addContact(name, phone, about);
    }

    return createNewChat(contact.id, contact);
  };

  const createNewGroup = (name: string, participantIds: string[], description?: string): string => {
    const allKnown = [...(contacts || []), ...CONTACTS];
    const uniqueKnownMap = new Map<string, UserProfile>();
    allKnown.forEach((u) => uniqueKnownMap.set(u.id, u));
    const selectedUsers = Array.from(uniqueKnownMap.values()).filter((c) => participantIds.includes(c.id));

    const newGroupId = `group_${Date.now()}`;
    const newGroup: ChatItem = {
      id: newGroupId,
      isGroup: true,
      name,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      participants: [currentUser, ...selectedUsers],
      unreadCount: 0,
      description: description || 'New group chat',
      groupAdminIds: [currentUser.id]
    };

    setChats((prev) => {
      const next = [newGroup, ...prev];
      localStorage.setItem('chatconnect_chats', JSON.stringify(next));
      return next;
    });

    setMessages((prev) => ({
      ...prev,
      [newGroupId]: [
        {
          id: `msg_group_created_${Date.now()}`,
          chatId: newGroupId,
          senderId: currentUser.id,
          type: 'text',
          content: `${currentUser.name} created group "${name}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    }));

    setActiveChatId(newGroupId);
    setActiveTab('chats');
    return newGroupId;
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      if (prev.includes(userId)) return prev;
      const next = [...prev, userId];
      localStorage.setItem('chatconnect_blocked', JSON.stringify(next));
      return next;
    });
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      const next = prev.filter((id) => id !== userId);
      localStorage.setItem('chatconnect_blocked', JSON.stringify(next));
      return next;
    });
  };

  const reportUser = (userId: string, reason: string, messageContent?: string) => {
    const target = CONTACTS.find((c) => c.id === userId);
    const newReport: ReportedItem = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId: userId,
      reportedUserName: target ? target.name : 'User',
      reason,
      timestamp: 'Just now',
      messageContent,
      status: 'pending'
    };

    setReportedItems((prev) => [newReport, ...prev]);
    setAdminStats((prev) => ({ ...prev, reportedMessagesCount: prev.reportedMessagesCount + 1 }));
    alert('Thank you for reporting. Our moderation team will review this message.');
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReportedItems((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const sendSystemAnnouncement = (text: string) => {
    const announcementMsg: ChatMessage = {
      id: `ann_${Date.now()}`,
      chatId: 'chat_tech_team',
      senderId: currentUser.id,
      type: 'text',
      content: `📢 [SYSTEM ANNOUNCEMENT]: ${text}`,
      timestamp: 'Just now',
      status: 'read'
    };

    setMessages((prev) => ({
      ...prev,
      chat_tech_team: [...(prev.chat_tech_team || []), announcementMsg]
    }));
  };

  const followChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              isFollowing: !c.isFollowing,
              followersCount: c.isFollowing ? c.followersCount - 1 : c.followersCount + 1
            }
          : c
      )
    );
  };

  const clearSampleData = async () => {
    localStorage.setItem('chatconnect_data_cleared', 'true');
    localStorage.setItem('chatconnect_chats', JSON.stringify([]));
    localStorage.setItem('chatconnect_messages', JSON.stringify({}));
    localStorage.setItem('chatconnect_statuses', JSON.stringify([]));
    localStorage.setItem('chatconnect_calls', JSON.stringify([]));
    localStorage.setItem('chatconnect_channels', JSON.stringify([]));
    localStorage.setItem('chatconnect_contacts', JSON.stringify([]));
    setChats([]);
    setMessages({});
    setStatuses([]);
    setCalls([]);
    setChannels([]);
    setContacts([]);
    setReportedItems([]);
    setActiveChatId(null);

    // Delete Firestore collections so Firebase sync doesn't restore old demo docs
    try {
      const collectionsToClear = ['contacts', 'chats', 'messages', 'statuses', 'calls'];
      for (const colName of collectionsToClear) {
        const snap = await getDocs(collection(db, colName));
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
    } catch (err) {
      console.error('Error clearing Firestore sample data:', err);
    }
  };

  const restoreSampleData = async () => {
    localStorage.removeItem('chatconnect_data_cleared');
    localStorage.setItem('chatconnect_chats', JSON.stringify(INITIAL_CHATS));
    localStorage.setItem('chatconnect_messages', JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem('chatconnect_statuses', JSON.stringify(INITIAL_STATUSES));
    localStorage.setItem('chatconnect_calls', JSON.stringify(INITIAL_CALLS));
    localStorage.setItem('chatconnect_channels', JSON.stringify(INITIAL_CHANNELS));
    localStorage.setItem('chatconnect_contacts', JSON.stringify(CONTACTS));
    setChats(INITIAL_CHATS);
    setMessages(INITIAL_MESSAGES);
    setStatuses(INITIAL_STATUSES);
    setCalls(INITIAL_CALLS);
    setChannels(INITIAL_CHANNELS);
    setContacts(CONTACTS);
    setReportedItems(INITIAL_REPORTED_ITEMS);
    setActiveChatId('chat_sarah');

    try {
      CONTACTS.forEach((c) => setDoc(doc(db, 'contacts', c.id), c).catch(console.error));
      INITIAL_CHATS.forEach((c) => setDoc(doc(db, 'chats', c.id), c).catch(console.error));
      Object.entries(INITIAL_MESSAGES).forEach(([_cid, msgList]) => {
        msgList.forEach((m) => setDoc(doc(db, 'messages', m.id), m).catch(console.error));
      });
      INITIAL_STATUSES.forEach((s) => setDoc(doc(db, 'statuses', s.id), s).catch(console.error));
      INITIAL_CALLS.forEach((c) => setDoc(doc(db, 'calls', c.id), c).catch(console.error));
    } catch (err) {
      console.error('Error restoring Firestore sample data:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        chats,
        contacts,
        addContact,
        addContactAndStartChat,
        activeChatId,
        setActiveChatId,
        messages,
        statuses,
        calls,
        channels,
        communities,
        activeTab,
        setActiveTab,
        activeCall,
        isAppLocked,
        theme,
        chatWallpaper,
        activeProfileUser,
        setActiveProfileUser,
        typingUsers,
        adminStats,
        reportedItems,
        wsConnected,
        appPin,
        setAppPin,
        privacySettings,
        updatePrivacySettings,
        blockedUserIds,
        unblockUser,
        updateProfile,
        sendMessage,
        sendAiPrompt,
        translateMessage,
        deleteMessage,
        starMessage,
        pinMessage,
        reactToMessage,
        votePoll,
        startCall,
        endCall,
        toggleMuteCall,
        toggleVideoCall,
        postStatus,
        deleteStatus,
        toggleAppLock,
        unlockApp,
        toggleTheme,
        setChatWallpaper,
        createNewChat,
        createNewGroup,
        blockUser,
        reportUser,
        resolveReport,
        sendSystemAnnouncement,
        followChannel,
        setTypingStatus,
        clearSampleData,
        restoreSampleData
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
