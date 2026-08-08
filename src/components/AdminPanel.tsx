import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Phone,
  AlertTriangle,
  Send,
  CheckCircle,
  XCircle,
  UserX
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { CONTACTS } from '../data/mockData';

export const AdminPanel: React.FC = () => {
  const { adminStats, reportedItems, resolveReport, sendSystemAnnouncement, blockUser, contacts } = useChat();

  const [announcementText, setAnnouncementText] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'reports' | 'users'>('overview');

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    sendSystemAnnouncement(announcementText.trim());
    alert('System announcement sent to all active chat groups!');
    setAnnouncementText('');
  };

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col h-full select-none overflow-y-auto border-l border-[#e9edef]">
      {/* Top Bar */}
      <div className="p-6 border-b border-[#e9edef] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#e7fce3] text-[#00a884] border border-[#00a884]/20 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111b21] flex items-center gap-2">
              ChatConnect Admin Panel
              <span className="text-xs font-semibold bg-[#e7fce3] text-[#00a884] px-2 py-0.5 rounded-full border border-[#00a884]/30">
                Super Admin
              </span>
            </h1>
            <p className="text-xs text-[#667781]">System metrics, moderation queue, and user management</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeAdminTab === 'overview'
                ? 'bg-[#00a884] text-white border-[#00a884]'
                : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:text-[#111b21]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeAdminTab === 'reports'
                ? 'bg-[#00a884] text-white border-[#00a884]'
                : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:text-[#111b21]'
            }`}
          >
            Reported Content ({reportedItems.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeAdminTab === 'users'
                ? 'bg-[#00a884] text-white border-[#00a884]'
                : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:text-[#111b21]'
            }`}
          >
            User Directory
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {activeAdminTab === 'overview' && (
          <>
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#667781] uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-extrabold text-[#111b21] mt-1">
                    {adminStats.totalUsers.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-[#00a884] font-semibold">+12% this week</span>
                </div>
                <div className="p-3 bg-[#e7fce3] text-[#00a884] rounded-xl border border-[#00a884]/20">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#667781] uppercase tracking-wider">Messages Today</p>
                  <h3 className="text-2xl font-extrabold text-[#111b21] mt-1">
                    {adminStats.messagesSentToday.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-[#00a884] font-semibold">Real-time WebSockets</span>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#667781] uppercase tracking-wider">Call Duration</p>
                  <h3 className="text-2xl font-extrabold text-[#111b21] mt-1">
                    {adminStats.totalCallsDurationMinutes.toLocaleString()} m
                  </h3>
                  <span className="text-[10px] text-purple-600 font-semibold">WebRTC HD Stream</span>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
                  <Phone className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#667781] uppercase tracking-wider">Pending Reports</p>
                  <h3 className="text-2xl font-extrabold text-[#111b21] mt-1">
                    {reportedItems.filter((r) => r.status === 'pending').length}
                  </h3>
                  <span className="text-[10px] text-amber-600 font-semibold">Action required</span>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* System Announcement Box */}
            <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-[#111b21] text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00a884]" />
                Broadcast System Announcement
              </h3>
              <form onSubmit={handleSendAnnouncement} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type broadcast announcement message..."
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="flex-1 bg-[#f0f2f5] border border-[#e9edef] rounded-xl px-4 py-2.5 text-sm text-[#111b21] focus:outline-none focus:border-[#00a884]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00a884] text-white font-bold text-xs hover:bg-[#008f6f] shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Broadcast
                </button>
              </form>
            </div>
          </>
        )}

        {activeAdminTab === 'reports' && (
          <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-[#111b21] text-base mb-2">Reported Content Moderation Queue</h3>
            {reportedItems.length === 0 ? (
              <p className="text-xs text-[#667781]">No reports in moderation queue.</p>
            ) : (
              <div className="divide-y divide-[#e9edef]">
                {reportedItems.map((rep) => (
                  <div key={rep.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-rose-500">Reported User: {rep.reportedUserName}</span>
                        <span className="text-[#667781]">• Reported by {rep.reporterName}</span>
                        <span className="text-[#667781]">• {rep.timestamp}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#111b21]">Reason: {rep.reason}</p>
                      {rep.messageContent && (
                        <p className="text-xs text-[#54656f] bg-[#f0f2f5] p-2 rounded-lg border border-[#e9edef]">
                          "{rep.messageContent}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {rep.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => resolveReport(rep.id, 'resolved')}
                            className="p-2 rounded-xl bg-[#e7fce3] text-[#00a884] hover:bg-[#d9fdd3] border border-[#00a884]/30 text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => resolveReport(rep.id, 'dismissed')}
                            className="p-2 rounded-xl bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] text-xs font-medium flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-[#667781] uppercase tracking-wider">
                          {rep.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeAdminTab === 'users' && (
          <div className="bg-white border border-[#e9edef] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-[#111b21] text-base mb-2">Registered User Directory</h3>
            <div className="divide-y divide-[#e9edef]">
              {contacts.map((usr) => (
                <div key={usr.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#e9edef]"
                    />
                    <div>
                      <h4 className="font-bold text-[#111b21] text-sm flex items-center gap-1.5">
                        {usr.name}
                        {usr.isVerified && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#667781]">{usr.email} | {usr.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => blockUser(usr.id)}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                  >
                    <UserX className="w-4 h-4" />
                    Ban User
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
