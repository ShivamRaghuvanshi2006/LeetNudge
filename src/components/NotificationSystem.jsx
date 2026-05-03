import { useState, useEffect } from 'react';
import { Bell, X, Phone, MessageSquare, Gamepad2, Info } from 'lucide-react';
import { playClick, playSuccess, playError, playNotification } from '../utils/sounds';

export function notify(title, message, type = 'info', avatar = null, persist = false, actions = []) {
  if (type === 'call') playNotification();
  else if (type === 'error') playError();
  else playSuccess();

  window.dispatchEvent(new CustomEvent('ln_notify', { 
    detail: { title, message, type, avatar, actions, persist } 
  }));
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotify = (e) => {
      const newNotif = { id: Date.now() + Math.random(), ...e.detail };
      setNotifications(prev => [...prev, newNotif]);
      if (!newNotif.persist) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 6000);
      }
    };
    window.addEventListener('ln_notify', handleNotify);
    return () => window.removeEventListener('ln_notify', handleNotify);
  }, []);

  const dismiss = (id) => {
    playClick();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'call': return <Phone size={24} className="text-[#4ade80] animate-pulse" />;
      case 'message': return <MessageSquare size={24} className="text-[#8b5cf6]" />;
      case 'game': return <Gamepad2 size={24} className="text-[#FFD93D]" />;
      default: return <Info size={24} className="text-black" />;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'call': return 'bg-[#FFFDF5] border-[#4ade80]';
      case 'message': return 'bg-[#F3E8FF] border-[#8b5cf6]';
      case 'game': return 'bg-[#FEF08A] border-[#FFD93D]';
      default: return 'bg-white border-black';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className={`pointer-events-auto border-4 shadow-[6px_6px_0px_#000] p-4 flex gap-4 animate-fade-in transition-all ${getColor(n.type)}`}>
          {n.avatar ? (
            <div className="w-12 h-12 border-3 border-black bg-white flex-shrink-0 flex items-center justify-center text-2xl shadow-[3px_3px_0px_#000]">
              {n.avatar}
            </div>
          ) : (
            <div className="w-12 h-12 border-3 border-black bg-white flex-shrink-0 flex items-center justify-center shadow-[3px_3px_0px_#000]">
              {getIcon(n.type)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-black uppercase truncate text-lg">{n.title}</h4>
              <button onClick={() => dismiss(n.id)} className="opacity-50 hover:opacity-100 transition-opacity"><X size={18} /></button>
            </div>
            <p className="font-bold text-sm leading-tight mt-1 opacity-80">{n.message}</p>
            
            {n.actions && n.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {n.actions.map((act, i) => (
                  <button 
                    key={i} 
                    onClick={() => { if(act.onClick) act.onClick(); dismiss(n.id); }}
                    className={`flex-1 py-1.5 px-2 border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] transition-all
                      ${act.primary ? 'bg-[#4ade80]' : 'bg-[#FF6B6B] text-white'}`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
