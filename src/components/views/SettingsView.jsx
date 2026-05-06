import { useState, useEffect } from 'react';
import { Save, Trash2, Crown, User, FileText, RefreshCw, Palette, Search, Volume2, Bell, Monitor } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../utils/sounds';
import { getProgressionState, equipCosmetic } from '../../utils/progressionStore';

// ── Theme definitions ──────────────────────────────────────
const THEMES = [
  { id: 'default', name: 'Cyberpunk',  desc: 'Loud & Proud',    preview: ['#8b5cf6','#FFD93D','#4ade80'], emoji: '⚡' },
  { id: 'neon',    name: 'Neon',       desc: 'Dark & Electric', preview: ['#00ff88','#ff0080','#0080ff'], emoji: '🌐' },
  { id: 'minimal', name: 'Minimal',    desc: 'Clean & Focused', preview: ['#000000','#ffffff','#f5f5f5'], emoji: '⬜' },
  { id: 'sakura',  name: 'Sakura',     desc: 'Soft & Serene',   preview: ['#ffb7c5','#ff69b4','#fff0f5'], emoji: '🌸' },
  { id: 'ocean',   name: 'Ocean',      desc: 'Deep & Calm',     preview: ['#0ea5e9','#06b6d4','#e0f2fe'], emoji: '🌊' },
];

function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('ln_theme', themeId);
}

const pfpOptions = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Cyber",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Neon",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pulse",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Glitch",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Zero",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Alpha",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Beta",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Gamma",
];

export default function SettingsView({ profile, onUpdateProfile, isPremium, onShowPaywall, onShowToS, onLogout, isExtensionConnected }) {
  const [name, setName] = useState(profile.name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [leetcodeUser, setLeetcodeUser] = useState(profile.leetcodeUser || '');
  const [selectedPfp, setSelectedPfp] = useState(profile.pfp || pfpOptions[0]);
  const [saved, setSaved] = useState(false);
  const [progression, setProgression] = useState(getProgressionState());
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('ln_theme') || 'default');

  const handleSave = () => {
    playSuccess();
    onUpdateProfile({ name, bio, leetcodeUser, pfp: selectedPfp });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm('WARNING: This will delete all your data. Are you sure?')) {
      playError();
      localStorage.clear();
      onLogout();
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl">
      {/* Profile Editor */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#8b5cf6] p-8">
        <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3">
          <User size={24} /> Profile Editor
        </h3>

        {/* PFP Selection */}
        <div className="mb-6">
          <label className="font-black uppercase text-sm tracking-wider mb-3 block">Profile Picture</label>
          <div className="flex gap-3 flex-wrap">
            {pfpOptions.map((opt, i) => (
              <img key={i} src={opt} alt="pfp"
                className={`w-16 h-16 border-4 cursor-pointer hover:-translate-y-1 transition-all bg-neo-bg
                ${selectedPfp === opt ? 'border-[#8b5cf6] shadow-[4px_4px_0px_#8b5cf6] scale-110' : 'border-black shadow-[3px_3px_0px_#000]'}`}
                onClick={() => { playClick(); setSelectedPfp(opt); }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="font-black uppercase text-sm tracking-wider mb-2 block">Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full p-4 border-4 border-black font-bold text-lg focus:bg-neo-bg outline-none" placeholder="Enter your name..." />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="font-black uppercase text-sm tracking-wider mb-2 block">Bio / Tagline</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full p-4 border-4 border-black font-bold focus:bg-neo-bg outline-none resize-none" placeholder="Tell others about yourself..." />
        </div>

        {/* LeetCode Username */}
        <div className="mb-6">
          <label className="font-black uppercase text-sm tracking-wider mb-2 block">LeetCode Username</label>
          <input value={leetcodeUser} onChange={e => setLeetcodeUser(e.target.value)}
            className="w-full p-4 border-4 border-black font-bold focus:bg-neo-bg outline-none" placeholder="your_leetcode_username" />
        </div>

        <button onClick={handleSave}
          className={`w-full py-4 border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3
          ${saved ? 'bg-[#4ade80]' : 'bg-[#FFD93D]'}`}>
          <Save size={20} /> {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Inventory & Cosmetics */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#FFD93D] p-8">
        <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3">
          <Search size={24} /> Inventory & Cosmetics
        </h3>
        
        <div className="mb-6">
          <label className="font-black uppercase text-sm tracking-wider mb-3 block">Equipped Title</label>
          <div className="flex gap-2 flex-wrap">
            {progression.unlockedCosmetics.titles.map((t, i) => (
              <button 
                key={i} 
                onClick={() => { playClick(); equipCosmetic('title', t); setProgression(getProgressionState()); }}
                className={`px-4 py-2 font-black uppercase border-4 text-xs transition-transform hover:-translate-y-1 ${progression.equipped.title === t ? 'bg-[#FFD93D] border-black shadow-[4px_4px_0px_#000]' : 'bg-white border-black shadow-none'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="font-black uppercase text-sm tracking-wider mb-3 block">Equipped Theme / Aura</label>
          <div className="flex gap-2 flex-wrap">
            {progression.unlockedCosmetics.themes.map((t, i) => (
              <button 
                key={i} 
                onClick={() => { playClick(); equipCosmetic('theme', t); setProgression(getProgressionState()); }}
                className={`px-4 py-2 font-black uppercase border-4 text-xs transition-transform hover:-translate-y-1 ${progression.equipped.theme === t ? 'bg-[#8b5cf6] text-white border-black shadow-[4px_4px_0px_#000]' : 'bg-white border-black shadow-none'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Theme Switcher ── */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#4ade80] p-8">
        <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3">
          <Palette size={24} /> UI Themes
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => { playClick(); setActiveTheme(t.id); applyTheme(t.id); }}
              className={`flex flex-col items-center p-4 border-4 border-black transition-all
                ${activeTheme === t.id
                  ? 'shadow-none translate-y-1 bg-[#FFD93D]'
                  : 'shadow-[4px_4px_0px_#000] hover:-translate-y-1 bg-white'}`}
            >
              <span className="text-2xl mb-2">{t.emoji}</span>
              <div className="flex gap-1 mb-2">
                {t.preview.map((c, i) => (
                  <div key={i} className="w-4 h-4 border border-black rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="font-black text-xs uppercase text-center">{t.name}</span>
              <span className="text-xs opacity-60 font-bold text-center">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sound Pack ── */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#8b5cf6] p-8">
        <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3">
          <Volume2 size={24} /> Sound Pack
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {['Cyberpunk 🤖','Retro 👾','Nature 🌿'].map((pack, i) => (
            <button
              key={pack}
              onClick={playClick}
              className={`p-4 border-4 border-black font-black uppercase text-sm transition-all hover:-translate-y-1
                ${i === 0 ? 'bg-[#8b5cf6] text-white shadow-[4px_4px_0px_#000]' : 'bg-white shadow-[4px_4px_0px_#000]'}`}
            >
              {pack}
              {i === 0 && <div className="text-xs mt-1 opacity-80 font-bold normal-case">Active</div>}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-4 border-black p-4">
          <span className="font-bold">Ambient Sound</span>
          <input type="checkbox" defaultChecked onChange={playClick} className="w-6 h-6 border-2 border-black accent-black cursor-pointer" />
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#FFD93D] p-8">
        <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3">
          <Bell size={24} /> Notifications
        </h3>
        {[
          { label: 'Streak reminders', default: true },
          { label: 'Friend activity alerts', default: true },
          { label: 'Daily quest nudges', default: true },
          { label: 'Milestone celebrations', default: true },
          { label: 'Weekly progress digest', default: false },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between border-4 border-black p-4 mb-3 hover:bg-neo-bg transition-colors">
            <span className="font-bold">{item.label}</span>
            <input type="checkbox" defaultChecked={item.default} onChange={playClick}
              className="w-6 h-6 border-2 border-black accent-black cursor-pointer" />
          </div>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-8">
        <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
          <Crown size={24} /> Subscription
        </h3>
        <div className={`p-4 border-4 border-black font-black text-lg uppercase ${isPremium ? 'bg-[#FFD93D]' : 'bg-neo-bg'}`}>
          {isPremium ? '⭐ PRO MEMBER — All features unlocked' : '🔒 FREE PLAN — Limited features'}
        </div>
        {!isPremium && (
          <button onClick={onShowPaywall}
            className="w-full mt-4 py-3 bg-[#8b5cf6] text-white border-4 border-black font-black uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all">
            Upgrade to Pro — ₹59/mo
          </button>
        )}
      </div>

      {/* Extension Status */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-8">
        <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
          <RefreshCw size={24} /> Extension Status
        </h3>
        <div className={`p-4 border-4 border-black font-black text-lg uppercase flex items-center gap-3
          ${isExtensionConnected ? 'bg-[#4ade80]' : 'bg-[#FF6B6B]'}`}>
          <div className={`w-4 h-4 rounded-full border-2 border-black ${isExtensionConnected ? 'bg-green-800 animate-pulse' : 'bg-red-800'}`}></div>
          {isExtensionConnected ? 'Extension Connected & Active' : 'Extension Not Detected — Install from Chrome Web Store'}
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-8">
        <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-3">
          <FileText size={24} /> Legal
        </h3>
        <button onClick={() => { playClick(); onShowToS(); }}
          className="w-full py-3 bg-neo-bg border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all mb-3">
          View Terms of Service
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#FF6B6B] border-4 border-black shadow-[10px_10px_0px_#000] p-8">
        <h3 className="text-2xl font-black uppercase mb-4 text-white flex items-center gap-3">
          <Trash2 size={24} /> Danger Zone
        </h3>
        <button onClick={handleDeleteAccount}
          className="w-full py-3 bg-black text-white border-4 border-black font-black uppercase shadow-[6px_6px_0px_#fff] hover:-translate-y-1 transition-all">
          Delete All Data & Logout
        </button>
      </div>
    </div>
  );
}
