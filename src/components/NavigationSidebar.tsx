import React from 'react';
import {
  MessageSquare,
  CircleDashed,
  Users,
  Phone,
  Bot,
  ShieldCheck,
  Settings,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { NavigationTab } from '../types';

export const NavigationSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setActiveProfileUser,
    isAppLocked,
    toggleAppLock,
    wsConnected,
    statuses,
    theme
  } = useChat();

  const hasUnreadStatus = statuses.length > 0;

  const navItems: { id: NavigationTab; label: string; shortLabel: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      id: 'chats',
      label: 'Chats',
      shortLabel: 'Chats',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 'status',
      label: 'Status Updates',
      shortLabel: 'Status',
      icon: <CircleDashed className="w-5 h-5" />,
      badge: hasUnreadStatus
    },
    {
      id: 'communities',
      label: 'Communities & Channels',
      shortLabel: 'Channels',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'calls',
      label: 'Calls',
      shortLabel: 'Calls',
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      shortLabel: 'AI Bot',
      icon: <Bot className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      shortLabel: 'Admin',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'settings',
      label: 'Settings',
      shortLabel: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <footer className="w-full max-w-full bg-slate-950 border-t border-slate-800/80 text-slate-100 flex items-center justify-between px-2 sm:px-3 py-1 select-none z-30 shrink-0 shadow-2xl overflow-x-hidden">
      {/* Left Logo & Connectivity Status */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab('chats')}
          className="p-1.5 rounded-lg bg-[#00a884] text-white hover:bg-[#008f6f] transition-all shadow-xs cursor-pointer"
          title="ChatConnect Home"
        >
          <div className="w-5 h-5 flex items-center justify-center font-black text-xs text-white">
            C
          </div>
        </button>

        {/* Live WS connection indicator (Visible on medium+ screens) */}
        <div
          className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${
            wsConnected
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-amber-950/80 text-amber-300 border-amber-800'
          }`}
          title={wsConnected ? 'Real-time WebSocket Live' : 'Connecting to Server...'}
        >
          {wsConnected ? <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> : <WifiOff className="w-3 h-3" />}
          <span>{wsConnected ? 'LIVE' : 'SYNC'}</span>
        </div>
      </div>

      {/* Middle Dashboard Navigation Items */}
      <nav className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 flex-1 min-w-0 max-w-3xl mx-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl transition-all duration-150 group cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#00a884]/20 text-[#00a884] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#25d366] animate-ping" />
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium mt-0.5 whitespace-nowrap leading-none hidden xs:inline-block">
                {item.shortLabel}
              </span>

              {/* Tooltip on hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-[10px] px-2 py-0.5 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Lock & Profile */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggleAppLock}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isAppLocked
              ? 'bg-amber-950 text-amber-300 border-amber-800'
              : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
          title={isAppLocked ? 'App is Locked' : 'Lock Application'}
        >
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={() => setActiveProfileUser(currentUser)}
          className="relative group rounded-full ring-2 ring-[#00a884]/40 hover:ring-[#00a884] transition-all p-0.5 cursor-pointer"
          title={`${currentUser.name} - Profile`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#25d366] border border-slate-950 rounded-full" />
        </button>
      </div>
    </footer>
  );
};
