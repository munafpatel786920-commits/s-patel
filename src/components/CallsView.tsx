import React from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { openWhatsApp } from '../utils/whatsapp';

export const CallsView: React.FC = () => {
  const { calls, startCall, contacts, theme } = useChat();

  return (
    <div className={`flex-1 flex flex-col h-full select-none overflow-y-auto border-l transition-colors ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
    }`}>
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
      }`}>
        <h1 className="text-2xl font-bold">Call History</h1>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
          HD voice &amp; video calls log
        </p>
      </div>

      <div className="p-6 max-w-4xl mx-auto w-full space-y-4">
        {calls.map((call) => {
          const isIncoming = call.status === 'incoming';
          const isMissed = call.status === 'missed';

          return (
            <div
              key={call.id}
              className={`border rounded-2xl p-4 flex items-center justify-between shadow-xs transition-colors ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={call.callerAvatar}
                  alt={call.callerName}
                  className="w-12 h-12 rounded-full object-cover border border-[#e9edef] dark:border-slate-800"
                />
                <div>
                  <h3 className="font-bold text-sm">{call.callerName}</h3>
                  <div className="flex items-center gap-1.5 text-xs mt-0.5">
                    {isMissed ? (
                      <span className="flex items-center gap-1 text-rose-500 font-semibold">
                        <PhoneMissed className="w-3.5 h-3.5" /> Missed Call
                      </span>
                    ) : isIncoming ? (
                      <span className="flex items-center gap-1 text-[#00a884] font-semibold">
                        <PhoneIncoming className="w-3.5 h-3.5" /> Incoming
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-500 font-semibold">
                        <PhoneOutgoing className="w-3.5 h-3.5" /> Outgoing
                      </span>
                    )}
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}>• {call.timestamp}</span>
                    {call.duration && <span className={theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}>• {call.duration}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = (contacts || []).find((c) => c.name === call.callerName) || contacts[0];
                    if (target) openWhatsApp(target.phone);
                  }}
                  className="p-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white transition-colors cursor-pointer shadow-xs"
                  title="Open WhatsApp Chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const target = (contacts || []).find((c) => c.name === call.callerName) || contacts[0];
                    if (target) startCall(target, 'voice');
                  }}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer text-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-[#f0f2f5] hover:bg-[#e9edef]'
                  }`}
                  title="Call Back (Voice)"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const target = (contacts || []).find((c) => c.name === call.callerName) || contacts[0];
                    if (target) startCall(target, 'video');
                  }}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer text-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-[#f0f2f5] hover:bg-[#e9edef]'
                  }`}
                  title="Call Back (Video)"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
