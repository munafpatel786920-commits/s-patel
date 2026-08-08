import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { NavigationSidebar } from './components/NavigationSidebar';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { StatusView } from './components/StatusView';
import { CommunitiesChannels } from './components/CommunitiesChannels';
import { CallsView } from './components/CallsView';
import { AIAssistantView } from './components/AIAssistantView';
import { AdminPanel } from './components/AdminPanel';
import { SettingsView } from './components/SettingsView';
import { CallModal } from './components/CallModal';
import { AppLockOverlay } from './components/AppLockOverlay';
import { ProfileModal } from './components/ProfileModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useChat();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Main Content Area */}
      <main className="flex-1 flex h-full overflow-hidden min-h-0">
        {activeTab === 'chats' && (
          <>
            <ChatList />
            <ChatWindow />
          </>
        )}

        {activeTab === 'status' && <StatusView />}

        {activeTab === 'communities' && <CommunitiesChannels />}

        {activeTab === 'calls' && <CallsView />}

        {activeTab === 'ai' && <AIAssistantView />}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Bottom Navigation Dashboard */}
      <NavigationSidebar />

      {/* Overlays and Modals */}
      <CallModal />
      <AppLockOverlay />
      <ProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}
