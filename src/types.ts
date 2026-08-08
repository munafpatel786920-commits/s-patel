export type NavigationTab = 
  | 'chats' 
  | 'status' 
  | 'communities' 
  | 'calls' 
  | 'ai' 
  | 'admin' 
  | 'settings';

export type UserStatusType = 'online' | 'offline' | 'typing';

export interface PrivacySettings {
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  aboutBio: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  about: string;
  status: UserStatusType;
  lastSeen?: string;
  isTwoFactorEnabled?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'location' 
  | 'contact' 
  | 'poll' 
  | 'sticker';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read';

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs who voted
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string; // Text content, media URL, document name, etc.
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: number; // Audio/video duration in seconds
  timestamp: string;
  status: MessageDeliveryStatus;
  replyToId?: string;
  replyToMessage?: {
    senderName: string;
    content: string;
  };
  isStarred?: boolean;
  isPinned?: boolean;
  isEdited?: boolean;
  isForwarded?: boolean;
  deletedForEveryone?: boolean;
  deletedForMe?: boolean;
  reactions?: MessageReaction[];
  poll?: PollData;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  translatedText?: string;
}

export interface ChatItem {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  participants: UserProfile[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  groupAdminIds?: string[];
  description?: string;
  createdAt?: string;
  wallpaper?: string;
}

export interface StatusUpdate {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl?: string;
  text?: string;
  bgColor?: string;
  timestamp: string;
  views: string[]; // list of user IDs
  type: 'image' | 'video' | 'text';
}

export interface CallLog {
  id: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  type: 'voice' | 'video';
  status: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface ChannelItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  followersCount: number;
  isVerified: boolean;
  isFollowing: boolean;
  unreadCount?: number;
  lastUpdate?: {
    text: string;
    timestamp: string;
    mediaUrl?: string;
  };
}

export interface CommunityItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  channels: {
    id: string;
    name: string;
    unreadCount: number;
  }[];
  memberCount: number;
}

export interface ActiveCallState {
  id: string;
  chatId?: string;
  remoteUser: UserProfile;
  type: 'voice' | 'video';
  status: 'calling' | 'connected' | 'ended';
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  startTime?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  messagesSentToday: number;
  totalCallsDurationMinutes: number;
  reportedMessagesCount: number;
}

export interface ReportedItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  timestamp: string;
  messageContent?: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
