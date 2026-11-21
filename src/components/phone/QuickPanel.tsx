import { useState } from 'react';
import { PhoneContent } from '../../lib/types';

export function QuickPanel({
  content,
  onClose,
  battery,
}: {
  content: PhoneContent;
  onClose: () => void;
  battery: number;
}) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    wifi: true,
    sound: true,
    bluetooth: false,
    rotate: false,
  });

  const quickButtons = [
    { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { id: 'sound', label: 'الصوت', icon: '🔊' },
    { id: 'bluetooth', label: 'بلوتوث', icon: '🔵' },
    { id: 'rotate', label: 'تدوير', icon: '🔄' },
  ];

  void content;

  return (
    <div className="absolute inset-0 z-50 anim-panel bg-black/70 backdrop-blur-xl" onClick={onClose}>
      <div className="pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 text-white text-sm">
          <span>{content.phone.time || '5:55'}</span>
          <span dir="ltr">{battery}%</span>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 mt-5">
          {quickButtons.map((b) => (
            <button
              key={b.id}
              onClick={() => setToggles((t) => ({ ...t, [b.id]: !t[b.id] }))}
              className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm transition-colors ${
                toggles[b.id] ? 'bg-[#3D7BF7] text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              <span className="text-lg">{b.icon}</span>
              {b.label}
            </button>
          ))}
        </div>

        <div className="px-6 mt-6">
          <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-[#3D7BF7] rounded-full" style={{ width: `${battery}%` }} />
          </div>
          <div className="text-white/60 text-xs mt-2">البطارية {battery}%</div>
        </div>

        <div className="px-6 mt-6">
          <div className="text-white/50 text-xs mb-2">الإشعارات</div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-white text-sm">WhatsApp · رسالة جديدة من هنودي اوسوم</div>
        </div>

        <button onClick={onClose} className="w-full h-16 mt-4 flex items-center justify-center" aria-label="إغلاق">
          <div className="w-24 h-1.5 rounded-full bg-white/40" />
        </button>
      </div>
    </div>
  );
}
