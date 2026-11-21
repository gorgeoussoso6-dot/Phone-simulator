import { useEffect, useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

type Tab = 'recents' | 'contacts' | 'dial';

const typeIcon: Record<string, { color: string; label: string }> = {
  missed: { color: '#ef4444', label: 'فقوت' },
  incoming: { color: '#22c55e', label: 'واردة' },
  outgoing: { color: '#3b82f6', label: 'صادرة' },
};

function DialPad({ onBack }: { onBack: () => void }) {
  const [digits, setDigits] = useState('');
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b121e] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#121b2c] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-white text-sm font-semibold">لوحة الاتصال</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-3xl tracking-widest" dir="ltr">{digits}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 px-10 pb-4">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setDigits((d) => d + k)}
            className="w-14 h-14 mx-auto rounded-full bg-white/10 text-white text-xl font-semibold hover:bg-white/20 active:scale-90 transition-all"
          >
            {k}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-6 pb-6">
        <button onClick={() => setDigits('')} className="text-white/60 text-sm">مسح</button>
        <button className="w-14 h-14 rounded-full bg-[#22c55e] flex items-center justify-center" aria-label="اتصال">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#fff"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.3 2Z" /></svg>
        </button>
      </div>
    </div>
  );
}

export function PhoneApp({ content }: { content: PhoneContent }) {
  const [tab, setTab] = useState<Tab>('recents');
  const [dialOpen, setDialOpen] = useState(false);
  const popped = usePhoneBack(true);

  useEffect(() => {
    if (popped) {
      if (dialOpen) setDialOpen(false);
      else setTab('recents');
    }
  }, [popped]); // eslint-disable-line react-hooks/exhaustive-deps

  if (dialOpen) return <DialPad onBack={() => setDialOpen(false)} />;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b121e] anim-fade" dir="rtl">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h1 className="text-white text-xl font-bold">الهاتف</h1>
      </div>
      <div className="flex px-4 gap-2 shrink-0">
        {([['recents', 'المكالمات الأخيرة'], ['contacts', 'جهات الاتصال'], ['dial', 'لوحة الاتصال']] as [Tab, string][]).map(
          ([id, label]) => (
            <button
              key={id}
              onClick={() => (id === 'dial' ? setDialOpen(true) : setTab(id))}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                tab === id && id !== 'dial' ? 'bg-[#3D7BF7] text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar mt-2">
        {tab === 'recents' &&
          content.calls.map((c) => {
            const t = typeIcon[c.type] || typeIcon.incoming;
            return (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 rotate-[135deg]" fill={t.color}>
                  {c.type === 'missed' ? (
                    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.3 2Z" />
                  ) : (
                    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.3 2Z" />
                  )}
                </svg>
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] truncate ${c.type === 'missed' ? 'text-red-400' : 'text-white'}`}>{c.name}</div>
                  <div className="text-white/40 text-xs">{t.label} · {c.time}</div>
                </div>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#22c55e]" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.3 2Z" /></svg>
              </div>
            );
          })}
        {tab === 'contacts' && (
          <div className="px-5">
            {Array.from(new Set(content.calls.map((c) => c.name))).map((name) => (
              <div key={name} className="flex items-center gap-3 py-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#33465e] flex items-center justify-center text-white font-bold">
                  {name.trim().charAt(0)}
                </div>
                <span className="text-white text-[15px]">{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-14 flex items-center justify-center shrink-0">
        <div className="w-24 h-1.5 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
