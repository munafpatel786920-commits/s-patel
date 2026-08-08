import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Moon,
  Sun,
  Lock,
  ShieldCheck,
  Palette,
  HardDrive,
  UserCheck,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Eye,
  KeyRound,
  UserX,
  Edit3,
  Camera,
  Check,
  Sparkles,
  Shield,
  Smartphone,
  Mail,
  Info,
  Upload
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { CONTACTS } from '../data/mockData';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    theme,
    toggleTheme,
    isAppLocked,
    toggleAppLock,
    appPin,
    setAppPin,
    privacySettings,
    updatePrivacySettings,
    blockedUserIds,
    unblockUser,
    chatWallpaper,
    setChatWallpaper,
    clearSampleData,
    restoreSampleData,
    contacts
  } = useChat();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileAbout, setProfileAbout] = useState(currentUser.about);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileAvatar(reader.result);
          showNotification('Custom profile photo loaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // PIN Form State
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  // Sync profile form state when currentUser changes
  useEffect(() => {
    setProfileName(currentUser.name);
    setProfileAbout(currentUser.about);
    setProfileEmail(currentUser.email);
    setProfilePhone(currentUser.phone);
    setProfileAvatar(currentUser.avatar);
  }, [currentUser]);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showNotification('Profile name cannot be empty!');
      return;
    }

    updateProfile({
      name: profileName.trim(),
      about: profileAbout.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar.trim()
    });

    setIsEditingProfile(false);
    showNotification('Profile updated successfully!');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinSuccessMsg('PIN must be exactly 4 numeric digits!');
      return;
    }

    setAppPin(newPinInput);
    setNewPinInput('');
    setPinSuccessMsg('Security PIN updated successfully!');
    showNotification('Security passcode updated to ' + newPinInput);
    setTimeout(() => setPinSuccessMsg(''), 3000);
  };

  const wallpaperOptions = [
    { name: 'Dark Slate (Default)', value: 'bg-slate-900/90' },
    { name: 'Emerald Gradient', value: 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950' },
    { name: 'Deep Midnight', value: 'bg-slate-950' },
    { name: 'Indigo Dusk', value: 'bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950' },
    { name: 'Warm Amber', value: 'bg-gradient-to-br from-slate-950 via-amber-950/30 to-slate-950' },
    { name: 'WhatsApp Green', value: 'bg-emerald-950/80' }
  ];

  const blockedUsersList = (contacts || []).filter((c) => blockedUserIds.includes(c.id));

  return (
    <div className={`flex-1 flex flex-col h-full select-none overflow-y-auto border-l transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-[#f0f2f5] text-[#111b21] border-[#e9edef]'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#e9edef]'
      }`}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>Settings & Preferences</span>
          <Sparkles className="w-5 h-5 text-[#00a884]" />
        </h1>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
          Manage your account profile, themes, security passcode, and privacy settings
        </p>
      </div>

      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">

        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="p-4 bg-[#e7fce3] dark:bg-emerald-950/80 border border-[#00a884]/40 rounded-2xl text-[#00a884] text-xs font-bold flex items-center justify-between shadow-md animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#00a884]" />
              <span>{toastMsg}</span>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-[#00a884] hover:underline text-[11px] font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SECTION 1: PROFILE & ACCOUNT DETAILS */}
        <div className={`border rounded-2xl p-6 space-y-5 shadow-xs transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-[#e9edef] dark:border-slate-800">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-[#00a884]" />
              Profile Name & Details
            </h2>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3 py-1.5 rounded-xl bg-[#00a884]/10 text-[#00a884] hover:bg-[#00a884]/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {!isEditingProfile ? (
            /* View Mode */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#00a884] shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#25d366] border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {currentUser.name}
                    <span className="text-[10px] bg-[#e7fce3] text-[#00a884] px-2.5 py-0.5 rounded-full font-bold border border-[#00a884]/30">
                      Verified Account
                    </span>
                  </h3>
                  <div className={`text-xs flex flex-wrap items-center gap-3 ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                    <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> {currentUser.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</span>
                  </div>
                  <p className="text-xs text-[#00a884] italic font-medium mt-1">
                    "{currentUser.about}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSaveProfile} className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#667781] dark:text-slate-400 block">
                    Full Name / Display Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your profile name"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                    required
                  />
                </div>

                {/* About / Bio Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#667781] dark:text-slate-400 block">
                    About / Bio Status
                  </label>
                  <input
                    type="text"
                    value={profileAbout}
                    onChange={(e) => setProfileAbout(e.target.value)}
                    placeholder="E.g. Available | Busy coding..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#667781] dark:text-slate-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="user@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#667781] dark:text-slate-400 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                    }`}
                  />
                </div>
              </div>

              {/* Custom Profile Photo Upload & Custom URL */}
              <div className="space-y-3 border-t pt-4 border-[#e9edef] dark:border-slate-800">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <label className="text-xs font-bold text-[#667781] dark:text-slate-400 block">
                  Profile Photo (Select custom photo from device or enter URL)
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#f0f2f5]/60 dark:bg-slate-950/50 p-3 rounded-2xl border border-[#e9edef] dark:border-slate-800">
                  {/* Photo Preview with Camera Click */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer shrink-0 self-center sm:self-auto"
                    title="Click to select photo from device"
                  >
                    <img
                      src={profileAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt="Profile Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#00a884] shadow-xs group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 p-1 bg-[#00a884] text-white rounded-full shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Upload Actions & URL Input */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Custom Photo
                      </button>

                      {profileAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileAvatar('');
                            showNotification('Profile photo cleared');
                          }}
                          className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-[#667781] dark:text-slate-400 font-medium block">
                        Or enter direct image link (URL):
                      </span>
                      <input
                        type="url"
                        value={profileAvatar}
                        onChange={(e) => setProfileAvatar(e.target.value)}
                        placeholder="https://example.com/my-photo.jpg"
                        className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-[#e9edef] text-[#111b21]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#e9edef] dark:border-slate-700 text-[#54656f] dark:text-slate-300 hover:bg-[#e9edef]/50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* SECTION 2: APPEARANCE & THEMES */}
        <div className={`border rounded-2xl p-6 space-y-5 shadow-xs transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
        }`}>
          <h3 className="font-bold text-sm flex items-center gap-2 border-b pb-3 border-[#e9edef] dark:border-slate-800">
            <Palette className="w-4 h-4 text-[#00a884]" />
            Appearance & Themes
          </h3>

          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-bold text-xs">Theme Mode</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                Switch between Dark and Light mode across all views
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-[#f0f2f5] text-amber-600 border-[#e9edef] hover:bg-[#e9edef]'
              }`}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4 fill-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
            </button>
          </div>

          {/* Wallpaper Selection */}
          <div className="py-2 border-t border-[#e9edef] dark:border-slate-800 space-y-2">
            <p className="font-bold text-xs">Chat Wallpaper Presets</p>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
              Choose your preferred background style for chat conversations
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {wallpaperOptions.map((wp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatWallpaper(wp.value);
                    showNotification(`Wallpaper set to ${wp.name}`);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    chatWallpaper === wp.value
                      ? 'border-[#00a884] bg-[#e7fce3] text-[#00a884] dark:bg-emerald-950/60'
                      : theme === 'dark'
                      ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                      : 'border-[#e9edef] bg-[#f0f2f5] text-[#54656f] hover:border-[#d1d7db]'
                  }`}
                >
                  <span>{wp.name}</span>
                  {chatWallpaper === wp.value && <CheckCircle2 className="w-4 h-4 text-[#00a884] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: SECURITY & PRIVACY */}
        <div className={`border rounded-2xl p-6 space-y-5 shadow-xs transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
        }`}>
          <h3 className="font-bold text-sm flex items-center gap-2 border-b pb-3 border-[#e9edef] dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#00a884]" />
            Security & Privacy Settings
          </h3>

          {/* App Passcode Lock Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-bold text-xs">App Passcode Screen Lock</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                Require PIN code to open ChatConnect app (Active PIN: <code className="font-mono text-[#00a884] font-bold">{appPin}</code>)
              </p>
            </div>
            <button
              onClick={() => {
                toggleAppLock();
                showNotification(!isAppLocked ? 'App Passcode Lock Enabled' : 'App Passcode Lock Disabled');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isAppLocked
                  ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800'
                  : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] hover:bg-[#e9edef] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Lock className="w-4 h-4" />
              {isAppLocked ? 'Locked (ON)' : 'Unlocked (OFF)'}
            </button>
          </div>

          {/* Change Security PIN */}
          <div className="py-3 border-t border-[#e9edef] dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs">Change Security PIN</p>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                  Set a custom 4-digit passcode for app protection
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePin} className="flex items-center gap-2 max-w-sm">
              <input
                type="password"
                maxLength={4}
                placeholder="4-digit PIN (e.g. 1234)"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-xl border text-xs font-mono font-bold tracking-widest focus:outline-none focus:border-[#00a884] ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Update PIN
              </button>
            </form>
            {pinSuccessMsg && (
              <p className="text-xs font-semibold text-[#00a884]">{pinSuccessMsg}</p>
            )}
          </div>

          {/* Privacy Controls (Last Seen, Profile Photo, About, Read Receipts) */}
          <div className="py-3 border-t border-[#e9edef] dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs text-[#00a884] uppercase tracking-wider">
              Privacy Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Last Seen Privacy */}
              <div className="space-y-1">
                <label className="text-xs font-bold block">Last Seen & Online</label>
                <select
                  value={privacySettings.lastSeen}
                  onChange={(e) => {
                    updatePrivacySettings({ lastSeen: e.target.value as any });
                    showNotification(`Last Seen privacy updated to ${e.target.value}`);
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                >
                  <option value="everyone">Everyone</option>
                  <option value="contacts">My Contacts</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              {/* Profile Photo Privacy */}
              <div className="space-y-1">
                <label className="text-xs font-bold block">Profile Photo Visibility</label>
                <select
                  value={privacySettings.profilePhoto}
                  onChange={(e) => {
                    updatePrivacySettings({ profilePhoto: e.target.value as any });
                    showNotification(`Profile Photo visibility updated to ${e.target.value}`);
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                >
                  <option value="everyone">Everyone</option>
                  <option value="contacts">My Contacts</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              {/* About Bio Privacy */}
              <div className="space-y-1">
                <label className="text-xs font-bold block">About Bio Visibility</label>
                <select
                  value={privacySettings.aboutBio}
                  onChange={(e) => {
                    updatePrivacySettings({ aboutBio: e.target.value as any });
                    showNotification(`About Bio visibility updated to ${e.target.value}`);
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:border-[#00a884] ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-[#f0f2f5] border-[#e9edef] text-[#111b21]'
                  }`}
                >
                  <option value="everyone">Everyone</option>
                  <option value="contacts">My Contacts</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>
            </div>

            {/* Read Receipts */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold text-xs">Read Receipts (Blue Ticks)</p>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                  If turned off, you won't send or receive read receipts
                </p>
              </div>
              <button
                onClick={() => {
                  const next = !privacySettings.readReceipts;
                  updatePrivacySettings({ readReceipts: next });
                  showNotification(`Read Receipts ${next ? 'enabled' : 'disabled'}`);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  privacySettings.readReceipts
                    ? 'bg-[#e7fce3] text-[#00a884] border-[#00a884]/30'
                    : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {privacySettings.readReceipts ? 'Receipts ON' : 'Receipts OFF'}
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication (2FA) */}
          <div className="flex items-center justify-between py-3 border-t border-[#e9edef] dark:border-slate-800">
            <div>
              <p className="font-bold text-xs">Two-Factor Authentication (2FA)</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                Enhanced login verification layer for your ChatConnect account
              </p>
            </div>
            <button
              onClick={() => {
                const next = !currentUser.isTwoFactorEnabled;
                updateProfile({ isTwoFactorEnabled: next });
                showNotification(`Two-Factor Authentication ${next ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                currentUser.isTwoFactorEnabled
                  ? 'bg-[#e7fce3] text-[#00a884] border-[#00a884]/30'
                  : 'bg-[#f0f2f5] text-[#54656f] border-[#e9edef] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {currentUser.isTwoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
            </button>
          </div>

          {/* Blocked Contacts Management */}
          <div className="py-3 border-t border-[#e9edef] dark:border-slate-800 space-y-3">
            <p className="font-bold text-xs flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-500" />
              Blocked Contacts ({blockedUsersList.length})
            </p>

            {blockedUsersList.length === 0 ? (
              <p className={`text-xs italic ${theme === 'dark' ? 'text-slate-500' : 'text-[#667781]'}`}>
                No contacts are currently blocked.
              </p>
            ) : (
              <div className="space-y-2">
                {blockedUsersList.map((usr) => (
                  <div
                    key={usr.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-[#f0f2f5] border-[#e9edef]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold">{usr.name}</p>
                        <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>{usr.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        unblockUser(usr.id);
                        showNotification(`Unblocked ${usr.name}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 font-bold hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                    >
                      Unblock Contact
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: DATA & SAMPLE CONTENT MANAGEMENT */}
        <div className={`border rounded-2xl p-6 space-y-4 shadow-xs transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#e9edef]'
        }`}>
          <h3 className="font-bold text-sm flex items-center gap-2 border-b pb-3 border-[#e9edef] dark:border-slate-800">
            <HardDrive className="w-4 h-4 text-[#00a884]" />
            Data & Sample Content Controls
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
            <div>
              <p className="font-bold text-xs">Sample Demo Data Management</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-[#667781]'}`}>
                Reset or clear all local sample chats, messages, status updates, and call history.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  clearSampleData();
                  showNotification('All sample demo data deleted successfully.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete Sample Data
              </button>
              <button
                onClick={() => {
                  restoreSampleData();
                  showNotification('Default sample data restored successfully.');
                }}
                className="px-4 py-2 rounded-xl bg-[#f0f2f5] dark:bg-slate-800 hover:bg-[#e9edef] text-[#111b21] dark:text-slate-100 border border-[#e9edef] dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#00a884]" />
                Restore Sample Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
