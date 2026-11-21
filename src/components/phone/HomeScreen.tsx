import { PhoneContent } from '../../lib/types';
import { appIconMap, WeatherAppIcon } from '../AppIcons';

const HOME_APPS: { id: string; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone', label: 'الهاتف' },
  { id: 'gallery', label: 'معرض' },
  { id: 'settings', label: 'الإعدادات' },
  { id: 'notes', label: 'ملاحظات سامسونج' },
];

export function HomeScreen({
  content,
  onOpenApp,
  onOpenPanel,
  onOpenDrawer,
}: {
  content: PhoneContent;
  onOpenApp: (id: string) => void;
  onOpenPanel: () => void;
  onOpenDrawer: () => void;
}) {
  const w = content.weather;

  return (
    <div className="absolute inset-0 flex flex-col">
      <button className="h-6 w-full shrink-0" onClick={onOpenPanel} aria-label="سحب لوحة الإشعارات" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-4">
        {/* Weather widget — opens the independent Weather app */}
        <button
          onClick={() => onOpenApp('weather')}
          className="w-full rounded-3xl bg-black/25 backdrop-blur p-4 mb-8 text-right hover:bg-black/35 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-4xl font-bold leading-tight">{w.temp}°</div>
              <div className="text-white/80 text-sm mt-1">{w.condition}</div>
            </div>
            <div className="w-12 h-12">
              <WeatherAppIcon />
            </div>
          </div>
          <div className="text-white/60 text-xs mt-2">{content.phone.location}</div>
        </button>

        <div className="grid grid-cols-3 gap-y-6 gap-x-2 justify-items-center">
          {HOME_APPS.map((app) => {
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
      <button
        onClick={onOpenDrawer}
        className="shrink-0 pb-6 flex flex-col items-center gap-1"
        aria-label="فتح قائمة التطبيقات"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/70" fill="currentColor">
          <circle cx="8" cy="8" r="1.9" /><circle cx="16" cy="8" r="1.9" />
          <circle cx="8" cy="14" r="1.9" /><circle cx="16" cy="14" r="1.9" />
          <circle cx="8" cy="20" r="1.9" /><circle cx="16" cy="20" r="1.9" />
        </svg>
        <span className="text-white/50 text-[10px]">كل التطبيقات</span>
      </button>
    </div>
  );
}
