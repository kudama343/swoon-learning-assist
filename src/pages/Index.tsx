
import { useState } from 'react';
import { Workboard } from '@/components/Workboard';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { WelcomeModal } from '@/components/WelcomeModal';
import { NavigationTabs } from '@/components/NavigationTabs';
import { TopNavigation } from '@/components/TopNavigation';
import { UserProfile } from '@/components/UserProfile';
import { ComingSoonModal } from '@/components/ComingSoonModal';
import { CardHighlightOverlay } from '@/components/CardHighlightOverlay';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [activeTab, setActiveTab] = useState('workboard');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');

  const handleTabClick = (tabId: string) => {
    if (tabId === 'workboard') {
      setActiveTab(tabId);
    } else {
      setComingSoonTitle(tabId.charAt(0).toUpperCase() + tabId.slice(1));
      setShowComingSoonModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-swoon-light-gray">
      {/* Top Navigation */}
      <TopNavigation />

      {/* User Profile Section - Hidden on mobile, shown on tablet+ */}
      <div className="hidden md:block">
        <UserProfile />
      </div>

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabClick={handleTabClick} />

      {/* Main Content */}
      <main className="px-2 sm:px-4 lg:px-8 py-3 sm:py-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'workboard' && <Workboard />}
        </div>
      </main>

      {/* Chat Interface */}
      <FloatingChatButton 
        isOpen={isChatOpen} 
        onClick={() => setIsChatOpen(!isChatOpen)} 
      />
      
      {isChatOpen && (
        <ChatInterface 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}

      {/* Card Highlight Overlay */}
      <CardHighlightOverlay />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <ComingSoonModal 
          title={comingSoonTitle}
          onClose={() => setShowComingSoonModal(false)} 
        />
      )}
    </div>
  );
};

export default Index;