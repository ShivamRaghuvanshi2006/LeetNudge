import { useState, useEffect } from 'react';
import { Send, Sparkles, ShieldCheck, ShieldAlert, Cpu, Terminal, Zap, LogOut, Crown, Mail, Settings, Users, Gamepad2, Calendar, Briefcase, Flame } from 'lucide-react';
import { playClick, playNav, playSuccess, playError, playWhoosh, startAmbient, stopAmbient } from '../utils/sounds';
import { loadXP } from '../utils/xpStore';

import OverviewView from './views/OverviewView';
import DSAView from './views/DSAView';
import SocialView from './views/SocialView';
import SettingsView from './views/SettingsView';
import InboxView from './views/InboxView';
import ArenaView from './views/ArenaView';
import WorkspaceView from './views/WorkspaceView';
import AdminView from './views/AdminView';
import RewardCalendar from './RewardCalendar';
import RevisionSection from './RevisionSection';
import SubscriptionModal from './SubscriptionModal';
import TermsOfService from './TermsOfService';
import NotificationSystem, { notify } from './NotificationSystem';

// ─── Nav Items ───────────────────────────────────────────────────
const navItems = [
  { id: 'overview',  label: 'Overview',     icon: Terminal },
  { id: 'workspace', label: 'Workspace',    icon: Briefcase },
  { id: 'dsa',       label: 'DSA Sheets',   icon: Cpu },
  { id: 'rewards',   label: 'Daily Rewards',icon: Calendar },
  { id: 'game',      label: 'The Arena',    icon: Gamepad2 },
  { id: 'social',    label: 'Social',       icon: Users },
  { id: 'inbox',     label: 'Inbox',        icon: Mail },
  { id: 'settings',  label: 'Settings',     icon: Settings },
];

// ─── Streak Anxiety Pulse ────────────────────────────────────────
function getMinutesUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 60000);
}

function StreakAnxietyBar({ streak, longestStreak }) {
  const mins = getMinutesUntilMidnight();
  const isAnxiety = mins <= 120; // 2h before midnight
  const hours = Math.floor(mins / 60);
  const minutesLeft = mins % 60;
  const timeStr = `${hours}h ${minutesLeft}m`;

  if (!isAnxiety) return null;

  return (
    <div className={`px-4 py-2 border-b-4 border-black flex items-center gap-3 text-sm font-black uppercase animate-pulse
      ${mins <= 30 ? 'bg-[#EF4444] text-white' : 'bg-[#FFD93D] text-black'}`}>
      <Flame size={16} className={mins <= 30 ? 'text-white' : 'text-[#EF4444]'} />
      <span>
        {mins <= 30
          ? `⚠️ Only ${timeStr} left — Protect your ${streak}-day streak!`
          : `🔥 ${timeStr} until streak resets — Solve a problem now!`
        }
      </span>
      {streak < longestStreak && (
        <span className="ml-auto opacity-80 text-xs">
          {longestStreak - streak} solve{longestStreak - streak !== 1 ? 's' : ''} from your record ({longestStreak})
        </span>
      )}
    </div>
  );
}

export default function Dashboard({ onLogout, user }) {
  const [view, setView] = useState('overview');
  const [xpData]        = useState(() => loadXP());

  useEffect(() => {
    startAmbient();

    // ── Notification demos ──────────────────────────────
    const t1 = setTimeout(() => {
      notify('Friend Online', 'Alice_Coder just logged in. Send a message!', 'info', '👩‍🎨');
    }, 4000);

    const t2 = setTimeout(() => {
      notify('Incoming Call', 'TechBros Group is starting a Voice Huddle.', 'call', null, true, [
        { label: 'Join',    primary: true,  onClick: () => notify('Call Joined', 'You are now in the voice channel.', 'info') },
        { label: 'Decline', primary: false, onClick: () => notify('Call Declined', '', 'error') },
      ]);
    }, 10000);

    const t3 = setTimeout(() => {
      notify('Game Invite', 'xX_Shadow_Xx challenged you to a 1v1 Duel!', 'game', '⚔️', true, [
        { label: 'Accept', primary: true,  onClick: () => { setView('game'); playNav(); } },
        { label: 'Ignore', primary: false },
      ]);
    }, 18000);

    // ── Sunk Cost Nudge ─────────────────────────────────
    const t4 = setTimeout(() => {
      const streak = xpData.streak;
      const longest = xpData.longestStreak;
      if (streak > 0 && streak < longest) {
        notify(
          'So close!',
          `You're ${longest - streak} solve(s) from beating your longest streak (${longest} days). Don't stop now!`,
          'info',
          '🔥'
        );
      }
    }, 25000);

    // ── Daily Quest reminder ─────────────────────────────
    const t5 = setTimeout(() => {
      const incomplete = xpData.quests?.filter(q => q.progress < q.total);
      if (incomplete?.length > 0) {
        notify('Daily Quests', `You have ${incomplete.length} quest${incomplete.length > 1 ? 's' : ''} waiting! Check Overview.`, 'info', '🎯');
      }
    }, 35000);

    return () => {
      stopAmbient();
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, []);

  const [isExtensionConnected, setIsExtensionConnected] = useState(false);
  const [isPremium, setIsPremium]   = useState(() => user?.isAdmin || !!localStorage.getItem('ln_premium'));
  const [showPaywall, setShowPaywall] = useState(false);
  const [showToS, setShowToS]         = useState(false);

  // Sync isPremium if user is Admin
  useEffect(() => {
    if (user?.isAdmin && !isPremium) {
      setIsPremium(true);
    }
  }, [user, isPremium]);

  const handleSubscribe = () => {
    localStorage.setItem('ln_premium', 'true');
    setIsPremium(true);
    setShowPaywall(false);
    playSuccess();
  };

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ln_profile') || 'null') || {
        name: user?.name || 'SYS_ADMIN',
        bio: '',
        leetcodeUser: '',
        pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber',
      };
    } catch {
      return { name: user?.name || 'SYS_ADMIN', bio: '', leetcodeUser: '', pfp: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' };
    }
  });

  const updateProfile = (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem('ln_profile', JSON.stringify(updated));
  };

  const isFullscreenView = view === 'game' || view === 'workspace' || view === 'social';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neo-bg text-neo-black font-space overflow-hidden">
      <NotificationSystem />
      <SubscriptionModal show={showPaywall} onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} />
      <TermsOfService show={showToS} onClose={() => setShowToS(false)} />

      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex w-[280px] bg-[#8b5cf6] border-r-4 border-black shadow-[4px_0px_0px_#000] flex-col gap-0 z-10 shrink-0">
        {/* Profile */}
        <div className="p-6 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 border-4 border-black bg-[#FFD93D] shadow-[4px_4px_0px_#000]">
              <img src={profile.pfp} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-white font-black uppercase truncate max-w-[150px]" style={{ textShadow: '2px 2px 0px #000' }}>
                {profile.name}
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                <span className="text-xs font-bold bg-black text-[#4ade80] px-2 py-0.5 border border-[#4ade80]">
                  {user?.isAdmin ? 'ADMIN' : 'USER'}
                </span>
                {isPremium && (
                  <span className="text-xs font-bold bg-[#FFD93D] text-black px-2 py-0.5 border border-black flex items-center gap-1">
                    <Crown size={10} /> PRO
                  </span>
                )}
                <span className="text-xs font-bold bg-[#EF4444] text-white px-2 py-0.5 border border-black flex items-center gap-1">
                  <Flame size={10} /> {xpData.streak}d
                </span>
              </div>
            </div>
          </div>

          {/* Mini XP bar in sidebar */}
          <div className="mt-3 w-full h-2 bg-black/20 border border-black/40">
            <div
              className="h-full bg-[#FFD93D] transition-all duration-700"
              style={{ width: `${Math.min(100, Math.round(((xpData.xp % 1000) / 1000) * 100))}%` }}
            />
          </div>
          <div className="text-xs text-white/70 font-bold mt-1">{xpData.xp.toLocaleString()} XP</div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map(t => (
            <div key={t.id} onClick={() => { setView(t.id); playNav(); }}
              className={`p-3 cursor-pointer border-4 border-black font-black uppercase transition-all shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] flex items-center gap-3 text-sm
                ${view === t.id ? 'bg-[#FFD93D] translate-y-1 shadow-none' : 'bg-white'}
                ${t.id === 'game' ? 'ring-2 ring-[#EF4444] ring-offset-1' : ''}`}>
              <t.icon size={18} />
              <span>{t.label}</span>
              {t.id === 'game' && <span className="ml-auto text-[10px] bg-[#EF4444] text-white px-1.5 py-0.5 font-black">ARENA</span>}
            </div>
          ))}

          {user?.isAdmin && (
            <div onClick={() => { setView('admin'); playNav(); }}
              className={`p-3 cursor-pointer border-4 border-black font-black uppercase transition-all shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] flex items-center gap-3 text-sm mt-8
                ${view === 'admin' ? 'bg-[#8b5cf6] text-white translate-y-1 shadow-none' : 'bg-black text-[#8b5cf6]'}`}>
              <ShieldAlert size={18} />
              <span>Admin Panel</span>
            </div>
          )}
        </div>

        {/* Upgrade + Logout */}
        <div className="p-4 space-y-2 border-t-4 border-black">
          {!isPremium && (
            <div onClick={() => { setShowPaywall(true); playWhoosh(); }}
              className="p-3 cursor-pointer border-4 border-[#FFD93D] bg-gradient-to-r from-[#8b5cf6] to-[#FFD93D] font-black uppercase text-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all flex items-center gap-3 text-sm animate-pulse-slow">
              <Crown size={18} /><span>Upgrade Pro</span>
            </div>
          )}
          <button onClick={() => { playClick(); onLogout(); }}
            className="w-full p-3 cursor-pointer border-4 border-black bg-[#FF6B6B] text-white font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Streak Anxiety Pulse bar (at top of content) */}
        <StreakAnxietyBar streak={xpData.streak} longestStreak={xpData.longestStreak} />

        <div
          className={`flex-1 ${isFullscreenView ? 'p-0' : 'p-4 md:p-10'} overflow-y-auto relative w-full pb-20 md:pb-10`}
          style={isFullscreenView ? {} : { backgroundImage: 'radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          {/* Header */}
          {!isFullscreenView && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter shadow-neo-sm bg-white px-4 py-2 border-4 border-black">
                {view.toUpperCase()} FEED
              </h1>
              <div className={`flex items-center gap-4 border-4 border-black px-4 py-2 shadow-[6px_6px_0px_#000] transition-colors ${isExtensionConnected ? 'bg-[#4ade80]' : 'bg-[#FF6B6B]'}`}>
                {isExtensionConnected ? <ShieldCheck size={20} className="animate-pulse" /> : <ShieldAlert size={20} />}
                <span className="font-black uppercase tracking-widest text-sm md:text-lg">
                  Extension: {isExtensionConnected ? 'STABLE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          )}

          {view === 'overview' && (
            <div className="space-y-6">
              <OverviewView isPremium={isPremium} />
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="h-64"><RevisionSection /></div>
              </div>
            </div>
          )}
          {view === 'dsa'       && <DSAView isPremium={isPremium} onShowPaywall={() => setShowPaywall(true)} />}
          {view === 'rewards'   && <div className="max-w-4xl h-[500px]"><RewardCalendar /></div>}
          {view === 'social'    && <SocialView currentUser={profile} />}
          {view === 'inbox'     && <InboxView isAdmin={!!user?.isAdmin} />}
          {view === 'workspace' && <WorkspaceView currentUser={profile} />}
          {view === 'game'      && <ArenaView currentUser={profile} onBack={() => { setView('overview'); playNav(); }} />}
          {view === 'admin'     && <AdminView />}
          {view === 'settings'  && (
            <SettingsView
              profile={profile}
              onUpdateProfile={updateProfile}
              isPremium={isPremium}
              onShowPaywall={() => setShowPaywall(true)}
              onShowToS={() => setShowToS(true)}
              onLogout={onLogout}
              isExtensionConnected={isExtensionConnected}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isFullscreenView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black flex justify-around items-center p-2 z-50">
          {navItems.map((t) => (
            <button
              key={t.id}
              onClick={() => { setView(t.id); playNav(); }}
              className={`p-2 transition-all flex flex-col items-center gap-1 ${view === t.id ? 'text-[#8b5cf6]' : 'text-black'}`}
            >
              <t.icon size={24} />
              <span className="text-[10px] font-black uppercase">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
