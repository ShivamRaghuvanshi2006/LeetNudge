import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Activity, Terminal, Trash2, UserPlus, Database, AlertCircle, Search, RefreshCcw } from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/sounds';
import { notify } from '../NotificationSystem';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('users');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    activeMatches: 0,
    systemLoad: '2.4%'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulated log data
    const initialLogs = [
      { id: 1, time: '21:55:09', event: 'ADMIN_LOGIN', user: 'raghuvanshishivam2006@gmail.com', status: 'SUCCESS' },
      { id: 2, time: '21:50:22', event: 'ARENA_MATCH_START', user: 'CoderPro vs User123', status: 'ACTIVE' },
      { id: 3, time: '21:48:15', event: 'XP_SYNC', user: 'System', status: 'STABLE' },
      { id: 4, time: '21:45:00', event: 'NEW_USER_REGISTRATION', user: 'Newbie99', status: 'SUCCESS' },
      { id: 5, time: '21:40:12', event: 'PAYWALL_TRIGGER', user: 'Guest_4412', status: 'INFO' },
    ];
    setLogs(initialLogs);

    // Simulated user data
    setUsers([
      { id: 1, name: 'Admin', email: 'raghuvanshishivam2006@gmail.com', role: 'ADMIN', premium: true, joined: '2025-01-01' },
      { id: 2, name: 'User123', email: 'user123@example.com', role: 'USER', premium: false, joined: '2025-03-15' },
      { id: 3, name: 'CoderPro', email: 'pro@coder.io', role: 'USER', premium: true, joined: '2025-04-10' },
    ]);

    setStats({
      totalUsers: 142,
      premiumUsers: 28,
      activeMatches: 4,
      systemLoad: '1.8%'
    });
  }, []);

  const handleAction = (action, target) => {
    playClick();
    notify('Admin Action', `${action} executed on ${target}`, 'info', '🛡️');
    
    // Add to logs
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour12: false }),
      event: `ADMIN_${action.toUpperCase()}`,
      user: target,
      status: 'EXECUTED'
    };
    setLogs([newLog, ...logs.slice(0, 19)]);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Protocols', value: stats.totalUsers, icon: Users, color: 'bg-[#8b5cf6]' },
          { label: 'Premium Nodes', value: stats.premiumUsers, icon: ShieldCheck, color: 'bg-[#4ade80]' },
          { label: 'Live Battles', value: stats.activeMatches, icon: Activity, color: 'bg-[#FFD93D]' },
          { label: 'Core Load', value: stats.systemLoad, icon: Database, color: 'bg-[#FF6B6B]' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} border-4 border-black p-4 shadow-[6px_6px_0px_#000] flex items-center justify-between`}>
            <div>
              <div className="font-black text-xs uppercase opacity-80">{s.label}</div>
              <div className="text-2xl font-black">{s.value}</div>
            </div>
            <s.icon size={24} className="opacity-50" />
          </div>
        ))}
      </div>

      {/* Admin Panel Main */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Side: Controls & Logs */}
        <div className="flex-1 flex flex-col space-y-6 min-h-0">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'users' ? 'bg-[#FFD93D] shadow-none translate-y-1' : 'bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1'}`}
                >
                  User Directory
                </button>
                <button 
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'logs' ? 'bg-[#FFD93D] shadow-none translate-y-1' : 'bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1'}`}
                >
                  System Logs
                </button>
              </div>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input 
                  type="text" 
                  placeholder="SEARCH SYSTEM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-4 border-black bg-neo-bg font-bold uppercase text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {activeTab === 'users' ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black">
                      <th className="text-left py-3 px-2 font-black uppercase text-xs">Node ID</th>
                      <th className="text-left py-3 px-2 font-black uppercase text-xs">Identity</th>
                      <th className="text-left py-3 px-2 font-black uppercase text-xs">Status</th>
                      <th className="text-right py-3 px-2 font-black uppercase text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold">
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} className="border-b-2 border-black/10 hover:bg-neo-bg transition-colors">
                        <td className="py-4 px-2 text-xs">#{String(u.id).padStart(4, '0')}</td>
                        <td className="py-4 px-2">
                          <div className="font-black">{u.name}</div>
                          <div className="text-[10px] opacity-60 font-mono">{u.email}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-2">
                            {u.role === 'ADMIN' && <span className="bg-black text-white text-[8px] px-1.5 py-0.5">ADMIN</span>}
                            {u.premium && <span className="bg-[#FFD93D] text-black text-[8px] px-1.5 py-0.5">PRO</span>}
                            {!u.premium && <span className="bg-neo-bg text-black text-[8px] px-1.5 py-0.5">BASIC</span>}
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleAction('modify', u.name)} className="p-1.5 border-2 border-black bg-[#4ade80] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"><Terminal size={14} /></button>
                            {u.role !== 'ADMIN' && (
                              <button onClick={() => handleAction('purge', u.name)} className="p-1.5 border-2 border-black bg-[#FF6B6B] shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none text-white"><Trash2 size={14} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="space-y-3 font-mono">
                  {logs.map(log => (
                    <div key={log.id} className="border-2 border-black p-3 text-[11px] bg-neo-bg flex gap-4">
                      <span className="opacity-50 font-black">[{log.time}]</span>
                      <span className={`font-black ${log.event.includes('ADMIN') ? 'text-[#8b5cf6]' : 'text-black'}`}>{log.event}</span>
                      <span className="flex-1 opacity-80">{log.user}</span>
                      <span className={`font-black ${log.status === 'SUCCESS' || log.status === 'EXECUTED' ? 'text-green-600' : 'text-orange-500'}`}>{log.status}</span>
                    </div>
                  ))}
                  <button className="w-full py-2 border-2 border-black border-dashed font-black uppercase text-[10px] hover:bg-neo-bg mt-4">
                    Download Full System Archive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick System Actions */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_#8b5cf6]">
            <h3 className="font-black uppercase text-xl mb-6 flex items-center gap-3">
              <Terminal size={20} className="text-[#8b5cf6]" />
              Quick Ops
            </h3>
            <div className="space-y-3">
              <button onClick={() => handleAction('broadcast', 'All Nodes')} className="w-full py-3 border-2 border-[#8b5cf6] hover:bg-[#8b5cf6] transition-all font-black uppercase text-xs flex items-center justify-between px-4">
                <span>Global Broadcast</span>
                <Send size={14} />
              </button>
              <button onClick={() => handleAction('clear_cache', 'Server')} className="w-full py-3 border-2 border-[#FFD93D] hover:bg-[#FFD93D] hover:text-black transition-all font-black uppercase text-xs flex items-center justify-between px-4">
                <span>Flush Cache</span>
                <RefreshCcw size={14} />
              </button>
              <button onClick={() => handleAction('maintenance', 'System')} className="w-full py-3 border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] transition-all font-black uppercase text-xs flex items-center justify-between px-4">
                <span>Maintenance Mode</span>
                <AlertCircle size={14} />
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="text-[10px] font-black uppercase opacity-50 mb-2">Security Protocol</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-[#4ade80]">Level 5 Authorized</span>
              </div>
            </div>
          </div>

          {/* Hidden/Override Controls */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
            <h3 className="font-black uppercase text-sm mb-4">Master Overrides</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase">All Subscriptions Free</span>
                <div 
                  className="w-12 h-6 bg-black relative cursor-pointer"
                  onClick={() => handleAction('override', 'Subscriptions')}
                >
                  <div className="absolute right-1 top-1 w-4 h-4 bg-[#4ade80]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase">Arena Debug Mode</span>
                <div 
                  className="w-12 h-6 bg-neo-bg border-2 border-black relative cursor-pointer"
                  onClick={() => handleAction('override', 'Arena')}
                >
                  <div className="absolute left-1 top-0.5 w-4 h-4 bg-black/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
