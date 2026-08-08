import React, { useState } from 'react';
import {
  Search,
  Plus,
  Pin,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  MapPin,
  HelpCircle,
  VolumeX,
  Users,
  X,
  UserPlus,
  Phone,
  UserCheck,
  MessageCircle
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { openWhatsApp } from '../utils/whatsapp';

export const ChatList: React.FC = () => {
  const {
    chats,
    contacts,
    activeChatId,
    setActiveChatId,
    typingUsers,
    createNewChat,
    createNewGroup,
    addContact,
    addContactAndStartChat,
    theme
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'pinned'>('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  // New Contact / Member form state
  const [isAddingNewContact, setIsAddingNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactAbout, setNewContactAbout] = useState('');
  const [modalSearch, setModalSearch] = useState('');

  // Group creation form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [showGroupAddMemberForm, setShowGroupAddMemberForm] = useState(false);
  const [groupNewMemberName, setGroupNewMemberName] = useState('');
  const [groupNewMemberPhone, setGroupNewMemberPhone] = useState('');

  // Filter chats
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'unread') return chat.unreadCount > 0;
    if (filter === 'groups') return chat.isGroup;
    if (filter === 'pinned') return chat.isPinned;
    return true;
  });

  // Sort pinned first
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Filter modal contacts
  const filteredContacts = (contacts || []).filter((c) =>
    c.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
    c.phone.includes(modalSearch)
  );

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert('Please enter both name and phone number.');
      return;
    }

    const name = newContactName.trim();
    const phone = newContactPhone.trim();
    addContactAndStartChat(name, phone, newContactAbout.trim());
    
    setIsAddingNewContact(false);
    setShowNewChatModal(false);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactAbout('');
    setModalSearch('');
    triggerToast(`✅ Member "${name}" (${phone}) saved successfully!`);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedParticipants.length === 0) {
      alert('Please enter a group name and select at least 1 participant');
      return;
    }
    createNewGroup(groupName, selectedParticipants, groupDescription);
    setShowNewGroupModal(false);
    setGroupName('');
    setGroupDescription('');
    setSelectedParticipants([]);
    setShowGroupAddMemberForm(false);
  };

  const handleAddMemberToGroupDirectly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNewMemberName.trim() || !groupNewMemberPhone.trim()) {
      alert('Please enter member name and phone number.');
      return;
    }

    const created = addContact(groupNewMemberName.trim(), groupNewMemberPhone.trim());
    setSelectedParticipants((prev) => [...prev, created.id]);
    triggerToast(`✅ Added member "${created.name}" (${created.phone})`);
    setGroupNewMemberName('');
    setGroupNewMemberPhone('');
    setShowGroupAddMemberForm(false);
  };

  const toggleParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  return (
    <div className={`w-full md:w-80 lg:w-96 border-r flex-col h-full select-none transition-colors relative ${
      activeChatId ? 'hidden md:flex' : 'flex'
    } ${
      theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
    }`}>
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="absolute top-2 left-3 right-3 z-50 bg-[#00a884] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-bounce">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className={`p-4 border-b flex flex-col gap-3 ${
        theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-[#f0f2f5] border-[#e9edef]'
      }`}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Chats
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00a884]/15 text-[#00a884]">
              {chats.length}
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAddingNewContact(false);
                setShowNewChatModal(true);
              }}
              className="p-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold transition-all shadow-xs flex items-center gap-1.5 text-xs cursor-pointer"
              title="New Chat or Add Member"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#667781] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search or start new chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#00a884] transition-all ${
              theme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-[#f0f2f5] border-transparent text-[#111b21] placeholder-[#667781]'
            }`}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'groups', label: 'Groups' },
              { id: 'pinned', label: 'Pinned' }
            ] as const
          ).map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              className={`px-3 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                filter === chip.id
                  ? 'bg-[#00a884] text-white font-medium shadow-xs'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-[#54656f] border border-[#e9edef] hover:bg-[#f5f6f6]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List Items */}
      <div className={`flex-1 overflow-y-auto divide-y ${
        theme === 'dark' ? 'divide-slate-800/60' : 'divide-[#e9edef]'
      }`}>
        {sortedChats.length === 0 ? (
          <div className="p-6 text-center text-[#667781] dark:text-slate-400 flex flex-col items-center gap-3">
            <Search className="w-8 h-8 opacity-40 text-[#00a884]" />
            <p className="text-sm font-medium">No active chats found</p>

            {/* If user typed a search query, check if any saved contact matches or offer to save it */}
            {searchQuery.trim() && (
              <div className="w-full space-y-3 pt-2 border-t border-[#e9edef] dark:border-slate-800">
                {/* Check for matching saved contacts without an active chat */}
                {contacts
                  .filter(
                    (c) =>
                      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.phone.includes(searchQuery)
                  )
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left ${
                        theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-[#e9edef]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#111b21] dark:text-slate-100 truncate">
                          {contact.name}
                        </p>
                        <p className="text-[11px] text-[#667781] dark:text-slate-400 truncate">
                          {contact.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => createNewChat(contact.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#00a884] text-white text-xs font-bold hover:bg-[#008f6f] cursor-pointer"
                      >
                        Start Chat
                      </button>
                    </div>
                  ))}

                {/* Direct option to save the typed number as a new contact */}
                <button
                  onClick={() => {
                    const isNumber = /^[0-9+ \-]+$/.test(searchQuery.trim());
                    if (isNumber) {
                      setNewContactPhone(searchQuery.trim());
                      setNewContactName('');
                    } else {
                      setNewContactName(searchQuery.trim());
                      setNewContactPhone('');
                    }
                    setIsAddingNewContact(true);
                    setShowNewChatModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#00a884]/15 hover:bg-[#00a884]/25 text-[#00a884] dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-[#00a884]/30 cursor-pointer transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  + Save &quot;{searchQuery}&quot; as New Contact
                </button>
              </div>
            )}
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = activeChatId === chat.id;
            const typingList = typingUsers[chat.id] || [];
            const isTyping = typingList.length > 0;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-slate-800/80 border-l-4 border-l-[#00a884]'
                      : 'bg-[#f0f2f5] border-l-4 border-l-[#00a884]'
                    : theme === 'dark'
                    ? 'hover:bg-slate-800/40 bg-slate-900'
                    : 'hover:bg-[#f5f6f6] bg-white'
                }`}
              >
                {/* Avatar with Online or Group indicator */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#e9edef] dark:border-slate-800"
                  />
                  {chat.isGroup ? (
                    <span className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-0.5 rounded-full shadow-xs">
                      <Users className="w-3.5 h-3.5 text-[#00a884]" />
                    </span>
                  ) : (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#25d366] border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate flex items-center gap-1.5">
                      {chat.name}
                      {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-[#8696a0]" />}
                    </h3>
                    <span className="text-[11px] text-[#667781] dark:text-slate-400 font-medium shrink-0">
                      {chat.lastMessage?.timestamp || ''}
                    </span>
                  </div>

                  {/* Subtitle / Last Message / Typing */}
                  <div className="flex items-center justify-between text-xs text-[#667781] dark:text-slate-400">
                    <div className="truncate pr-2 flex items-center gap-1">
                      {isTyping ? (
                        <span className="text-[#00a884] font-medium animate-pulse">
                          {typingList.join(', ')} is typing...
                        </span>
                      ) : (
                        <>
                          {chat.lastMessage?.senderId === 'user_current' && (
                            <span className="shrink-0 text-[#667781]">
                              {chat.lastMessage.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-[#667781] inline" />
                              )}
                            </span>
                          )}

                          {chat.lastMessage?.type === 'image' && (
                            <span className="flex items-center gap-1 text-[#54656f] dark:text-slate-300">
                              <ImageIcon className="w-3.5 h-3.5 text-[#00a884]" />
                              Photo
                            </span>
                          )}
                          {chat.lastMessage?.type === 'audio' && (
                            <span className="flex items-center gap-1 text-[#54656f] dark:text-slate-300">
                              <Mic className="w-3.5 h-3.5 text-[#00a884]" />
                              Voice Message
                            </span>
                          )}
                          {chat.lastMessage?.type === 'location' && (
                            <span className="flex items-center gap-1 text-[#54656f] dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-[#00a884]" />
                              Location
                            </span>
                          )}
                          {chat.lastMessage?.type === 'poll' && (
                            <span className="flex items-center gap-1 text-[#54656f] dark:text-slate-300">
                              <HelpCircle className="w-3.5 h-3.5 text-[#00a884]" />
                              Poll
                            </span>
                          )}
                          {chat.lastMessage?.type === 'text' && (
                            <span className="truncate">{chat.lastMessage.content}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Pin & Unread Counter */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.isPinned && <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />}
                      {chat.unreadCount > 0 && (
                        <span className="bg-[#25d366] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Select Contact / Add New Member Number */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 transition-colors ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] dark:border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span>{isAddingNewContact ? 'Add New Member / Number' : 'Select Contact'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setIsAddingNewContact(false);
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-[#f0f2f5] text-[#54656f]'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsAddingNewContact(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  !isAddingNewContact
                    ? 'bg-[#00a884]/15 border-[#00a884] text-[#00a884]'
                    : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-[#f0f2f5] border-[#e9edef] text-[#54656f]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Select Existing ({contacts.length})
              </button>
              <button
                onClick={() => setIsAddingNewContact(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isAddingNewContact
                    ? 'bg-[#00a884]/15 border-[#00a884] text-[#00a884]'
                    : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-[#f0f2f5] border-[#e9edef] text-[#54656f]'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#00a884]" />
                + Add Member Number
              </button>
            </div>

            {!isAddingNewContact ? (
              /* SELECT EXISTING CONTACT VIEW */
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#667781] dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search contact name or phone number..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#00a884] ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                  />
                </div>

                <div className="divide-y divide-[#e9edef] dark:divide-slate-800 max-h-64 overflow-y-auto rounded-xl border border-[#e9edef] dark:border-slate-800">
                  {filteredContacts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#667781] space-y-2">
                      <p>No contact matching "{modalSearch}"</p>
                      <button
                        onClick={() => {
                          setNewContactPhone(modalSearch);
                          setIsAddingNewContact(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] cursor-pointer inline-flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Add "{modalSearch}" as new number
                      </button>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                          theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-[#f5f6f6]'
                        }`}
                      >
                        <div
                          onClick={() => {
                            createNewChat(contact.id);
                            setShowNewChatModal(false);
                            setModalSearch('');
                          }}
                          className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                        >
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#00a884]/30"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                              {contact.phone} • {contact.about}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhatsApp(contact.phone);
                          }}
                          className="p-2 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                          title={`Open direct WhatsApp chat with ${contact.name} (${contact.phone})`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-[10px] font-bold hidden sm:inline">WhatsApp</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Create Group Button inside Modal */}
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setShowNewGroupModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#e9edef] dark:bg-slate-800 text-[#00a884] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d1d7db] dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Create New Group with Contacts
                </button>
              </div>
            ) : (
              /* FORM: ADD NEW MEMBER NUMBER */
              <form onSubmit={handleCreateContactSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                    Member / Contact Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00a884] ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#00a884]" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00a884] ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                    About / Bio Status (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hey there! I am using ChatConnect."
                    value={newContactAbout}
                    onChange={(e) => setNewContactAbout(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00a884] ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewContact(false)}
                    className="px-3 py-2 rounded-xl text-[#54656f] dark:text-slate-300 hover:bg-[#e9edef]/50 dark:hover:bg-slate-800 text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newContactName.trim() || !newContactPhone.trim()) {
                        alert('Please fill in Name and Phone Number');
                        return;
                      }
                      const name = newContactName.trim();
                      const phone = newContactPhone.trim();
                      addContactAndStartChat(name, phone, newContactAbout.trim());
                      openWhatsApp(phone, `Hi ${name}!`);
                      setIsAddingNewContact(false);
                      setShowNewChatModal(false);
                      setNewContactName('');
                      setNewContactPhone('');
                      setNewContactAbout('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#25d366] text-white font-bold text-xs hover:bg-[#20ba5a] shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Save & Open WhatsApp
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Save & Start Chat
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create New Group */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 transition-colors ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] dark:border-slate-800">
              <h3 className="font-bold text-lg">Create New Group</h3>
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setShowGroupAddMemberForm(false);
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-[#f0f2f5] text-[#54656f]'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                  Group Subject Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Product Design Team"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of group purpose"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                />
              </div>

              {/* Group Members Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400">
                    Add Participants ({selectedParticipants.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGroupAddMemberForm(!showGroupAddMemberForm)}
                    className="text-xs text-[#00a884] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + Add New Number
                  </button>
                </div>

                {/* Inline form to add a new member by phone number directly into group */}
                {showGroupAddMemberForm && (
                  <div className={`p-3 rounded-xl border mb-3 space-y-2 ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <p className="text-[11px] font-bold text-[#00a884]">Add New Member Phone Number to Group</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={groupNewMemberName}
                        onChange={(e) => setGroupNewMemberName(e.target.value)}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-xs ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-[#e9edef]'
                        }`}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={groupNewMemberPhone}
                        onChange={(e) => setGroupNewMemberPhone(e.target.value)}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-[#e9edef]'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMemberToGroupDirectly}
                      className="w-full py-1.5 rounded-lg bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] cursor-pointer"
                    >
                      Add Member to Selection
                    </button>
                  </div>
                )}

                <div className={`divide-y max-h-40 overflow-y-auto rounded-xl border ${
                  theme === 'dark' ? 'divide-slate-800 border-slate-800' : 'divide-[#e9edef] border-[#e9edef]'
                }`}>
                  {contacts.filter((c) => c.id !== 'user_ai_assistant').map((contact) => {
                    const isSelected = selectedParticipants.includes(contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => toggleParticipant(contact.id)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#00a884]/15'
                            : theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-[#f5f6f6]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-semibold block truncate">
                              {contact.name}
                            </span>
                            <span className={`text-[10px] block truncate ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                              {contact.phone}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-[#00a884] focus:ring-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2 rounded-xl text-[#54656f] dark:text-slate-300 hover:bg-[#e9edef]/50 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] shadow-xs cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
