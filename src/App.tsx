import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TopHeader } from './components/layout/TopHeader';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/student/DashboardView';
import { BusTrackerView } from './components/student/BusTrackerView';
import { SafetyView } from './components/student/SafetyView';
import { StudyView } from './components/student/StudyView';
import { NoticesView } from './components/student/NoticesView';
import { LostFoundView } from './components/student/LostFoundView';
import { EventsView } from './components/student/EventsView';
import { ProfileSettingsView } from './components/student/ProfileSettingsView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { CampusAIAssistant } from './components/ai/CampusAIAssistant';
import { HelpAboutModal } from './components/common/HelpAboutModal';
import { MobileSmsToast } from './components/common/MobileSmsToast';

const MainAppContent: React.FC = () => {
  const { user, activeTab } = useApp();

  // If user is not logged in, render the secure authentication page with floating SMS toast
  if (!user) {
    return (
      <>
        <MobileSmsToast />
        <LoginView />
      </>
    );
  }

  // Active view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView />;
      case 'move':
        return <BusTrackerView />;
      case 'safety':
        return <SafetyView />;
      case 'study':
        return <StudyView />;
      case 'notices':
        return <NoticesView />;
      case 'lost-found':
        return <LostFoundView />;
      case 'events':
        return <EventsView />;
      case 'profile':
      case 'settings':
        return <ProfileSettingsView />;
      case 'admin':
        return <AdminPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Real-time Mobile SMS Push Toast (Visible on new account creation, SOS alerts & bus location sharing) */}
      <MobileSmsToast />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-0">
        <TopHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Campus AI Assistant */}
      <CampusAIAssistant />

      {/* Presentation & Symposium Guide Modal */}
      <HelpAboutModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
