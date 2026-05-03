import { useState, useEffect } from 'react';
import { Send, Sparkles, ShieldCheck, ShieldAlert, Cpu, Terminal, Zap, LogOut, Crown, Mail, Settings, Users, Gamepad2, Calendar, Briefcase } from 'lucide-react';
import { playClick, playNav, playSuccess, playError, playWhoosh, startAmbient, stopAmbient } from '../utils/sounds';

import OverviewView from './views/OverviewView';
import DSAView from './views/DSAView';
import SocialView from './views/SocialView';
import SettingsView from './views/SettingsView';
import InboxView from './views/InboxView';
import ArenaView from './views/ArenaView';
import WorkspaceView from './views/WorkspaceView';
import RewardCalendar from './RewardCalendar';
import RevisionSection from './RevisionSection';
import SubscriptionModal from './SubscriptionModal';
import TermsOfService from './TermsOfService';
import NotificationSystem, { notify } from './NotificationSystem';

// ─── Nav Items ───────────────────────────────────────────────────
const navItems = [
  { id: 'overview', label: 'Overview', icon: Terminal },
  { id: 'workspace', label: 'Workspace', icon: Briefcase },
  { id: 'dsa', label: 'DSA Sheets', icon: Cpu },
  { id: 'rewards', label: 'Daily Rewards', icon: Calendar },
  { id: 'game', label: 'The Arena', icon: Gamepad2 },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'inbox', label: 'Inbox', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard({ onLogout, user }) {
  const [view, setView] = useState('overview');

  useEffect(() => {
    startAmbient();

    // Notification System Demonstration Logic
    const t1 = setTimeout(() => {
      notify('Friend Online', 'Alice_Coder just logged in. Send a message to say hi!', 'info', '👩‍🎨');
    }, 4000);

    const t2 = setTimeout(() => {
      notify('Incoming Call', 'TechBros Group is starting a Voice Huddle.', 'call', null, true, [
        { label: 'Join', primary: true, onClick: () => notify('Call Joined', 'You are now in the voice channel.', 'info') },
        { label: 'Decline', primary: false, onClick: () => notify('Call Declined', '', 'error') }
      ]);
    }, 10000);

    const t3 = setTimeout(() => {
      notify('Game Invite', 'xX_Shadow_Xx invited you to a 1v1 Tactical Duel!', 'game', '⚔️', true, [
        { label: 'Accept', primary: true, onClick: () => { setView('game'); playNav(); } },
        { label: 'Ignore', primary: false }
      ]);
    }, 18000);

    return () => { 
      stopAmbient();
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, []);

  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [isPremium, setIsPremium] = useState(() => !!localStorage.getItem('ln_premium'));
  const [showPaywall, setShowPaywall] = useState(false);
  const [showToS, setShowToS] = useState(false);

  const handleSubscribe = () => {
    localStorage.setItem('ln_premium', 'true');
    setIsPremium(true);
    setShowPaywall(false);
    playSuccess();
  };

  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln_profile') || 'null') || { name: user?.name || 'SYS_ADMIN', bio: '', leetcodeUser: '', pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' }; }
    catch { return { name: user?.name || 'SYS_ADMIN', bio: '', leetcodeUser: '', pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' }; }
  });
  const updateProfile = (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem('ln_profile', JSON.stringify(updated));
  };

  const isFullscreenView = view === 'game' || view === 'workspace';

  return (
    <div className="flex h-screen bg-neo-bg text-neo-black font-space overflow-hidden">
      <NotificationSystem />
      <SubscriptionModal show={showPaywall} onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} />
      <TermsOfService show={showToS} onClose={() => setShowToS(false)} />

      {/* Sidebar - RESTORED OLD UI Layout */}
      <div className="w-[280px] bg-[#8b5cf6] p-6 border-r-4 border-black shadow-[4px_0px_0px_#000] flex flex-col gap-3 z-10 shrink-0">
        <div className="relative mb-4 pb-4 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_#000]">
              <img src={profile.pfp} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-white font-black uppercase truncate max-w-[150px]" style={{textShadow:"2px 2px 0px #000"}}>
                {profile.name}
              </div>
              <div className="flex gap-1 mt-1">
                <span className="text-xs font-bold bg-black text-[#4ade80] px-2 py-0.5 border border-[#4ade80]">
                  {user?.isAdmin ? 'ADMIN' : 'USER'}
                </span>
                {isPremium && (
                  <span className="text-xs font-bold bg-[#FFD93D] text-black px-2 py-0.5 border border-black flex items-center gap-1">
                    <Crown size={10} /> PRO
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {navItems.map(t => (
          <div key={t.id} onClick={() => { setView(t.id); playNav(); }}
            className={`p-3 cursor-pointer border-4 border-black font-black uppercase transition-all shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] flex items-center gap-3 text-sm
              ${view === t.id ? "bg-[#FFD93D] translate-y-1 shadow-none" : "bg-white"}
              ${t.id === 'game' ? 'ring-2 ring-[#EF4444] ring-offset-1' : ''}`}>
            <t.icon size={18} /><span>{t.label}</span>
            {t.id === 'game' && <span className="ml-auto text-[10px] bg-[#EF4444] text-white px-1.5 py-0.5 font-black">ARENA</span>}
          </div>
        ))}

        {!isPremium && (
          <div onClick={() => { setShowPaywall(true); playWhoosh(); }}
            className="p-3 cursor-pointer border-4 border-[#FFD93D] bg-gradient-to-r from-[#8b5cf6] to-[#FFD93D] font-black uppercase text-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all flex items-center gap-3 text-sm animate-pulse-slow">
            <Crown size={18} /><span>Upgrade Pro</span>
          </div>
        )}

        <div className="flex-1"></div>
        <button onClick={() => { playClick(); onLogout(); }} className="p-3 cursor-pointer border-4 border-black bg-[#FF6B6B] text-white font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isFullscreenView ? 'p-0' : 'p-10'} overflow-y-auto relative w-full h-full`}
        style={isFullscreenView ? {} : { backgroundImage: "radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>

        {/* Header */}
        {!isFullscreenView && (
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter shadow-neo-sm bg-white px-6 py-2 border-4 border-black">{view.toUpperCase()} FEED</h1>
            <div className={`flex items-center gap-4 border-4 border-black px-6 py-2 shadow-[6px_6px_0px_#000] transition-colors ${isExtensionConnected ? 'bg-[#4ade80]' : 'bg-[#FF6B6B]'}`}>
              {isExtensionConnected ? <ShieldCheck size={24} className="animate-pulse" /> : <ShieldAlert size={24} />}
              <span className="font-black uppercase tracking-widest text-lg">Extension: {isExtensionConnected ? 'STABLE' : 'OFFLINE'}</span>
            </div>
          </div>
        )}

        {view === 'overview' && (
           <div className="space-y-6">
              <OverviewView isPremium={isPremium} />
              <div className="grid grid-cols-2 gap-6 mt-6">
                 {/* Reintroduce Revision Section into Overview since user wants buttons added to the old UI */}
                 <div className="h-64"><RevisionSection /></div>
              </div>
           </div>
        )}
        {view === 'dsa' && <DSAView isPremium={isPremium} onShowPaywall={() => setShowPaywall(true)} />}
        {view === 'rewards' && (
           <div className="max-w-4xl h-[500px]">
              <RewardCalendar />
           </div>
        )}
        {view === 'social' && <SocialView currentUser={profile} />}
        {view === 'inbox' && <InboxView isAdmin={!!user?.isAdmin} />}
        {view === 'workspace' && <WorkspaceView currentUser={profile} />}
        {view === 'game' && <ArenaView currentUser={profile} onBack={() => { setView('overview'); playNav(); }} />}
        {view === 'settings' && <SettingsView profile={profile} onUpdateProfile={updateProfile} isPremium={isPremium} onShowPaywall={() => setShowPaywall(true)} onShowToS={() => setShowToS(true)} onLogout={onLogout} isExtensionConnected={isExtensionConnected} />}
      </div>
    </div>
  );
}
