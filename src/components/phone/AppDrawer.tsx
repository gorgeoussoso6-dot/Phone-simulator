import { useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { appIconMap } from '../AppIcons';

const DRAWER_APPS: { id: string; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone', label: 'الهاتف' },
  { id: 'gallery', label: 'معرض' },
  { id: 'settings', label: 'الإعدادات' },
  { id: 'notes', label: 'ملاحظات سامسونج' },
  { id: 'camera', label: 'الكاميرا' },
  { id: 'google', label: 'Google' },
];

export function AppDrawer({
  content,
  onOpenApp,
  onClose,
}: {
  content: PhoneContent;
  onOpenApp: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  void content;

  const filtered = DRAWER_APPS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="absolute inset-0 flex flex-col anim-app bg-black/40 backdrop-blur-xl">
      <div className="h-10" />
      <div className="px-4 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث"
          className="w-full bg-white/10 text-white text-sm rounded-full px-4 py-2 outline-none placeholder:text-white/40 focus:bg-white/15 transition-colors"
        />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5">
        <div className="grid grid-cols-3 gap-y-7 gap-x-2 justify-items-center pt-4 pb-8">
          {filtered.map((app) => {
            const IconComp = appIconMap[app.id];
            return (
              <button key={app.id} onClick={() => onOpenApp(app.id)} className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 transition-transform group-active:scale-90">
                  {IconComp && <IconComp />}
                </div>
                <span className="text-white/90 text-[11px] text-center leading-tight max-w-[72px]">{app.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button onClick={onClose} className="h-14 flex items-center justify-center" aria-label="إغلاق">
        <div className="w-24 h-1.5 rounded-full bg-white/40" />
      </button>
    </div>
  );
}
