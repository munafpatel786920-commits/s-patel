import React from 'react';
import { X, Phone, Video, ShieldAlert, UserX, CheckCircle, Mail, Edit3, UserCheck, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { openWhatsApp } from '../utils/whatsapp';

export const ProfileModal: React.FC = () => {
  const {
    activeProfileUser,
    setActiveProfileUser,
    currentUser,
    setActiveTab,
    startCall,
    blockUser,
    unblockUser,
    blockedUserIds,
    reportUser,
    theme
  } = useChat();

  if (!activeProfileUser) return null;

  const isSelf = activeProfileUser.id === currentUser.id;
  const isBlocked = blockedUserIds.includes(activeProfileUser.id);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none">
      <div className={`border rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-5 transition-colors ${
        theme === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-[#111b21] border-[#e9edef]'
      }`}>
        <button
          onClick={() => setActiveProfileUser(null)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
            theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-[#f0f2f5] text-[#54656f] hover:text-[#111b21]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Avatar & Info */}
        <div className="flex flex-col items-center text-center pt-2">
          <img
            src={activeProfileUser.avatar}
            alt={activeProfileUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#00a884] shadow-md mb-3"
          />
          <h2 className="text-xl font-bold flex items-center gap-1.5">
            {activeProfileUser.name}
            {activeProfileUser.isVerified && (
              <CheckCircle className="w-4 h-4 text-[#00a884] fill-[#e7fce3]" />
            )}
          </h2>
          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
            {activeProfileUser.phone}
          </p>
          {isSelf && (
            <span className="mt-2 px-3 py-1 bg-[#e7fce3] text-[#00a884] text-[11px] font-bold rounded-full border border-[#00a884]/30">
              This is Your Account
            </span>
          )}
        </div>

        {!isSelf ? (
          /* Action Call & WhatsApp Buttons for other contacts */
          <div className="flex flex-col gap-2 py-2 border-y border-[#e9edef] dark:border-slate-800">
            <button
              onClick={() => openWhatsApp(activeProfileUser.phone)}
              className="w-full py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Send WhatsApp Message ({activeProfileUser.phone})
            </button>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setActiveProfileUser(null);
                  startCall(activeProfileUser, 'voice');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' : 'bg-[#f0f2f5] hover:bg-[#e9edef] text-[#111b21]'
                }`}
              >
                <Phone className="w-4 h-4 text-[#00a884]" />
                Voice Call
              </button>
              <button
                onClick={() => {
                  setActiveProfileUser(null);
                  startCall(activeProfileUser, 'video');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' : 'bg-[#f0f2f5] hover:bg-[#e9edef] text-[#111b21]'
                }`}
              >
                <Video className="w-4 h-4 text-[#00a884]" />
                Video Call
              </button>
            </div>
          </div>
        ) : (
          /* Button for Self: Go to Settings */
          <div className="py-2 border-y border-[#e9edef] dark:border-slate-800">
            <button
              onClick={() => {
                setActiveProfileUser(null);
                setActiveTab('settings');
              }}
              className="w-full py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile in Settings
            </button>
          </div>
        )}

        {/* About & Info */}
        <div className="space-y-3 text-xs">
          <div className={`p-3 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-[#f0f2f5] border-[#e9edef]'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
              About / Bio Status
            </span>
            <p className="font-medium italic">"{activeProfileUser.about}"</p>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-[#f0f2f5] border-[#e9edef]'
          }`}>
            <Mail className="w-4 h-4 text-[#00a884] shrink-0" />
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                Email
              </span>
              <p className="font-medium">{activeProfileUser.email}</p>
            </div>
          </div>
        </div>

        {/* Block & Report for Other Users */}
        {!isSelf && (
          <div className="pt-2 flex items-center justify-between gap-3 text-xs">
            {isBlocked ? (
              <button
                onClick={() => {
                  unblockUser(activeProfileUser.id);
                  setActiveProfileUser(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Unblock Contact
              </button>
            ) : (
              <button
                onClick={() => {
                  blockUser(activeProfileUser.id);
                  setActiveProfileUser(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 font-bold hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserX className="w-4 h-4" />
                Block Contact
              </button>
            )}

            <button
              onClick={() => {
                reportUser(activeProfileUser.id, 'User profile review', 'Reported via profile view');
                setActiveProfileUser(null);
              }}
              className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-600 font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              Report Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
