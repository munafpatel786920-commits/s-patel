import React, { useState, useRef } from 'react';
import { Plus, Eye, X, Image as ImageIcon, Sparkles, Upload, Trash2, Camera, Check } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { StatusUpdate } from '../types';

export const StatusView: React.FC = () => {
  const { statuses, postStatus, deleteStatus, currentUser, theme } = useChat();

  const [activeStatus, setActiveStatus] = useState<StatusUpdate | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('from-emerald-600 to-teal-800');
  const [statusImageUrl, setStatusImageUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const bgGradientOptions = [
    { name: 'Emerald', class: 'from-emerald-600 to-teal-800' },
    { name: 'Purple', class: 'from-purple-600 to-indigo-900' },
    { name: 'Rose', class: 'from-rose-600 to-amber-700' },
    { name: 'Blue', class: 'from-blue-600 to-cyan-800' },
    { name: 'Sunset', class: 'from-orange-500 to-pink-600' },
    { name: 'Dark', class: 'from-slate-800 to-slate-950' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('File size must be under 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStatusImageUrl(reader.result);
          setValidationError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim() && !statusImageUrl.trim()) {
      setValidationError('Please enter some text or select an image for your status');
      return;
    }

    const hasMedia = Boolean(statusImageUrl.trim());

    postStatus(
      statusText.trim() || undefined,
      statusImageUrl.trim() || undefined,
      statusColor,
      hasMedia ? 'image' : 'text'
    );

    setShowPostModal(false);
    setStatusText('');
    setStatusImageUrl('');
    setValidationError('');
    triggerToast('✅ Status posted successfully!');
  };

  const handleDeleteCurrentStatus = (statusId: string) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      deleteStatus(statusId);
      setActiveStatus(null);
      triggerToast('Status deleted');
    }
  };

  const myStatuses = statuses.filter((s) => s.userId === currentUser.id);
  const otherStatuses = statuses.filter((s) => s.userId !== currentUser.id);

  return (
    <div className={`flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none relative ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#f0f2f5] text-[#111b21]'
    }`}>
      {/* Toast Banner */}
      {toastMsg && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#00a884] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar - Status List */}
      <div className={`w-full md:w-96 border-r flex flex-col h-full ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-[#f0f2f5] border-[#e9edef]'
        }`}>
          <h1 className="text-xl font-bold">Status Updates</h1>
          <button
            onClick={() => {
              setValidationError('');
              setShowPostModal(true);
            }}
            className="px-3 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold transition-all flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Status
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* My Status */}
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'
            }`}>
              My Status
            </h2>
            
            <div
              onClick={() => {
                if (myStatuses.length > 0) setActiveStatus(myStatuses[0]);
                else {
                  setValidationError('');
                  setShowPostModal(true);
                }
              }}
              className={`p-3 border rounded-2xl flex items-center gap-3 cursor-pointer transition-colors shadow-xs ${
                theme === 'dark' ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800' : 'bg-white border-[#e9edef] hover:bg-[#f5f6f6]'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00a884] p-0.5"
                />
                <span className="absolute bottom-0 right-0 bg-[#00a884] text-white p-1 rounded-full border-2 border-white dark:border-slate-800">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">My Status</h3>
                <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                  {myStatuses.length > 0
                    ? `${myStatuses.length} update${myStatuses.length > 1 ? 's' : ''} • ${myStatuses[0].timestamp}`
                    : 'Tap to add status update'}
                </p>
              </div>

              {myStatuses.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValidationError('');
                    setShowPostModal(true);
                  }}
                  className="p-2 rounded-xl bg-[#00a884]/10 hover:bg-[#00a884]/20 text-[#00a884] text-xs font-bold cursor-pointer shrink-0"
                  title="Add another status"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Recent Updates from contacts */}
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'
            }`}>
              Recent Updates ({otherStatuses.length})
            </h2>
            {otherStatuses.length === 0 ? (
              <p className={`text-xs text-center py-4 italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                No status updates from contacts yet.
              </p>
            ) : (
              <div className="space-y-2">
                {otherStatuses.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setActiveStatus(st)}
                    className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors border shadow-xs ${
                      theme === 'dark'
                        ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                        : 'bg-white border-[#e9edef] hover:bg-[#f5f6f6]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={st.userAvatar}
                        alt={st.userName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00a884] p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{st.userName}</h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>{st.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Viewer Stage */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-[#efeae2]'
      }`}>
        {activeStatus ? (
          <div className={`w-full max-w-sm h-[520px] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between p-6 border ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
          }`}>
            {/* Top Progress Bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#00a884] w-full animate-pulse" />
            </div>

            {/* Status Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStatus.userAvatar}
                  alt={activeStatus.userName}
                  className="w-9 h-9 rounded-full object-cover border border-[#e9edef] dark:border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-xs">{activeStatus.userName}</h4>
                  <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>{activeStatus.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {activeStatus.userId === currentUser.id && (
                  <button
                    onClick={() => handleDeleteCurrentStatus(activeStatus.id)}
                    className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                    title="Delete this status update"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setActiveStatus(null)}
                  className={`p-1.5 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-[#f0f2f5] text-[#54656f] hover:text-[#111b21]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="my-auto flex flex-col items-center justify-center text-center w-full">
              {activeStatus.type === 'image' && activeStatus.mediaUrl ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <img
                    src={activeStatus.mediaUrl}
                    alt="Status story"
                    className="max-h-72 max-w-full rounded-2xl object-cover border border-[#e9edef] dark:border-slate-700 shadow-md"
                  />
                  {activeStatus.text && (
                    <p className={`text-sm font-semibold px-4 py-2 rounded-xl border ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}>
                      {activeStatus.text}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`w-full h-64 rounded-2xl bg-gradient-to-br ${
                    activeStatus.bgColor || 'from-emerald-600 to-teal-800'
                  } p-6 flex items-center justify-center text-center shadow-md border border-white/10`}
                >
                  <p className="text-lg font-extrabold text-white leading-relaxed drop-shadow-xs">
                    "{activeStatus.text}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Views counter */}
            <div className={`flex items-center justify-center gap-1.5 text-xs py-2 px-4 rounded-full border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-[#f0f2f5] border-[#e9edef] text-[#667781]'
            }`}>
              <Eye className="w-3.5 h-3.5 text-[#00a884]" />
              <span>{activeStatus.views.length} views</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <Sparkles className="w-12 h-12 text-[#00a884]/50 mx-auto mb-3 animate-pulse" />
            <h3 className="font-bold text-base mb-1">Status Updates</h3>
            <p className={`text-xs max-w-xs mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
              Select a status update from the left to view stories or click "Add Status" to post your own!
            </p>
          </div>
        )}
      </div>

      {/* Modal: Post New Status */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-5 w-full max-w-md shadow-2xl relative ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
          }`}>
            <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
              theme === 'dark' ? 'border-slate-800' : 'border-[#e9edef]'
            }`}>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#00a884]" />
                Add Status Update
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-semibold">
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Device Photo Upload Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Photo Preview / Upload trigger */}
              <div>
                <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                  Select Photo / Image (Optional)
                </label>

                {statusImageUrl ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-[#00a884] max-h-48 bg-black/10 flex items-center justify-center">
                    <img
                      src={statusImageUrl}
                      alt="Selected preview"
                      className="max-h-44 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setStatusImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-[#00a884]/40 hover:border-[#00a884] bg-[#00a884]/5 hover:bg-[#00a884]/10 text-[#00a884] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Photo from Device
                    </button>
                  </div>
                )}
              </div>

              {/* Or enter Image URL */}
              {!statusImageUrl && (
                <div>
                  <label className="block text-[11px] font-medium text-[#667781] dark:text-slate-400 mb-1">
                    Or enter Image Web URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#667781] shrink-0" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={statusImageUrl}
                      onChange={(e) => {
                        setStatusImageUrl(e.target.value);
                        setValidationError('');
                      }}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Text Caption */}
              <div>
                <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-1">
                  Status Caption / Text Message
                </label>
                <textarea
                  rows={2}
                  placeholder="What's on your mind?..."
                  value={statusText}
                  onChange={(e) => {
                    setStatusText(e.target.value);
                    setValidationError('');
                  }}
                  className={`w-full border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                />
              </div>

              {/* Background Gradient for Text Status */}
              {!statusImageUrl && (
                <div>
                  <label className="block text-xs font-bold text-[#54656f] dark:text-slate-400 mb-2">
                    Text Background Gradient Style
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {bgGradientOptions.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setStatusColor(grad.class)}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad.class} border-2 shrink-0 transition-transform cursor-pointer ${
                          statusColor === grad.class ? 'border-[#00a884] scale-110 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={grad.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#e9edef] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-[#54656f] dark:text-slate-300 hover:bg-[#e9edef]/50 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Post Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
