import { useState, useRef, useEffect } from 'react';
import { 
  Search, UserPlus, UserMinus, Ban, Users, MessageCircle, Mic, MicOff, Headphones, 
  Video, Phone, PhoneOff, Settings, Hash, Volume2, Plus, Smile, Send, MoreVertical, ShieldAlert,
  ArrowLeft, Menu, Rocket, Server
} from 'lucide-react';
import { fakeUsers, rankColors } from '../../data/fakeUsers';
import { playClick, playSuccess, playError, playNotification } from '../../utils/sounds';

const SERVERS = [
  { id: '@me', name: 'Direct Messages', icon: <MessageCircle size={32} />, isDM: true },
  { id: 's1', name: 'LeetCode Grinders', icon: <Rocket size={32} />, isDM: false },
  { id: 's2', name: 'System Design Club', icon: <Server size={32} />, isDM: false },
];

const CHANNELS = {
  's1': [
    { id: 'c1', name: 'general', type: 'text' },
    { id: 'c2', name: 'daily-challenge', type: 'text' },
    { id: 'v1', name: 'Study Room 1', type: 'voice' },
    { id: 'v2', name: 'Mock Interviews', type: 'voice' },
  ],
  's2': [
    { id: 'c3', name: 'architecture', type: 'text' },
    { id: 'c4', name: 'resources', type: 'text' },
    { id: 'v3', name: 'Whiteboard Session', type: 'voice' },
  ]
};

const DUMMY_MESSAGES = [
  { id: 1, user: fakeUsers[0], content: "Hey anyone down for a mock interview?", time: "10:24 AM" },
  { id: 2, user: fakeUsers[1], content: "Give me 10 mins, just finishing a hard DP problem.", time: "10:26 AM" },
  { id: 3, user: fakeUsers[2], content: "I can spectate!", time: "10:28 AM" },
];

export default function SocialView({ currentUser }) {
  const [activeServer, setActiveServer] = useState('@me');
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeDM, setActiveDM] = useState(fakeUsers[0]);
  
  const [mobileView, setMobileView] = useState('nav'); // 'nav' or 'chat'
  
  const [inVoice, setInVoice] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  
  const [friends, setFriends] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln_friends') || '[]'); } catch { return []; }
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    playClick();
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: currentUser,
      content: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputMsg('');
  };

  const handleJoinVoice = (channelId) => {
    playSuccess();
    setInVoice(channelId);
    setMobileView('chat');
  };

  const handleLeaveVoice = () => {
    playError();
    setInVoice(false);
  };

  const selectServer = (s) => {
    playClick();
    setActiveServer(s.id);
    if (!s.isDM) setActiveChannel(CHANNELS[s.id][0].id);
  };

  const selectChannel = (cId, type) => {
    if(type === 'text') {
      playClick();
      setActiveChannel(cId);
      setMobileView('chat');
    } else {
      handleJoinVoice(cId);
    }
  };

  const selectDM = (u) => {
    playClick();
    setActiveDM(u);
    setMobileView('chat');
  };

  return (
    <div className="flex h-full w-full bg-white font-space text-neo-black animate-fade-in border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
      
      {/* ── 1. Far Left: Server List ── */}
      <div className={`${mobileView === 'nav' ? 'flex' : 'hidden'} md:flex w-[80px] bg-neo-bg border-r-4 border-black flex-col items-center py-4 gap-4 overflow-y-auto shrink-0 z-20`}>
        {SERVERS.map(s => (
          <div key={s.id} className="relative group cursor-pointer" onClick={() => selectServer(s)}>
            <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-2 bg-black rounded-r-md transition-all ${activeServer === s.id ? 'h-10' : 'h-0 group-hover:h-5'}`}></div>
            <div className={`w-14 h-14 border-4 border-black flex items-center justify-center text-3xl transition-all
              ${activeServer === s.id ? 'bg-[#FFD93D] shadow-[4px_4px_0px_#000] rounded-xl' : 'bg-white rounded-[50%] hover:rounded-xl hover:bg-[#8b5cf6] hover:text-white'}`}>
              {s.icon}
            </div>
          </div>
        ))}
        <div className="w-10 h-1 bg-black opacity-20 my-2 rounded-full"></div>
        <div className="w-14 h-14 border-4 border-black border-dashed flex items-center justify-center text-[#8b5cf6] bg-white rounded-[50%] hover:rounded-xl hover:bg-neo-bg cursor-pointer transition-all">
          <Plus size={24} />
        </div>
      </div>

      {/* ── 2. Middle Left: Channels / DMs List ── */}
      <div className={`${mobileView === 'nav' ? 'flex' : 'hidden'} md:flex w-full md:w-[280px] bg-white border-r-4 border-black flex-col shrink-0 z-10`}>
        {/* Header */}
        <div className="h-16 border-b-4 border-black p-4 flex items-center justify-between shadow-sm bg-[#8b5cf6] text-white shrink-0">
          <h2 className="font-black uppercase truncate tracking-tighter text-xl" style={{textShadow:"2px 2px 0px #000"}}>
            {SERVERS.find(s => s.id === activeServer)?.name}
          </h2>
          {activeServer !== '@me' && <MoreVertical size={20} className="cursor-pointer" />}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeServer === '@me' ? (
            <>
              <button className="w-full p-3 flex items-center gap-3 font-black uppercase text-sm border-4 border-transparent hover:border-black hover:bg-neo-bg transition-colors">
                <Users size={20} /> Friends
              </button>
              <button className="w-full p-3 flex items-center gap-3 font-black uppercase text-sm border-4 border-transparent hover:border-black hover:bg-neo-bg transition-colors">
                <ShieldAlert size={20} /> Blocked
              </button>
              <div className="font-bold text-xs uppercase tracking-widest mt-6 mb-2 opacity-50 px-2">Direct Messages</div>
              {fakeUsers.slice(0, 5).map(u => (
                <div key={u.id} onClick={() => selectDM(u)}
                  className={`flex items-center gap-3 p-2 cursor-pointer border-4 border-transparent hover:border-black hover:bg-[#FFD93D] transition-all
                  ${activeDM?.id === u.id ? 'bg-[#FFD93D] border-black shadow-[4px_4px_0px_#000]' : ''}`}>
                  <div className="relative shrink-0">
                    <img src={u.pfp} className="w-10 h-10 border-2 border-black bg-white" alt="" />
                    {u.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4ade80] border-2 border-black rounded-full"></div>}
                  </div>
                  <div className="font-black truncate flex-1">{u.name}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {CHANNELS[activeServer].map(c => (
                <div key={c.id} onClick={() => selectChannel(c.id, c.type)}
                  className={`flex items-center gap-2 p-2 cursor-pointer border-4 border-transparent hover:border-black hover:bg-neo-bg transition-all
                  ${activeChannel === c.id ? 'bg-neo-bg border-black shadow-[4px_4px_0px_#000]' : ''}`}>
                  {c.type === 'text' ? <Hash size={20} className="opacity-50 shrink-0" /> : <Volume2 size={20} className="text-[#8b5cf6] shrink-0" />}
                  <div className={`font-black uppercase text-sm truncate ${c.type === 'voice' ? 'text-[#8b5cf6]' : ''}`}>{c.name}</div>
                  {c.type === 'voice' && inVoice === c.id && <div className="ml-auto w-3 h-3 bg-[#4ade80] rounded-full animate-pulse shrink-0"></div>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* User Controls */}
        <div className="h-20 border-t-4 border-black p-3 bg-neo-bg flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer hover:bg-black/5 p-1 shrink-0">
            <img src={currentUser.pfp} className="w-10 h-10 border-2 border-black bg-white shrink-0" alt="" />
            <div className="truncate hidden sm:block">
              <div className="font-black text-sm truncate uppercase">{currentUser.name}</div>
              <div className="text-[10px] font-bold opacity-60">Online</div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setMicMuted(!micMuted)} className={`p-2 border-2 border-transparent hover:border-black hover:bg-white transition-all ${micMuted ? 'text-[#FF6B6B]' : ''}`}>
              {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button onClick={() => setDeafened(!deafened)} className={`p-2 border-2 border-transparent hover:border-black hover:bg-white transition-all ${deafened ? 'text-[#FF6B6B]' : ''}`}>
              <Headphones size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Main Content: Chat / Voice ── */}
      <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white overflow-hidden relative`}>
        
        {/* Top Header */}
        <div className="h-16 border-b-4 border-black p-4 flex items-center justify-between bg-white shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <button onClick={() => setMobileView('nav')} className="md:hidden mr-2 p-1 border-2 border-black hover:bg-neo-bg">
              <Menu size={20} />
            </button>
            {activeServer === '@me' ? (
              <>
                <span className="text-xl md:text-2xl font-black">@</span>
                <span className="font-black uppercase text-lg md:text-xl truncate">{activeDM?.name}</span>
                {activeDM?.online && <div className="w-3 h-3 bg-[#4ade80] border-2 border-black rounded-full shrink-0"></div>}
              </>
            ) : (
              <>
                <Hash size={24} className="opacity-50 shrink-0" />
                <span className="font-black uppercase text-lg md:text-xl truncate">{CHANNELS[activeServer].find(c => c.id === activeChannel)?.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Phone className="cursor-pointer hover:text-[#4ade80] transition-colors" size={20} onClick={() => handleJoinVoice('dm-call')} />
            <Video className="cursor-pointer hover:text-[#8b5cf6] transition-colors" size={20} />
            <div className="w-px h-6 bg-black opacity-20 hidden md:block"></div>
            <div className="hidden md:flex items-center border-4 border-black bg-neo-bg px-2 py-1 w-48">
              <input placeholder="Search..." className="bg-transparent outline-none font-bold text-sm w-full uppercase" />
              <Search size={16} />
            </div>
          </div>
        </div>

        {/* Active Voice Call Overlay (if inside a call) */}
        {inVoice && (
          <div className="bg-[#111] text-white border-b-4 border-black p-4 flex flex-col shrink-0 shadow-lg relative z-20 animate-slide-up max-h-[40vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="font-black uppercase text-[#4ade80] flex items-center gap-2 text-xs md:text-base">
                <Volume2 size={20} className="animate-pulse shrink-0" /> <span className="truncate">Connected — {inVoice === 'dm-call' ? activeDM?.name : CHANNELS[activeServer].find(c => c.id === inVoice)?.name}</span>
              </div>
              <button onClick={handleLeaveVoice} className="px-2 md:px-4 py-2 bg-[#FF6B6B] border-4 border-white font-black uppercase text-xs md:text-sm shadow-[4px_4px_0px_#fff] hover:-translate-y-1 transition-all flex items-center gap-2 shrink-0">
                <PhoneOff size={16} /> Disconnect
              </button>
            </div>
            {/* Voice Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`bg-black border-4 ${!micMuted ? 'border-[#4ade80]' : 'border-[#FF6B6B]'} flex items-center justify-center relative overflow-hidden group aspect-square`}>
                <img src={currentUser.pfp} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white" alt="" />
                <div className="absolute bottom-2 left-2 bg-black px-2 py-1 border-2 border-white font-black text-[10px] md:text-xs truncate max-w-[90%]">{currentUser.name}</div>
                {!micMuted && <div className="absolute inset-0 ring-4 ring-[#4ade80] animate-pulse pointer-events-none"></div>}
              </div>
              {inVoice === 'dm-call' && (
                <div className="bg-black border-4 border-white flex items-center justify-center relative overflow-hidden aspect-square">
                  <img src={activeDM?.pfp} className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white" alt="" />
                  <div className="absolute bottom-2 left-2 bg-black px-2 py-1 border-2 border-white font-black text-[10px] md:text-xs truncate max-w-[90%]">{activeDM?.name}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white" style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          {/* Welcome Message */}
          <div className="mt-10 mb-8 border-b-4 border-black pb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FFD93D] border-4 border-black shadow-[6px_6px_0px_#000] rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 text-black">
              {activeServer === '@me' ? <Smile size={40} /> : <Hash size={40} />}
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight">
              {activeServer === '@me' ? activeDM?.name : `Welcome to #${CHANNELS[activeServer]?.find(c => c.id === activeChannel)?.name}`}
            </h1>
            <p className="font-bold opacity-60 uppercase tracking-widest mt-2 text-xs md:text-sm">This is the beginning of your legendary history.</p>
          </div>

          {/* Chat Bubbles */}
          {messages.map(m => (
            <div key={m.id} className="flex gap-3 md:gap-4 group">
              <img src={m.user.pfp} className="w-10 h-10 md:w-12 md:h-12 border-4 border-black bg-neo-bg shadow-[4px_4px_0px_#000] shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-black text-base md:text-lg hover:underline cursor-pointer truncate">{m.user.name}</span>
                  <span className="text-[10px] md:text-xs font-bold opacity-50 shrink-0">{m.time}</span>
                </div>
                <div className="font-bold bg-white p-3 border-4 border-black inline-block shadow-[4px_4px_0px_#000] text-sm md:text-base break-words">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-2 md:p-4 bg-white border-t-4 border-black shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-neo-bg border-4 border-black p-1 md:p-2 focus-within:bg-white transition-colors">
            <button type="button" className="p-2 hover:bg-[#FFD93D] border-2 border-transparent hover:border-black transition-all shrink-0 hidden sm:block">
              <Plus size={20} />
            </button>
            <input 
              value={inputMsg} 
              onChange={e => setInputMsg(e.target.value)}
              placeholder={activeServer === '@me' ? `Message @${activeDM?.name}` : `Message #${CHANNELS[activeServer]?.find(c => c.id === activeChannel)?.name}`}
              className="flex-1 bg-transparent outline-none font-bold text-sm md:text-lg px-2 min-w-0"
            />
            <button type="button" className="p-2 hover:bg-[#4ade80] border-2 border-transparent hover:border-black transition-all shrink-0">
              <Smile size={20} />
            </button>
            <button type="submit" className="p-2 bg-black text-white hover:bg-[#8b5cf6] border-2 border-black transition-all shrink-0 sm:hidden">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── 4. Far Right: Members List (Only for Servers) ── */}
      {activeServer !== '@me' && (
        <div className="hidden lg:flex w-[250px] bg-neo-bg border-l-4 border-black flex-col shrink-0 z-10 overflow-y-auto p-4">
          <div className="font-black uppercase text-xs tracking-widest opacity-50 mb-4">Online — {fakeUsers.filter(u=>u.online).length}</div>
          <div className="space-y-2">
            {fakeUsers.filter(u => u.online).map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 cursor-pointer border-4 border-transparent hover:border-black hover:bg-white transition-all group">
                <div className="relative shrink-0">
                  <img src={u.pfp} className="w-10 h-10 border-2 border-black bg-white group-hover:scale-110 transition-transform" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#4ade80] border-2 border-black rounded-full"></div>
                </div>
                <div className="truncate">
                  <div className="font-black text-sm truncate" style={{color: u.color || '#000'}}>{u.name}</div>
                  <div className="text-[10px] font-bold opacity-60 truncate">{u.bio || 'Playing Code Sus'}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-black uppercase text-xs tracking-widest opacity-50 mt-6 mb-4">Offline — {fakeUsers.filter(u=>!u.online).length}</div>
          <div className="space-y-2 opacity-60">
            {fakeUsers.filter(u => !u.online).map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 cursor-pointer border-4 border-transparent hover:border-black hover:bg-white transition-all group">
                <img src={u.pfp} className="w-10 h-10 border-2 border-black bg-white grayscale group-hover:grayscale-0 transition-all shrink-0" alt="" />
                <div className="font-black text-sm truncate">{u.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
