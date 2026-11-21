import { useEffect, useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

type Screen = 'main' | 'display' | 'sound' | 'battery' | 'about' | 'connections' | 'notifications' | 'wallpaper';

const ITEMS: { id: Screen; label: string; icon: string }[] = [
  { id: 'connections', label: 'الاتصالات', icon: '📶' },
  { id: 'display', label: 'الشاشة', icon: '💡' },
  { id: 'wallpaper', label: 'الخلفية وشاشة القفل', icon: '🖼' },
  { id: 'sound', label: 'الأصوات والاهتزاز', icon: '🔊' },
  { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
  { id: 'battery', label: 'البطارية', icon: '🔋' },
  { id: 'about', label: 'حول الجهاز', icon: 'ℹ️' },
];

function SubScreen({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#16181c] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-3 bg-[#16181c] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-white text-base font-semibold">{title}</span>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-2">{children}</div>
    </div>
  );
}

export function SettingsApp({ content }: { content: PhoneContent }) {
  const [screen, setScreen] = useState<Screen>('main');
  const [brightness, setBrightness] = useState(70);
  const popped = usePhoneBack(true);

  useEffect(() => {
    if (popped) setScreen('main');
  }, [popped]);

  if (screen === 'display')
    return (
      <SubScreen title="الشاشة" onBack={() => setScreen('main')}>
        <div className="rounded-3xl bg-white/5 p-4 mb-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm">الوضع الليلي</span>
            <div className="w-11 h-6 rounded-full bg-[#3D7BF7] flex items-center px-1 justify-end">
              <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-white" />
            </div>
          </div>
          <div className="text-white/60 text-xs mb-2">السطوع</div>
          <input type="range" min={10} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-[#3D7BF7]" />
        </div>
        <div className="rounded-3xl bg-white/5 p-4 text-white/60 text-sm">حجم الخط: افتراضي</div>
      </SubScreen>
    );

  if (screen === 'wallpaper')
    return (
      <SubScreen title="الخلفية وشاشة القفل" onBack={() => setScreen('main')}>
        <div className="rounded-3xl bg-white/5 p-4">
          <div className="text-white text-sm mb-3">الخلفية الحالية</div>
          <div className="w-full h-40 rounded-2xl" style={{ background: content.phone.wallpaper }} />
          <div className="text-white/50 text-xs mt-3">يمكن للإدارة تغيير الخلفية من لوحة التحكم الخاصة.</div>
        </div>
      </SubScreen>
    );

  if (screen === 'sound')
    return (
      <SubScreen title="الأصوات والاهتزاز" onBack={() => setScreen('main')}>
        {['نغمة الرنين', 'صوت الإشعارات', 'صوت النظام'].map((l) => (
          <div key={l} className="flex items-center justify-between rounded-3xl bg-white/5 p-4 mb-3">
            <span className="text-white text-sm">{l}</span>
            <div className="w-11 h-6 rounded-full bg-[#3D7BF7] flex items-center px-1 justify-end">
              <div className="w-[18px] h-[18px] rounded-full bg-white" />
            </div>
          </div>
        ))}
      </SubScreen>
    );

  if (screen === 'notifications')
    return (
      <SubScreen title="الإشعارات" onBack={() => setScreen('main')}>
        {['WhatsApp', 'الهاتف', 'ملاحظات سامسونج'].map((l) => (
          <div key={l} className="flex items-center justify-between rounded-3xl bg-white/5 p-4 mb-3">
            <span className="text-white text-sm">{l}</span>
            <div className="w-11 h-6 rounded-full bg-[#3D7BF7] flex items-center px-1 justify-end">
              <div className="w-[18px] h-[18px] rounded-full bg-white" />
            </div>
          </div>
        ))}
      </SubScreen>
    );

  if (screen === 'battery')
    return (
      <SubScreen title="البطارية" onBack={() => setScreen('main')}>
        <div className="rounded-3xl bg-white/5 p-6 text-center">
          <div className="text-white text-5xl font-bold">{content.phone.battery}%</div>
          <div className="text-white/50 text-sm mt-2">الوقت المتبقي التقريبي: 14 ساعة</div>
          <div className="h-2 rounded-full bg-white/10 mt-5 overflow-hidden">
            <div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${content.phone.battery}%` }} />
          </div>
        </div>
      </SubScreen>
    );

  if (screen === 'connections')
    return (
      <SubScreen title="الاتصالات" onBack={() => setScreen('main')}>
        {[
          ['Wi-Fi', 'STC_Fiber_5G'],
          ['بلوتوث', 'معطل'],
          ['بطاقة SIM', 'STC · 4G'],
          ['نقطة الاتصال', 'معطل'],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between rounded-3xl bg-white/5 p-4 mb-3">
            <span className="text-white text-sm">{l}</span>
            <span className="text-white/40 text-xs">{v}</span>
          </div>
        ))}
      </SubScreen>
    );

  if (screen === 'about')
    return (
      <SubScreen title="حول الجهاز" onBack={() => setScreen('main')}>
        {[
          ['اسم الجهاز', 'Galaxy S25 Ultra'],
          ['الموديل', 'SM-S938B/DS'],
          ['إصدار One UI', '7.0'],
          ['أندرويد', '15'],
          ['الموقع', content.phone.location],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between rounded-3xl bg-white/5 p-4 mb-3">
            <span className="text-white text-sm">{l}</span>
            <span className="text-white/40 text-xs">{v}</span>
          </div>
        ))}
      </SubScreen>
    );

  return (
    <div className="absolute inset-0 flex flex-col bg-[#16181c] anim-fade" dir="rtl">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <h1 className="text-white text-xl font-bold">الإعدادات</h1>
        <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
          <span className="text-white/40 text-sm">بحث الإعدادات</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 pb-6">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className="w-full flex items-center gap-4 rounded-3xl bg-white/5 p-4 mb-2.5 hover:bg-white/10 transition-colors text-right"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-white text-sm flex-1">{item.label}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/30 rotate-180" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
