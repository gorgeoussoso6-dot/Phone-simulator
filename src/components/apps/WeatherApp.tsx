import { PhoneContent } from '../../lib/types';

const forecast = [
  { day: 'الأحد', icon: '☀️', hi: 34, lo: 20 },
  { day: 'الاثنين', icon: '⛅', hi: 32, lo: 19 },
  { day: 'الثلاثاء', icon: '☀️', hi: 35, lo: 21 },
  { day: 'الأربعاء', icon: '🌤', hi: 33, lo: 20 },
  { day: 'الخميس', icon: '☀️', hi: 34, lo: 22 },
];

export function WeatherApp({ content }: { content: PhoneContent }) {
  const w = content.weather;
  return (
    <div className="absolute inset-0 flex flex-col anim-fade" dir="rtl" style={{ background: 'linear-gradient(180deg,#1a3a5c 0%,#0d1f33 70%)' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 text-center">
        <div className="text-white/90 text-lg">{content.phone.location}</div>
        {w.simulated && (
          <div className="inline-block mt-1 text-[10px] bg-white/10 text-white/60 rounded-full px-2 py-0.5">بيانات جو محاكاة</div>
        )}
        <div className="text-white text-8xl font-extrabold mt-3 leading-none">{w.temp}°</div>
        <div className="text-white/80 text-base mt-2">{w.condition}</div>
        <div className="text-white/60 text-sm mt-1">أعلى {w.high}° · أدنى {w.low}°</div>

        <div className="grid grid-cols-3 gap-2 mt-6">
          {[
            ['الرطوبة', `${w.humidity}%`],
            ['الرياح', `${w.wind} كم/س`],
            ['الشعور', `${w.temp + 2}°`],
          ].map(([l, v]) => (
            <div key={l} className="rounded-3xl bg-white/10 p-3">
              <div className="text-white/50 text-[10px]">{l}</div>
              <div className="text-white text-sm mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white/10 mt-4 p-3 text-right">
          {forecast.map((f) => (
            <div key={f.day} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/80 text-sm w-16">{f.day}</span>
              <span className="text-lg">{f.icon}</span>
              <span className="text-white/50 text-xs">{f.lo}°</span>
              <span className="text-white text-sm w-8 text-left">{f.hi}°</span>
            </div>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}
