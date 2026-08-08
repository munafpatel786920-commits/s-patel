import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Lock,
  Image as ImageIcon,
  FileText,
  MapPin,
  HelpCircle,
  X,
  Languages,
  Trash2,
  Star,
  Pin,
  CornerUpLeft,
  Check,
  CheckCheck,
  Play,
  Pause,
  Info,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ChatMessage, MessageType } from '../types';
import { openWhatsApp } from '../utils/whatsapp';

export const ChatWindow: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    sendMessage,
    translateMessage,
    deleteMessage,
    starMessage,
    pinMessage,
    reactToMessage,
    votePoll,
    startCall,
    setActiveProfileUser,
    chatWallpaper,
    currentUser,
    setTypingStatus
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchInChat, setSearchInChat] = useState('');
  const [isSearchingThread, setIsSearchingThread] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Voice recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Poll form state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Active playing audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatId]);

  // Handle typing status notification
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (activeChatId) {
      if (e.target.value.trim().length > 0) {
        setTypingStatus(activeChatId, true);
      } else {
        setTypingStatus(activeChatId, false);
      }
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() || !activeChatId) return;

    const extra: Partial<ChatMessage> = {};
    if (replyingTo) {
      extra.replyToId = replyingTo.id;
      extra.replyToMessage = {
        senderName: replyingTo.senderId === currentUser.id ? 'You' : 'Sender',
        content: replyingTo.content
      };
    }

    sendMessage(activeChatId, inputText.trim(), 'text', extra);
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    if (activeChatId) setTypingStatus(activeChatId, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // Voice Recording handlers
  const startRecording = () => {
    setIsRecordingAudio(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopAndSendRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingAudio(false);
    if (activeChatId && recordingSeconds > 0) {
      sendMessage(activeChatId, `Voice note (${recordingSeconds}s)`, 'audio', {
        duration: recordingSeconds,
        mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'
      });
    }
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingAudio(false);
    setRecordingSeconds(0);
  };

  // Poll Creation
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = pollOptions.filter((o) => o.trim().length > 0);
    if (!pollQuestion.trim() || validOptions.length < 2) {
      alert('Please enter a question and at least 2 options');
      return;
    }

    if (activeChatId) {
      sendMessage(activeChatId, pollQuestion, 'poll', {
        poll: {
          question: pollQuestion,
          options: validOptions.map((opt, idx) => ({
            id: `opt_${idx}_${Date.now()}`,
            text: opt,
            votes: []
          })),
          allowMultiple: false
        }
      });
    }

    setShowPollModal(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  // Send Location
  const handleSendLocation = () => {
    if (activeChatId) {
      sendMessage(activeChatId, 'Location shared', 'location', {
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          name: 'San Francisco Tech Center'
        }
      });
    }
    setShowLocationModal(false);
  };

  // Quick Photo Sample Send
  const handleSendPhotoSample = () => {
    if (activeChatId) {
      const samplePhotos = [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
      ];
      const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
      sendMessage(activeChatId, 'Shared a photo', 'image', { mediaUrl: randomPhoto });
    }
    setShowAttachmentMenu(false);
  };

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 bg-[#f0f2f5] dark:bg-slate-900 flex-col items-center justify-center p-8 text-center select-none border-l border-[#e9edef] dark:border-slate-800">
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 border border-[#e9edef] dark:border-slate-700 flex items-center justify-center text-[#00a884] mb-4 shadow-sm">
          <ShieldCheck className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-[#111b21] dark:text-slate-100 mb-2">Welcome to ChatConnect</h2>
        <p className="text-sm text-[#667781] dark:text-slate-400 max-w-md leading-relaxed">
          Select a conversation from the sidebar to send messages, make WebRTC voice/video calls,
          or ask our Gemini AI Assistant.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#667781] dark:text-slate-400 bg-white dark:bg-slate-800 border border-[#e9edef] dark:border-slate-700 px-4 py-2 rounded-full shadow-xs">
          <Lock className="w-3.5 h-3.5 text-[#00a884]" />
          End-to-End Encrypted Communications
        </div>
      </div>
    );
  }

  // Filter messages if searching in thread
  const displayedMessages = isSearchingThread
    ? chatMessages.filter((m) => m.content.toLowerCase().includes(searchInChat.toLowerCase()))
    : chatMessages;

  const participants = activeChat?.participants || [];
  const targetPartner = participants.find((p) => p.id !== currentUser.id) || participants[0] || currentUser;

  return (
    <div className="w-full flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-slate-950 relative overflow-hidden select-none border-l border-[#e9edef] dark:border-slate-800">
      {/* Top Header */}
      <div className="h-16 bg-[#f0f2f5] dark:bg-slate-900 border-b border-[#e9edef] dark:border-slate-800 px-2 sm:px-4 flex items-center justify-between z-10 shrink-0">
        {/* Mobile Back Button & User Info */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            onClick={() => setActiveChatId(null)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors shrink-0"
            title="Back to Chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveProfileUser(targetPartner)}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
          <div className="relative">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover border border-[#e9edef] group-hover:scale-105 transition-transform"
            />
            {!activeChat.isGroup && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-[#111b21] text-sm flex items-center gap-1.5 group-hover:text-[#00a884] transition-colors">
              {activeChat.name}
              {activeChat.isGroup && (
                <span className="text-[10px] bg-[#e9edef] text-[#54656f] px-2 py-0.5 rounded-full font-normal">
                  Group
                </span>
              )}
            </h2>
            <p className="text-xs text-[#667781] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#00a884] inline" />
              {activeChat.isGroup
                ? `${participants.length} members`
                : targetPartner?.status === 'online'
                ? 'Online'
                : `Last seen ${targetPartner?.lastSeen || 'recently'}`}
            </p>
          </div>
        </div>
      </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {isSearchingThread ? (
            <div className="flex items-center gap-1 bg-white border border-[#e9edef] rounded-xl px-2.5 py-1 shadow-xs">
              <Search className="w-4 h-4 text-[#667781]" />
              <input
                type="text"
                placeholder="Search thread..."
                value={searchInChat}
                onChange={(e) => setSearchInChat(e.target.value)}
                className="bg-transparent text-xs text-[#111b21] focus:outline-none w-32 md:w-48"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsSearchingThread(false);
                  setSearchInChat('');
                }}
                className="p-1 hover:text-[#111b21] text-[#667781]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchingThread(true)}
              className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
              title="Search Messages"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => openWhatsApp(targetPartner.phone)}
            className="px-2.5 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title={`Send message on WhatsApp to ${targetPartner.phone}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => startCall(targetPartner, 'voice')}
            className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
            title="HD Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => startCall(targetPartner, 'video')}
            className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
            title="HD Video Call"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveProfileUser(targetPartner)}
            className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
            title="Info & Media"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream Canvas */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${chatWallpaper} transition-all`}>
        {/* E2EE Banner */}
        <div className="flex justify-center my-2">
          <div className="bg-white/90 border border-[#e9edef] text-[#667781] text-xs px-4 py-2 rounded-xl flex items-center gap-2 max-w-md text-center shadow-xs">
            <Lock className="w-4 h-4 text-[#00a884] shrink-0" />
            <span>
              Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </span>
          </div>
        </div>

        {/* Message Cards */}
        {displayedMessages.map((msg) => {
          if (msg.deletedForMe) return null;

          const isMe = msg.senderId === currentUser.id;
          const senderObj = participants.find((p) => p.id === msg.senderId);

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Message Container */}
              <div
                className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl p-3 shadow-xs transition-all ${
                  isMe
                    ? 'bg-[#dcf8c6] text-[#111b21] rounded-tr-none border border-transparent'
                    : 'bg-white text-[#111b21] rounded-tl-none border border-[#e9edef]'
                }`}
              >
                {/* Group Sender Label */}
                {activeChat.isGroup && !isMe && senderObj && (
                  <p className="text-[11px] font-bold text-[#00a884] mb-1">
                    {senderObj.name}
                  </p>
                )}

                {/* Reply Context Box */}
                {msg.replyToMessage && (
                  <div className="mb-2 p-2 rounded-xl bg-black/5 border-l-2 border-[#00a884] text-xs text-[#111b21]">
                    <p className="font-semibold text-[#00a884]">{msg.replyToMessage.senderName}</p>
                    <p className="truncate opacity-80">{msg.replyToMessage.content}</p>
                  </div>
                )}

                {/* Message Content according to type */}
                {msg.deletedForEveryone ? (
                  <p className="italic text-xs text-[#667781] flex items-center gap-1.5 py-0.5">
                    <Info className="w-3.5 h-3.5 text-[#8696a0]" />
                    This message was deleted
                  </p>
                ) : (
                  <>
                    {/* Text Message */}
                    {msg.type === 'text' && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    )}

                    {/* Image Message */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div className="space-y-1.5">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared attachment"
                          className="rounded-xl max-h-72 w-full object-cover border border-[#e9edef] cursor-pointer hover:opacity-95 transition-opacity"
                        />
                        {msg.content && msg.content !== 'Shared a photo' && (
                          <p className="text-xs text-[#111b21] mt-1">{msg.content}</p>
                        )}
                      </div>
                    )}

                    {/* Audio Voice Note Message */}
                    {msg.type === 'audio' && (
                      <div className="flex items-center gap-3 bg-black/5 p-2.5 rounded-xl border border-[#e9edef] min-w-[200px]">
                        <button
                          onClick={() =>
                            setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                          }
                          className="p-2.5 rounded-full bg-[#00a884] text-white font-bold hover:scale-105 transition-transform"
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 h-6">
                            {[40, 70, 30, 90, 60, 100, 40, 80, 50, 90, 30, 60].map((h, i) => (
                              <span
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  playingAudioId === msg.id
                                    ? 'bg-[#00a884] animate-pulse'
                                    : 'bg-[#8696a0]'
                                }`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#667781] font-mono mt-0.5 block">
                            0:{msg.duration || 15}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Poll Message */}
                    {msg.type === 'poll' && msg.poll && (
                      <div className="space-y-3 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#00a884]" />
                          <h4 className="font-bold text-sm text-[#111b21]">{msg.poll.question}</h4>
                        </div>
                        <div className="space-y-2">
                          {msg.poll.options.map((opt) => {
                            const totalVotes = msg.poll?.options.reduce(
                              (acc, o) => acc + o.votes.length,
                              0
                            ) || 1;
                            const votePercentage = Math.round((opt.votes.length / totalVotes) * 100);
                            const hasVoted = opt.votes.includes(currentUser.id);

                            return (
                              <button
                                key={opt.id}
                                onClick={() => votePoll(msg.chatId, msg.id, opt.id)}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                                  hasVoted
                                    ? 'bg-emerald-100/60 border-[#00a884] text-[#00a884] font-semibold'
                                    : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21] hover:border-[#d1d7db]'
                                }`}
                              >
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-[#00a884]/15 transition-all"
                                  style={{ width: `${votePercentage}%` }}
                                />
                                <div className="relative z-10 flex items-center justify-between text-xs">
                                  <span>{opt.text}</span>
                                  <span className="font-mono text-[11px] opacity-80">
                                    {votePercentage}% ({opt.votes.length})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Location Message */}
                    {msg.type === 'location' && msg.location && (
                      <div className="space-y-2">
                        <div className="bg-black/5 p-3 rounded-xl border border-[#e9edef] flex items-center gap-3">
                          <div className="p-2.5 bg-[#00a884]/20 text-[#00a884] rounded-xl border border-[#00a884]/30">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#111b21]">{msg.location.name}</p>
                            <p className="text-[10px] text-[#667781] font-mono">
                              {msg.location.latitude}, {msg.location.longitude}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gemini AI Translated Text preview */}
                    {msg.translatedText && (
                      <div className="mt-2 pt-2 border-t border-[#e9edef] text-xs bg-emerald-50/80 p-2 rounded-xl text-[#00a884]">
                        <span className="font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1 text-[#00a884] mb-0.5">
                          <Sparkles className="w-3 h-3" /> Gemini Translation
                        </span>
                        {msg.translatedText}
                      </div>
                    )}
                  </>
                )}

                {/* Reaction Badges */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {msg.reactions.map((r, i) => (
                      <span
                        key={i}
                        className="bg-white border border-[#e9edef] px-1.5 py-0.5 rounded-full text-[11px] shadow-xs"
                      >
                        {r.emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Timestamp & Status info */}
                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-[#667781] font-mono">
                  {msg.isStarred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  {msg.isPinned && <Pin className="w-3 h-3 text-[#00a884]" />}
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-[#667781] inline" />
                      )}
                    </span>
                  )}
                </div>

                {/* Hover Actions Bar */}
                <div className="absolute right-2 -top-3 hidden group-hover:flex items-center gap-1 bg-white border border-[#e9edef] rounded-xl px-1.5 py-0.5 shadow-md z-20">
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="p-1 hover:text-[#00a884] text-[#54656f] transition-colors"
                    title="Reply"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => starMessage(msg.chatId, msg.id)}
                    className="p-1 hover:text-amber-500 text-[#54656f] transition-colors"
                    title="Star Message"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => reactToMessage(msg.chatId, msg.id, '👍')}
                    className="p-1 hover:text-[#00a884] text-[#54656f] transition-colors"
                    title="React 👍"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => reactToMessage(msg.chatId, msg.id, '❤️')}
                    className="p-1 hover:text-rose-500 text-[#54656f] transition-colors"
                    title="React ❤️"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => translateMessage(msg.chatId, msg.id, 'Spanish')}
                    className="p-1 hover:text-[#00a884] text-[#54656f] transition-colors"
                    title="Translate with Gemini"
                  >
                    <Languages className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.chatId, msg.id, true)}
                    className="p-1 hover:text-rose-500 text-[#54656f] transition-colors"
                    title="Delete for Everyone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="bg-[#f0f2f5] border-t border-[#e9edef] px-4 py-2 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 border-l-2 border-[#00a884] pl-3">
            <div>
              <p className="text-xs font-bold text-[#00a884]">Replying to message</p>
              <p className="text-xs text-[#111b21] truncate max-w-md">{replyingTo.content}</p>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-[#54656f] hover:text-[#111b21]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Toolbar Bar */}
      <div className="bg-[#f0f2f5] border-t border-[#e9edef] p-3 z-10 flex items-center gap-2">
        {/* Attachment Popup Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
            title="Attach Media"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Attachment Menu Popup */}
          {showAttachmentMenu && (
            <div className="absolute left-0 bottom-14 bg-white border border-[#e9edef] rounded-2xl p-3 shadow-2xl flex flex-col gap-2 w-48 z-30">
              <button
                onClick={handleSendPhotoSample}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f6] text-[#111b21] text-xs font-medium transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-[#00a884]" />
                Photos & Videos
              </button>
              <button
                onClick={() => {
                  setShowAttachmentMenu(false);
                  setShowPollModal(true);
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f6] text-[#111b21] text-xs font-medium transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Create Poll
              </button>
              <button
                onClick={() => {
                  setShowAttachmentMenu(false);
                  setShowLocationModal(true);
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f6] text-[#111b21] text-xs font-medium transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                Share Location
              </button>
            </div>
          )}
        </div>

        {/* Emoji Button */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-xl hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Emoji Palette */}
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-14 bg-white border border-[#e9edef] rounded-2xl p-3 shadow-2xl grid grid-cols-6 gap-2 w-64 z-30">
              {['😀', '😂', '🔥', '❤️', '👍', '🙏', '🎉', '🚀', '✨', '😍', '👏', '💯'].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-2 rounded-xl hover:bg-[#f5f6f6] transition-colors"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Main Text Input or Audio Recorder */}
        {isRecordingAudio ? (
          <div className="flex-1 bg-white border border-[#00a884] rounded-2xl px-4 py-2 flex items-center justify-between text-xs text-[#00a884] animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-mono font-bold">Recording... {recordingSeconds}s</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cancelRecording}
                className="px-3 py-1 rounded-xl bg-[#e9edef] text-[#54656f] hover:text-[#111b21]"
              >
                Cancel
              </button>
              <button
                onClick={stopAndSendRecording}
                className="px-3 py-1 rounded-xl bg-[#00a884] text-white font-bold"
              >
                Send Audio
              </button>
            </div>
          </div>
        ) : (
          <textarea
            rows={1}
            placeholder="Type a message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white border border-[#e9edef] rounded-xl px-4 py-2.5 text-sm text-[#111b21] placeholder-[#667781] focus:outline-none focus:border-[#00a884] resize-none max-h-24 transition-colors"
          />
        )}

        {/* Mic or Send Buttons */}
        {inputText.trim().length > 0 ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openWhatsApp(targetPartner.phone, inputText)}
              className="p-3 rounded-2xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              title={`Send directly to ${targetPartner.name}'s real WhatsApp (${targetPartner.phone}) via wa.me`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">wa.me</span>
            </button>
            <button
              onClick={handleSendText}
              className="p-3 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold transition-all shadow-sm cursor-pointer"
              title="Send Message in App"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          !isRecordingAudio && (
            <button
              onClick={startRecording}
              className="p-3 rounded-2xl bg-white hover:bg-[#e9edef] text-[#54656f] hover:text-[#00a884] transition-colors border border-[#e9edef]"
              title="Record Voice Note"
            >
              <Mic className="w-5 h-5" />
            </button>
          )
        )}
      </div>

      {/* Modal: Create Poll */}
      {showPollModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e9edef] rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e9edef]">
              <h3 className="font-bold text-[#111b21] text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00a884]" />
                Create Poll
              </h3>
              <button
                onClick={() => setShowPollModal(false)}
                className="p-1 rounded-lg hover:bg-[#f0f2f5] text-[#54656f] hover:text-[#111b21]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#54656f] mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-[#f0f2f5] border border-[#e9edef] rounded-xl px-3 py-2 text-sm text-[#111b21] focus:outline-none focus:border-[#00a884]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#54656f] mb-1">Options</label>
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...pollOptions];
                        updated[idx] = e.target.value;
                        setPollOptions(updated);
                      }}
                      className="w-full bg-[#f0f2f5] border border-[#e9edef] rounded-xl px-3 py-2 text-sm text-[#111b21] focus:outline-none focus:border-[#00a884]"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="mt-2 text-xs font-semibold text-[#00a884] hover:underline"
                >
                  + Add Option
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="px-4 py-2 rounded-xl text-[#54656f] hover:text-[#111b21] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] shadow-sm"
                >
                  Send Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Location Picker */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e9edef] rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e9edef]">
              <h3 className="font-bold text-[#111b21] text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Share Location
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-lg hover:bg-[#f0f2f5] text-[#54656f] hover:text-[#111b21]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f0f2f5] border border-[#e9edef] p-4 rounded-xl text-center space-y-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <p className="font-bold text-[#111b21] text-sm">San Francisco Tech Hub</p>
              <p className="text-xs text-[#667781] font-mono">37.7749° N, 122.4194° W</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 rounded-xl text-[#54656f] hover:text-[#111b21] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendLocation}
                className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-sm"
              >
                Share Live Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
