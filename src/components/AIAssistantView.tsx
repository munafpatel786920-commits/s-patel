import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Copy, Check } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const AIAssistantView: React.FC = () => {
  const { sendAiPrompt, currentUser } = useChat();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [aiThread, setAiThread] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello ${currentUser.name}! I am your ChatConnect AI Assistant, powered by Gemini 3.6 Flash. How can I help you today? Ask me to write messages, summarize notes, generate status ideas, or translate phrases!`
    }
  ]);

  const samplePrompts = [
    'Draft a polite message rescheduling today’s 3 PM call to tomorrow',
    'Write a catchy status update about launching a new web app',
    'Summarize key tips for effective team communication in 3 bullet points',
    'Translate "Hello my friend, hope you are having a wonderful day" into Spanish, French, and German'
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isGenerating) return;

    const userEntry = { role: 'user' as const, content: promptText };
    setAiThread((prev) => [...prev, userEntry]);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const response = await sendAiPrompt(promptText);
      setAiThread((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setAiThread((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an issue. Please try again.' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col h-full select-none overflow-hidden border-l border-[#e9edef]">
      {/* Header */}
      <div className="p-4 border-b border-[#e9edef] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#e7fce3] border border-[#00a884]/20 text-[#00a884]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#111b21] flex items-center gap-2">
              ChatConnect AI Assistant
              <span className="text-[10px] bg-[#e7fce3] text-[#00a884] font-mono px-2 py-0.5 rounded-full border border-[#00a884]/30">
                Gemini 3.6 Flash
              </span>
            </h1>
            <p className="text-xs text-[#667781]">Smart message generator & translation assistant</p>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {aiThread.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#e7fce3] text-[#00a884] border border-[#00a884]/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-xs'
                    : 'bg-white border border-[#e9edef] text-[#111b21] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 p-1 text-[#667781] hover:text-[#111b21] transition-colors"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#00a884]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isUser && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                />
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-3 text-[#00a884] text-xs font-semibold animate-pulse p-2">
            <Sparkles className="w-4 h-4" />
            AI is thinking...
          </div>
        )}
      </div>

      {/* Sample Prompt Chips */}
      <div className="p-3 bg-[#f0f2f5] border-t border-[#e9edef] max-w-4xl mx-auto w-full">
        <div className="flex gap-2 overflow-x-auto no-scrollbar text-xs pb-1">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#e9edef] text-[#54656f] whitespace-nowrap border border-[#e9edef] transition-colors shrink-0 shadow-xs"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#e9edef] bg-white max-w-4xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI assistant anything..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-[#f0f2f5] border border-[#e9edef] rounded-2xl px-4 py-3 text-sm text-[#111b21] placeholder-[#667781] focus:outline-none focus:border-[#00a884]"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isGenerating}
            className="p-3 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white font-bold transition-all shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
