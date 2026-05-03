import { useState, useEffect } from 'react';
import { Search, UserPlus, UserMinus, Ban, Eye, EyeOff, Users, ShieldOff, MessageCircle } from 'lucide-react';
import { fakeUsers, rankColors } from '../../data/fakeUsers';
import { playClick, playSuccess, playError, playNotification } from '../../utils/sounds';

export default function SocialView({ currentUser }) {
  const [tab, setTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln_friends') || '[]'); } catch { return []; }
  });
  const [blocked, setBlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln_blocked') || '[]'); } catch { return []; }
  });
  const [pendingReqs, setPendingReqs] = useState([3, 7]);
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => { localStorage.setItem('ln_friends', JSON.stringify(friends)); }, [friends]);
  useEffect(() => { localStorage.setItem('ln_blocked', JSON.stringify(blocked)); }, [blocked]);

  const addFriend = (id) => {
    if (!friends.includes(id)) { playSuccess(); setFriends(p => [...p, id]); setPendingReqs(p => p.filter(r => r !== id)); }
  };
  const removeFriend = (id) => { playClick(); setFriends(p => p.filter(f => f !== id)); };
  const blockUser = (id) => { playError(); setBlocked(p => [...p, id]); setFriends(p => p.filter(f => f !== id)); };
  const unblockUser = (id) => { playClick(); setBlocked(p => p.filter(b => b !== id)); };

  const filteredUsers = fakeUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !blocked.includes(u.id)
  );

  const friendUsers = fakeUsers.filter(u => friends.includes(u.id));
  const blockedUsers = fakeUsers.filter(u => blocked.includes(u.id));
  const pendingUsers = fakeUsers.filter(u => pendingReqs.includes(u.id) && !friends.includes(u.id));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Profile Viewer Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4" onClick={() => setViewingProfile(null)}>
          <div className="bg-white border-8 border-black shadow-[20px_20px_0px_#8b5cf6] p-8 max-w-md w-full -rotate-1" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <img src={viewingProfile.pfp} className="w-20 h-20 border-4 border-black bg-[#FFD93D]" alt="" />
              <div>
                <h3 className="text-2xl font-black uppercase">{viewingProfile.name}</h3>
                <span className="font-black text-xs px-2 py-1 border-2 border-black" style={{background: rankColors[viewingProfile.rank]}}>{viewingProfile.rank}</span>
              </div>
            </div>
            <p className="font-bold text-lg mb-4 bg-neo-bg border-2 border-black p-3">{viewingProfile.bio}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border-4 border-black p-4 bg-[#4ade80] text-center"><div className="font-black text-3xl">{viewingProfile.solved}</div><div className="font-bold text-sm uppercase">Solved</div></div>
              <div className="border-4 border-black p-4 bg-[#FFD93D] text-center"><div className="font-black text-3xl">{viewingProfile.streak}</div><div className="font-bold text-sm uppercase">Streak</div></div>
            </div>
            <div className="flex gap-3">
              {friends.includes(viewingProfile.id) ? (
                <button onClick={() => removeFriend(viewingProfile.id)} className="flex-1 py-3 bg-[#FF6B6B] border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  <UserMinus size={18} /> Unfriend
                </button>
              ) : (
                <button onClick={() => addFriend(viewingProfile.id)} className="flex-1 py-3 bg-[#4ade80] border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  <UserPlus size={18} /> Add Friend
                </button>
              )}
              <button onClick={() => { blockUser(viewingProfile.id); setViewingProfile(null); }} className="py-3 px-4 bg-black text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_#FF6B6B] hover:-translate-y-1 transition-all">
                <Ban size={18} />
              </button>
            </div>
            <button onClick={() => setViewingProfile(null)} className="w-full mt-4 py-2 border-4 border-black font-black uppercase bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all">Close</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: 'search', label: 'Find Users', icon: Search },
          { id: 'friends', label: `Friends (${friendUsers.length})`, icon: Users },
          { id: 'requests', label: `Requests (${pendingUsers.length})`, icon: MessageCircle },
          { id: 'blocked', label: `Blocked (${blockedUsers.length})`, icon: ShieldOff },
        ].map(t => (
          <button key={t.id} onClick={() => { playClick(); setTab(t.id); }}
            className={`px-5 py-3 border-4 border-black font-black uppercase text-sm flex items-center gap-2 transition-all
            ${tab === t.id ? 'bg-[#FFD93D] translate-y-1 shadow-none' : 'bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by username..."
              className="flex-1 p-4 border-4 border-black font-bold text-lg focus:bg-neo-bg outline-none uppercase" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(u => (
              <UserCard key={u.id} user={u} isFriend={friends.includes(u.id)}
                onView={() => { playClick(); setViewingProfile(u); }}
                onAdd={() => addFriend(u.id)} onRemove={() => removeFriend(u.id)} onBlock={() => blockUser(u.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      {tab === 'friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friendUsers.length === 0 ? (
            <div className="col-span-2 text-center py-16 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-black text-xl uppercase opacity-40">No friends yet</p>
              <p className="font-bold opacity-30 mt-2">Search for users to add them</p>
            </div>
          ) : friendUsers.map(u => (
            <UserCard key={u.id} user={u} isFriend={true}
              onView={() => { playClick(); setViewingProfile(u); }}
              onRemove={() => removeFriend(u.id)} onBlock={() => blockUser(u.id)} />
          ))}
        </div>
      )}

      {/* Pending Requests */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="text-center py-16 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-black text-xl uppercase opacity-40">No pending requests</p>
            </div>
          ) : pendingUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 bg-[#FFD93D] border-4 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-3">
                <img src={u.pfp} className="w-12 h-12 border-2 border-black bg-white" alt="" />
                <div><div className="font-black uppercase">{u.name}</div><div className="font-bold text-sm opacity-60">wants to be friends</div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addFriend(u.id)} className="px-4 py-2 bg-[#4ade80] border-4 border-black font-black uppercase text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all">Accept</button>
                <button onClick={() => setPendingReqs(p => p.filter(r => r !== u.id))} className="px-4 py-2 bg-[#FF6B6B] border-4 border-black font-black uppercase text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blocked */}
      {tab === 'blocked' && (
        <div className="space-y-4">
          {blockedUsers.length === 0 ? (
            <div className="text-center py-16 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
              <Ban size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-black text-xl uppercase opacity-40">No blocked users</p>
            </div>
          ) : blockedUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-3">
                <img src={u.pfp} className="w-12 h-12 border-2 border-black grayscale" alt="" />
                <span className="font-black uppercase">{u.name}</span>
              </div>
              <button onClick={() => unblockUser(u.id)} className="px-4 py-2 bg-[#4ade80] border-4 border-black font-black uppercase text-sm shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all">Unblock</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user, isFriend, onView, onAdd, onRemove, onBlock }) {
  return (
    <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <img src={user.pfp} className="w-14 h-14 border-3 border-black bg-[#FFD93D]" alt="" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black uppercase truncate">{user.name}</span>
            {user.online && <div className="w-3 h-3 bg-[#4ade80] border-2 border-black rounded-full animate-pulse flex-shrink-0"></div>}
          </div>
          <span className="font-black text-xs px-2 py-0.5 border border-black inline-block mt-1" style={{background: rankColors[user.rank]}}>{user.rank}</span>
        </div>
      </div>
      <p className="font-bold text-sm mb-3 truncate opacity-70">{user.bio}</p>
      <div className="flex gap-2">
        <button onClick={onView} className="flex-1 py-2 bg-[#C4B5FD] border-3 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-1">
          <Eye size={14} /> Stalk
        </button>
        {isFriend ? (
          <button onClick={onRemove} className="flex-1 py-2 bg-[#FF6B6B] border-3 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-1">
            <UserMinus size={14} /> Unfriend
          </button>
        ) : onAdd && (
          <button onClick={onAdd} className="flex-1 py-2 bg-[#4ade80] border-3 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-1">
            <UserPlus size={14} /> Add
          </button>
        )}
        <button onClick={onBlock} className="py-2 px-3 bg-black text-white border-3 border-black font-black uppercase text-xs shadow-[3px_3px_0px_#FF6B6B] hover:-translate-y-1 transition-all">
          <Ban size={14} />
        </button>
      </div>
    </div>
  );
}
