import { useState } from 'react';
import { Hash, FileText, Kanban, Plus, Send, MoreVertical, Layout, AlignLeft, Users, Bell, Search, Bold, Italic, Link2, CheckSquare } from 'lucide-react';
import { playClick, playNav, playSuccess, playWhoosh } from '../../utils/sounds';

const SERVERS = [
  { id: 's1', name: 'LN Core', color: '#8b5cf6', initial: 'LN' },
  { id: 's2', name: 'Open Source', color: '#4ade80', initial: 'OS' },
  { id: 's3', name: 'Study Group', color: '#FFD93D', initial: 'SG' },
];

const CHANNELS = {
  s1: [
    { id: 'c1', name: 'general', type: 'chat', icon: Hash },
    { id: 'c2', name: 'frontend-team', type: 'chat', icon: Hash },
    { id: 'c3', name: 'feature-planning', type: 'board', icon: Kanban },
    { id: 'c4', name: 'architecture-docs', type: 'doc', icon: FileText },
  ],
  s2: [
    { id: 'c5', name: 'welcome', type: 'chat', icon: Hash },
    { id: 'c6', name: 'roadmap', type: 'board', icon: Kanban },
  ],
  s3: [
    { id: 'c7', name: 'algorithms', type: 'chat', icon: Hash },
    { id: 'c8', name: 'study-notes', type: 'doc', icon: FileText },
  ]
};

const INITIAL_MESSAGES = [
  { id: 1, user: 'System', avatar: '🤖', text: 'Welcome to the channel!', time: '09:00 AM' },
  { id: 2, user: 'Raghu', avatar: '👨‍💻', text: 'Hey everyone, let us integrate the new features.', time: '09:05 AM' },
  { id: 3, user: 'Alice', avatar: '👩‍🎨', text: 'The Notion-like docs are going to be super useful.', time: '09:12 AM' },
];

const INITIAL_BOARD = {
  todo: [{ id: 't1', title: 'Design Database Schema' }, { id: 't2', title: 'Setup WebSocket for Chat' }],
  inProgress: [{ id: 't3', title: 'Build Workspace UI' }],
  done: [{ id: 't4', title: 'Initial Project Setup' }]
};

export default function WorkspaceView({ currentUser }) {
  const [activeServer, setActiveServer] = useState('s1');
  const [activeChannel, setActiveChannel] = useState('c1');
  
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  
  const [board, setBoard] = useState(INITIAL_BOARD);
  
  const [docContent, setDocContent] = useState('Welcome to the Architecture Docs.\n\nUse this space like Notion to jot down ideas, add blocks, and collaborate.');

  const channels = CHANNELS[activeServer] || [];
  const activeChannelData = channels.find(c => c.id === activeChannel);

  const handleServerSwitch = (sid) => {
    playWhoosh();
    setActiveServer(sid);
    const firstChan = CHANNELS[sid]?.[0]?.id;
    if (firstChan) setActiveChannel(firstChan);
  };

  const handleChannelSwitch = (cid) => {
    playNav();
    setActiveChannel(cid);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playSuccess();
    setChatMessages([...chatMessages, {
      id: Date.now(),
      user: currentUser?.name || 'You',
      avatar: '🧑',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  const renderChat = () => (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatMessages.map(msg => (
          <div key={msg.id} className="flex gap-4 group">
            <div className="w-12 h-12 bg-[#FFD93D] border-4 border-black flex items-center justify-center text-xl shadow-[4px_4px_0px_#000]">
              {msg.avatar}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-black uppercase">{msg.user}</span>
                <span className="text-xs font-bold opacity-50">{msg.time}</span>
              </div>
              <div className="font-bold text-lg mt-1 group-hover:bg-neo-bg px-2 py-1 -ml-2 rounded transition-colors">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t-4 border-black shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            placeholder={`Message #${activeChannelData?.name}`}
            className="flex-1 p-4 border-4 border-black font-bold text-lg focus:bg-neo-bg outline-none shadow-[4px_4px_0px_#000] focus:shadow-none focus:translate-y-1 focus:translate-x-1 transition-all" 
          />
          <button type="submit" className="px-6 bg-[#4ade80] border-4 border-black font-black uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center">
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );

  const renderBoard = () => (
    <div className="flex-1 p-6 overflow-x-auto bg-neo-bg animate-fade-in flex gap-6 h-full">
      {Object.entries(board).map(([colId, tasks]) => (
        <div key={colId} className="w-80 shrink-0 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black uppercase text-xl px-2 py-1 bg-white border-4 border-black shadow-[4px_4px_0px_#000]">
              {colId.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <span className="font-black bg-black text-white px-2 py-1 border-2 border-black">{tasks.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pb-10">
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_#000] cursor-grab hover:-translate-y-1 transition-transform group relative">
                <div className="font-bold text-lg mb-2 leading-tight">{task.title}</div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-6 h-6 bg-[#8b5cf6] border-2 border-black rounded-full"></div>
                  <span className="text-xs font-black uppercase opacity-50">LN-{task.id.replace('t', '')}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-4 border-dashed border-black font-black uppercase opacity-50 hover:opacity-100 hover:bg-white transition-all flex items-center justify-center gap-2">
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDoc = () => (
    <div className="flex-1 overflow-y-auto bg-white flex justify-center animate-fade-in">
      <div className="max-w-3xl w-full p-12">
        {/* Notion-style header */}
        <div className="text-6xl mb-6">📝</div>
        <h1 className="text-5xl font-black mb-8 border-b-4 border-black pb-4 outline-none" contentEditable suppressContentEditableWarning>
          {activeChannelData?.name.replace('-', ' ').toUpperCase()}
        </h1>
        
        {/* Formatting Toolbar Mockup */}
        <div className="flex gap-2 mb-6 p-2 bg-neo-bg border-4 border-black shadow-[4px_4px_0px_#000] w-max">
          <button className="p-2 hover:bg-[#FFD93D] border-2 border-transparent hover:border-black transition-colors"><Bold size={18} /></button>
          <button className="p-2 hover:bg-[#FFD93D] border-2 border-transparent hover:border-black transition-colors"><Italic size={18} /></button>
          <button className="p-2 hover:bg-[#FFD93D] border-2 border-transparent hover:border-black transition-colors"><Link2 size={18} /></button>
          <div className="w-1 bg-black mx-1"></div>
          <button className="p-2 hover:bg-[#4ade80] border-2 border-transparent hover:border-black transition-colors"><AlignLeft size={18} /></button>
          <button className="p-2 hover:bg-[#4ade80] border-2 border-transparent hover:border-black transition-colors"><CheckSquare size={18} /></button>
        </div>

        <textarea
          value={docContent}
          onChange={(e) => setDocContent(e.target.value)}
          className="w-full h-[600px] resize-none outline-none font-bold text-xl leading-relaxed bg-transparent"
          placeholder="Type '/' for commands"
        />
      </div>
    </div>
  );

  return (
    <div className="h-full border-4 border-black shadow-[8px_8px_0px_#000] bg-white flex overflow-hidden">
      
      {/* Discord-style Server List (Far Left) */}
      <div className="w-20 bg-neo-bg border-r-4 border-black flex flex-col items-center py-4 gap-4 shrink-0 overflow-y-auto">
        {SERVERS.map(s => (
          <button 
            key={s.id}
            onClick={() => handleServerSwitch(s.id)}
            className={`w-14 h-14 border-4 border-black font-black text-xl flex items-center justify-center transition-all relative group
              ${activeServer === s.id ? 'rounded-xl translate-y-1 shadow-none' : 'rounded-full shadow-[4px_4px_0px_#000] hover:rounded-2xl hover:-translate-y-1'}`}
            style={{ backgroundColor: s.color }}
          >
            {activeServer === s.id && <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-8 bg-black rounded-r-md"></div>}
            {s.initial}
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 border-2 border-black">
              {s.name}
            </div>
          </button>
        ))}
        <div className="w-10 h-1 bg-black opacity-20 rounded-full my-2"></div>
        <button className="w-14 h-14 border-4 border-black border-dashed rounded-full font-black text-xl flex items-center justify-center hover:bg-white hover:border-solid transition-all opacity-50 hover:opacity-100 group relative">
          <Plus />
          <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 border-2 border-black">
            Add Workspace
          </div>
        </button>
      </div>

      {/* Slack/Discord-style Channel List */}
      <div className="w-64 bg-white border-r-4 border-black flex flex-col shrink-0">
        {/* Server Header */}
        <div className="h-16 border-b-4 border-black flex items-center px-4 justify-between bg-[#FFD93D] cursor-pointer hover:bg-[#FACC15] transition-colors">
          <h2 className="font-black uppercase text-xl truncate">{SERVERS.find(s => s.id === activeServer)?.name}</h2>
          <MoreVertical size={20} />
        </div>
        
        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-black uppercase opacity-50 mb-2 px-2 flex items-center justify-between">
              Channels <Plus size={14} className="cursor-pointer hover:text-black" />
            </div>
            <div className="space-y-1">
              {channels.map(c => {
                const Icon = c.icon;
                const isActive = activeChannel === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleChannelSwitch(c.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 font-bold transition-all text-left border-2 border-transparent
                      ${isActive ? 'bg-neo-bg border-black shadow-[2px_2px_0px_#000]' : 'hover:bg-neo-bg/50 hover:border-black/20'}`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#8b5cf6]' : 'opacity-70'} />
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Current User Mini Profile */}
        <div className="p-4 border-t-4 border-black bg-neo-bg flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-[#4ade80] flex items-center justify-center font-black">
            🧑
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black truncate text-sm">{currentUser?.name || 'User'}</div>
            <div className="text-xs font-bold opacity-60 truncate">Online</div>
          </div>
          <Settings size={18} className="cursor-pointer hover:rotate-90 transition-transform" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="h-16 border-b-4 border-black flex items-center px-6 justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {activeChannelData && <activeChannelData.icon size={24} className="text-[#8b5cf6]" />}
            <h2 className="font-black uppercase text-xl">{activeChannelData?.name}</h2>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 border-4 border-black bg-white flex items-center justify-center hover:bg-[#FFD93D] hover:-translate-y-1 shadow-[4px_4px_0px_#000] transition-all">
              <Users size={18} />
            </button>
            <div className="relative">
              <input type="text" placeholder="Search..." className="w-48 pl-10 pr-4 py-2 border-4 border-black font-bold text-sm focus:bg-neo-bg outline-none shadow-[4px_4px_0px_#000]" />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            </div>
            <button className="w-10 h-10 border-4 border-black bg-[#FF6B6B] text-white flex items-center justify-center hover:-translate-y-1 shadow-[4px_4px_0px_#000] transition-all">
              <Bell size={18} />
            </button>
          </div>
        </div>
        
        {/* Dynamic Content */}
        {activeChannelData?.type === 'chat' && renderChat()}
        {activeChannelData?.type === 'board' && renderBoard()}
        {activeChannelData?.type === 'doc' && renderDoc()}
      </div>
      
    </div>
  );
}
