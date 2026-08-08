import React, { useState } from 'react';
import { Users, Check, Bell, Plus, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CommunitiesChannels: React.FC = () => {
  const { channels, communities, followChannel } = useChat();
  const [activeTab, setActiveTab] = useState<'channels' | 'communities'>('channels');

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col h-full select-none overflow-y-auto border-l border-[#e9edef]">
      {/* Header */}
      <div className="p-6 border-b border-[#e9edef] bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111b21]">Communities & Channels</h1>
            <p className="text-xs text-[#667781] mt-1">
              Stay updated with topics, news feeds, and group broadcasts you follow
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'channels'
                ? 'bg-[#00a884] text-white border-[#00a884]'
                : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:text-[#111b21]'
            }`}
          >
            Public Channels ({channels.length})
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'communities'
                ? 'bg-[#00a884] text-white border-[#00a884]'
                : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:text-[#111b21]'
            }`}
          >
            Communities ({communities.length})
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {activeTab === 'channels' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((chan) => (
              <div
                key={chan.id}
                className="bg-white border border-[#e9edef] rounded-2xl p-5 flex flex-col justify-between hover:border-[#d1d7db] transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={chan.avatar}
                        alt={chan.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#e9edef]"
                      />
                      <div>
                        <h3 className="font-bold text-[#111b21] text-sm flex items-center gap-1.5">
                          {chan.name}
                        </h3>
                        <p className="text-xs text-[#667781]">
                          {chan.followersCount.toLocaleString()} followers
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => followChannel(chan.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        chan.isFollowing
                          ? 'bg-[#f0f2f5] text-[#54656f] border border-[#e9edef] hover:bg-[#e9edef]'
                          : 'bg-[#00a884] text-white hover:bg-[#008f6f]'
                      }`}
                    >
                      {chan.isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00a884]" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#54656f] mb-4 leading-relaxed">{chan.description}</p>

                  {chan.lastUpdate && (
                    <div className="bg-[#f0f2f5] p-3 rounded-xl border border-[#e9edef] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#667781]">
                        <span className="font-semibold text-[#00a884]">Latest Broadcast</span>
                        <span>{chan.lastUpdate.timestamp}</span>
                      </div>
                      <p className="text-[#111b21]">{chan.lastUpdate.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {communities.map((comm) => (
              <div
                key={comm.id}
                className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={comm.avatar}
                    alt={comm.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#e9edef]"
                  />
                  <div>
                    <h3 className="font-bold text-[#111b21] text-base">{comm.name}</h3>
                    <p className="text-xs text-[#667781] mb-1">{comm.description}</p>
                    <p className="text-[11px] font-semibold text-[#00a884]">
                      {comm.memberCount} members
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#e9edef] border-t border-[#e9edef] pt-3">
                  {comm.channels.map((ch) => (
                    <div
                      key={ch.id}
                      className="py-2.5 flex items-center justify-between hover:bg-[#f0f2f5] px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#00a884]" />
                        <span className="text-xs font-semibold text-[#111b21]">{ch.name}</span>
                      </div>
                      {ch.unreadCount > 0 && (
                        <span className="bg-[#00a884] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {ch.unreadCount} new
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
