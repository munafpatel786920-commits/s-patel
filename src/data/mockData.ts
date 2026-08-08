import { UserProfile, ChatItem, ChatMessage, StatusUpdate, CallLog, ChannelItem, CommunityItem, AdminStats, ReportedItem } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_current',
  name: 'Alex Rivera',
  phone: '+1 (555) 019-2834',
  email: 'alex.rivera@chatconnect.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Building cool web applications 🚀 | Available',
  status: 'online',
  isTwoFactorEnabled: true,
  isVerified: true
};

export const CONTACTS: UserProfile[] = [
  {
    id: 'user_sarah',
    name: 'Sarah Connor',
    phone: '+1 (555) 234-5678',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    about: 'At the gym 🏋️‍♀️ | Do not disturb',
    status: 'online',
    lastSeen: 'Just now',
    isVerified: true
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    about: 'Code. Sleep. Repeat. 💻',
    status: 'offline',
    lastSeen: 'Today at 11:42 AM',
    isVerified: true
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    phone: '+1 (555) 345-6789',
    email: 'elena@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    about: 'Design is intelligence made visible ✨',
    status: 'online',
    lastSeen: 'Just now'
  },
  {
    id: 'user_david',
    name: 'David Kim',
    phone: '+1 (555) 987-6543',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    about: 'In a meeting 📊',
    status: 'offline',
    lastSeen: 'Yesterday at 8:15 PM'
  },
  {
    id: 'user_ai_assistant',
    name: 'ChatConnect AI',
    phone: '+0 (000) 000-0000',
    email: 'ai@chatconnect.app',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    about: 'Powered by Gemini 3.6 Flash ⚡ Ask me anything!',
    status: 'online',
    isVerified: true
  }
];

export const INITIAL_CHATS: ChatItem[] = [
  {
    id: 'chat_sarah',
    isGroup: false,
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participants: [CURRENT_USER, CONTACTS[0]],
    unreadCount: 2,
    isPinned: true,
    lastMessage: {
      id: 'msg_s2',
      chatId: 'chat_sarah',
      senderId: 'user_sarah',
      type: 'text',
      content: 'Hey Alex! Are we still on for the design review today at 3 PM?',
      timestamp: '11:45 AM',
      status: 'delivered',
      isStarred: true
    }
  },
  {
    id: 'chat_tech_team',
    isGroup: true,
    name: '🚀 Frontend & Design Core',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    participants: [CURRENT_USER, CONTACTS[0], CONTACTS[1], CONTACTS[2]],
    unreadCount: 5,
    isPinned: true,
    description: 'Discussion group for upcoming release v2.4 and UI design components.',
    groupAdminIds: ['user_current', 'user_marcus'],
    lastMessage: {
      id: 'msg_t3',
      chatId: 'chat_tech_team',
      senderId: 'user_marcus',
      type: 'image',
      content: 'Here is the new dashboard UI layout preview! Let me know your feedback.',
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      timestamp: '11:10 AM',
      status: 'read'
    }
  },
  {
    id: 'chat_ai_bot',
    isGroup: false,
    name: 'ChatConnect AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    participants: [CURRENT_USER, CONTACTS[4]],
    unreadCount: 0,
    isPinned: true,
    lastMessage: {
      id: 'msg_ai_1',
      chatId: 'chat_ai_bot',
      senderId: 'user_ai_assistant',
      type: 'text',
      content: 'Hello Alex! I am your AI assistant. Ask me to draft emails, summarize conversations, generate ideas, or translate messages!',
      timestamp: '10:00 AM',
      status: 'read'
    }
  },
  {
    id: 'chat_marcus',
    isGroup: false,
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    participants: [CURRENT_USER, CONTACTS[1]],
    unreadCount: 0,
    lastMessage: {
      id: 'msg_m2',
      chatId: 'chat_marcus',
      senderId: 'user_current',
      type: 'text',
      content: 'I pushed the latest backend routes for WebSockets. Can you test connection?',
      timestamp: 'Yesterday',
      status: 'read'
    }
  },
  {
    id: 'chat_elena',
    isGroup: false,
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    participants: [CURRENT_USER, CONTACTS[2]],
    unreadCount: 0,
    lastMessage: {
      id: 'msg_e1',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      type: 'audio',
      content: 'Voice note (0:18)',
      mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
      duration: 18,
      timestamp: 'Yesterday',
      status: 'read'
    }
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chat_sarah: [
    {
      id: 'msg_s1',
      chatId: 'chat_sarah',
      senderId: 'user_current',
      type: 'text',
      content: 'Good morning Sarah! Did you review the project mockups?',
      timestamp: '11:30 AM',
      status: 'read'
    },
    {
      id: 'msg_s2',
      chatId: 'chat_sarah',
      senderId: 'user_sarah',
      type: 'text',
      content: 'Hey Alex! Are we still on for the design review today at 3 PM?',
      timestamp: '11:45 AM',
      status: 'delivered',
      isStarred: true,
      reactions: [{ emoji: '👍', userId: 'user_current' }]
    }
  ],
  chat_tech_team: [
    {
      id: 'msg_t1',
      chatId: 'chat_tech_team',
      senderId: 'user_sarah',
      type: 'text',
      content: 'Morning team! Let us prepare for the launch QA testing session.',
      timestamp: '10:15 AM',
      status: 'read'
    },
    {
      id: 'msg_t2',
      chatId: 'chat_tech_team',
      senderId: 'user_elena',
      type: 'poll',
      content: 'Which color theme should we set as default for Dark Mode?',
      poll: {
        question: 'Default Dark Mode Primary Accent?',
        options: [
          { id: 'opt_1', text: 'Teal / Emerald Green (WhatsApp style)', votes: ['user_current', 'user_sarah'] },
          { id: 'opt_2', text: 'Deep Ocean Cyan', votes: ['user_marcus'] },
          { id: 'opt_3', text: 'Amethyst Purple', votes: [] }
        ],
        allowMultiple: false
      },
      timestamp: '10:45 AM',
      status: 'read'
    },
    {
      id: 'msg_t3',
      chatId: 'chat_tech_team',
      senderId: 'user_marcus',
      type: 'image',
      content: 'Here is the new dashboard UI layout preview! Let me know your feedback.',
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      timestamp: '11:10 AM',
      status: 'read',
      reactions: [{ emoji: '🔥', userId: 'user_current' }, { emoji: '❤️', userId: 'user_sarah' }]
    }
  ],
  chat_ai_bot: [
    {
      id: 'msg_ai_1',
      chatId: 'chat_ai_bot',
      senderId: 'user_ai_assistant',
      type: 'text',
      content: 'Hello Alex! I am your AI assistant powered by Gemini 3.6. Ask me to draft messages, summarize discussions, generate creative status ideas, or translate languages!',
      timestamp: '10:00 AM',
      status: 'read'
    }
  ],
  chat_marcus: [
    {
      id: 'msg_m1',
      chatId: 'chat_marcus',
      senderId: 'user_marcus',
      type: 'location',
      content: 'Location shared',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        name: 'San Francisco Tech Hub, CA'
      },
      timestamp: 'Yesterday 4:20 PM',
      status: 'read'
    },
    {
      id: 'msg_m2',
      chatId: 'chat_marcus',
      senderId: 'user_current',
      type: 'text',
      content: 'I pushed the latest backend routes for WebSockets. Can you test connection?',
      timestamp: 'Yesterday 5:00 PM',
      status: 'read'
    }
  ],
  chat_elena: [
    {
      id: 'msg_e1',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      type: 'audio',
      content: 'Voice message regarding UI components',
      duration: 18,
      timestamp: 'Yesterday 2:15 PM',
      status: 'read'
    }
  ]
};

export const INITIAL_STATUSES: StatusUpdate[] = [
  {
    id: 'status_current',
    userId: CURRENT_USER.id,
    userName: CURRENT_USER.name,
    userAvatar: CURRENT_USER.avatar,
    text: 'Building ChatConnect! 🚀 Full stack real-time chat with AI assistant.',
    bgColor: 'from-emerald-600 to-teal-800',
    timestamp: '1 hour ago',
    views: ['user_sarah', 'user_marcus'],
    type: 'text'
  },
  {
    id: 'status_sarah',
    userId: 'user_sarah',
    userName: 'Sarah Connor',
    userAvatar: CONTACTS[0].avatar,
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    text: 'Weekend getaway vibes 🌊🏝️',
    timestamp: '2 hours ago',
    views: ['user_current', 'user_elena'],
    type: 'image'
  },
  {
    id: 'status_marcus',
    userId: 'user_marcus',
    userName: 'Marcus Vance',
    userAvatar: CONTACTS[1].avatar,
    text: '"Code is like humor. When you have to explain it, it’s bad." - Cory House',
    bgColor: 'from-purple-600 to-indigo-900',
    timestamp: '5 hours ago',
    views: ['user_current'],
    type: 'text'
  },
  {
    id: 'status_elena',
    userId: 'user_elena',
    userName: 'Elena Rostova',
    userAvatar: CONTACTS[2].avatar,
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    text: 'New design system palette launched! 🎨',
    timestamp: '8 hours ago',
    views: ['user_current', 'user_sarah'],
    type: 'image'
  }
];

export const INITIAL_CALLS: CallLog[] = [
  {
    id: 'call_1',
    callerId: 'user_sarah',
    callerName: 'Sarah Connor',
    callerAvatar: CONTACTS[0].avatar,
    receiverId: CURRENT_USER.id,
    receiverName: CURRENT_USER.name,
    receiverAvatar: CURRENT_USER.avatar,
    type: 'video',
    status: 'incoming',
    timestamp: 'Today, 10:30 AM',
    duration: '08:42'
  },
  {
    id: 'call_2',
    callerId: CURRENT_USER.id,
    callerName: CURRENT_USER.name,
    callerAvatar: CURRENT_USER.avatar,
    receiverId: 'user_marcus',
    receiverName: 'Marcus Vance',
    receiverAvatar: CONTACTS[1].avatar,
    type: 'voice',
    status: 'outgoing',
    timestamp: 'Yesterday, 4:15 PM',
    duration: '03:15'
  },
  {
    id: 'call_3',
    callerId: 'user_elena',
    callerName: 'Elena Rostova',
    callerAvatar: CONTACTS[2].avatar,
    receiverId: CURRENT_USER.id,
    receiverName: CURRENT_USER.name,
    receiverAvatar: CURRENT_USER.avatar,
    type: 'video',
    status: 'missed',
    timestamp: '2 days ago, 7:20 PM'
  }
];

export const INITIAL_CHANNELS: ChannelItem[] = [
  {
    id: 'chan_tech_radar',
    name: 'Tech Radar Official ⚡',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    description: 'Breaking news in AI, software engineering, gadgets, and web development.',
    followersCount: 124500,
    isVerified: true,
    isFollowing: true,
    unreadCount: 3,
    lastUpdate: {
      text: 'Gemini 3.6 Flash released with enhanced speed, multimodal reasoning, and lower latency!',
      timestamp: '30m ago',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'chan_daily_quotes',
    name: 'Daily Inspiration & Wisdom 🌿',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format&fit=crop&q=80',
    description: 'Start your day with hand-curated quotes and mindfulness thoughts.',
    followersCount: 89200,
    isVerified: true,
    isFollowing: true,
    lastUpdate: {
      text: '"Simplicity is prerequisite for reliability." - Edsger W. Dijkstra',
      timestamp: '2h ago'
    }
  },
  {
    id: 'chan_design_digest',
    name: 'UI/UX Design Weekly 🎨',
    avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&auto=format&fit=crop&q=80',
    description: 'Case studies, color palettes, micro-interaction breakdowns and design assets.',
    followersCount: 54100,
    isVerified: false,
    isFollowing: false,
    lastUpdate: {
      text: '10 rules for accessible dark mode design contrast.',
      timestamp: 'Yesterday'
    }
  }
];

export const INITIAL_COMMUNITIES: CommunityItem[] = [
  {
    id: 'comm_global_devs',
    name: 'Global Developer Hub 🌐',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    description: 'A global community of software engineers, open-source contributors, and product creators.',
    memberCount: 3420,
    channels: [
      { id: 'chan_announcements', name: '📢 Official Announcements', unreadCount: 1 },
      { id: 'chan_general', name: '💬 General Lounge', unreadCount: 4 },
      { id: 'chan_jobs', name: '💼 Remote Jobs & Gigs', unreadCount: 0 }
    ]
  },
  {
    id: 'comm_startup_builders',
    name: 'Indie Hackers & Startup Founders 🚀',
    avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
    description: 'Share project updates, pitch decks, user acquisition strategies, and feedback.',
    memberCount: 1890,
    channels: [
      { id: 'chan_founder_updates', name: '📢 Weekly Showcases', unreadCount: 2 },
      { id: 'chan_marketing', name: '📈 Growth & Marketing', unreadCount: 0 }
    ]
  }
];

export const INITIAL_ADMIN_STATS: AdminStats = {
  totalUsers: 14280,
  activeUsersToday: 4892,
  messagesSentToday: 128450,
  totalCallsDurationMinutes: 18450,
  reportedMessagesCount: 3
};

export const INITIAL_REPORTED_ITEMS: ReportedItem[] = [
  {
    id: 'rep_1',
    reporterId: 'user_sarah',
    reporterName: 'Sarah Connor',
    reportedUserId: 'user_unknown_99',
    reportedUserName: 'Spam Bot 3000',
    reason: 'Unsolicited commercial spam and suspicious links',
    timestamp: 'Today, 09:15 AM',
    messageContent: 'Claim $1000 free gift card now by clicking link!',
    status: 'pending'
  },
  {
    id: 'rep_2',
    reporterId: 'user_marcus',
    reporterName: 'Marcus Vance',
    reportedUserId: 'user_troll_12',
    reportedUserName: 'TrollUser',
    reason: 'Inappropriate language in public community channel',
    timestamp: 'Yesterday, 11:30 PM',
    messageContent: 'Abusive language message removed...',
    status: 'pending'
  }
];
