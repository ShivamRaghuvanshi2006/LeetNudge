import { useState, useEffect } from 'react';
import { Mail, Send, Shield, Trash2, Pin } from 'lucide-react';
import { playClick, playSuccess, playNotification } from '../../utils/sounds';

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, from: 'LeetNudge Team', text: 'Welcome to LeetNudge! Start your DSA journey today. Check out the DSA Sheets tab for structured problem sets.', time: '2 hours ago', pinned: true },
  { id: 2, from: 'LeetNudge Team', text: '🎉 New Feature: Friends system is live! Find users, add friends, and stalk their profiles.', time: '1 day ago', pinned: false },
  { id: 3, from: 'LeetNudge Team', text: 'Pro subscriptions are now available at ₹59/mo! Unlock unlimited AI hints and custom DSA protocols.', time: '3 days ago', pinned: false },
];

export default function InboxView({ isAdmin }) {
  const [announcements, setAnnouncements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln_inbox') || 'null') || DEFAULT_ANNOUNCEMENTS; }
    catch { return DEFAULT_ANNOUNCEMENTS; }
  });
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    localStorage.setItem('ln_inbox', JSON.stringify(announcements));
  }, [announcements]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    playSuccess();
    const post = {
      id: Date.now(),
      from: 'Admin',
      text: newPost,
      time: 'Just now',
      pinned: false,
    };
    setAnnouncements(prev => [post, ...prev]);
    setNewPost('');
  };

  const handleDelete = (id) => {
    playClick();
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const togglePin = (id) => {
    playClick();
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div className="bg-[#8b5cf6] border-4 border-black shadow-[10px_10px_0px_#000] p-6 text-white">
        <h3 className="text-3xl font-black uppercase flex items-center gap-3">
          <Mail size={28} /> Inbox
        </h3>
        <p className="font-bold mt-1 opacity-80">Official announcements from the LeetNudge team</p>
      </div>

      {/* Admin Post Area */}
      {isAdmin && (
        <div className="bg-[#FFD93D] border-4 border-black shadow-[6px_6px_0px_#000] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} />
            <span className="font-black uppercase text-sm tracking-wider">Admin Post</span>
          </div>
          <div className="flex gap-3">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} rows={2}
              className="flex-1 p-3 border-4 border-black font-bold focus:bg-white outline-none resize-none"
              placeholder="Write an announcement..." />
            <button onClick={handlePost}
              className="px-6 bg-black text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_#8b5cf6] hover:-translate-y-1 active:translate-y-1 transition-all self-end">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Announcements */}
      <div className="space-y-4">
        {sorted.map(a => (
          <div key={a.id} className={`bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 relative ${a.pinned ? 'border-l-8 border-l-[#8b5cf6]' : ''}`}>
            {a.pinned && (
              <div className="absolute -top-3 right-4 bg-[#8b5cf6] text-white font-black text-xs px-3 py-1 border-2 border-black flex items-center gap-1">
                <Pin size={12} /> Pinned
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black text-white font-black text-xs px-2 py-1 uppercase">{a.from}</span>
              <span className="font-bold text-sm opacity-50">{a.time}</span>
            </div>
            <p className="font-bold text-lg">{a.text}</p>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => togglePin(a.id)} className="px-3 py-1 border-2 border-black font-black text-xs uppercase bg-neo-bg hover:bg-[#FFD93D] transition-colors">
                  {a.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button onClick={() => handleDelete(a.id)} className="px-3 py-1 border-2 border-black font-black text-xs uppercase bg-[#FF6B6B] text-white hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
