import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const AppLockOverlay: React.FC = () => {
  const { isAppLocked, unlockApp, appPin, theme } = useChat();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAppLocked) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockApp(pinInput);
    if (!success) {
      setErrorMsg(`Incorrect PIN! Enter your PIN or ${appPin}`);
      setPinInput('');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className={`border rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl space-y-6 transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
      }`}>
        <div className="w-16 h-16 rounded-3xl bg-[#e7fce3] border border-[#00a884]/20 text-[#00a884] flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-bold">ChatConnect Locked</h2>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
            Enter your 4-digit security PIN to access chats
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className={`w-full border rounded-2xl py-3 px-4 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-[#00a884] ${
                theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
              }`}
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-500 font-semibold mt-2">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Unlock ChatConnect
          </button>
        </form>

        <p className={`text-[11px] flex items-center justify-center gap-1 ${
          theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
          Current PIN code: <code className="text-[#00a884] font-mono font-bold">{appPin}</code>
        </p>
      </div>
    </div>
  );
};
