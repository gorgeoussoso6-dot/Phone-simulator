import { PhoneContent } from '../../lib/types';

export function LockScreen({
  content,
  timeStr,
  battery,
  onUnlock,
}: {
  content: PhoneContent;
  timeStr: string;
  battery: number;
  onUnlock: () => void;
}) {
  const w = content.weather;
  return (
    <div className="absolute inset-0 flex flex-col anim-fade">
      <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-white">
        <span>{timeStr}</span>
        <div className="flex items-center gap-1.5">
          <span dir="ltr">{battery}%</span>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#fff"><path d="M4 11h3v7H4zM9.5 7h3v11h-3zM15 3h3v15h-3z" transform="rotate(90 12 12)" /></svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-white text-7xl font-extrabold tracking-tight leading-none" dir="ltr">
          {timeStr}
        </div>
        <div className="text-white/85 text-base mt-3">{content.phone.location}</div>
        <div className="mt-10 flex items-center gap-3 rounded-3xl bg-black/25 px-6 py-3">
          <div className="text-white text-3xl font-bold">{w.temp}°</div>
          <div className="text-white/80 text-sm">{w.condition}</div>
        </div>
      </div>

      <div className="pb-10 flex flex-col items-center gap-3">
        <button
          onClick={onUnlock}
          className="text-white/90 text-sm bg-white/10 backdrop-blur rounded-full px-8 py-3 hover:bg-white/20 active:scale-95 transition-all"
        >
          اسحب لفتح الشاشة
        </button>
        <div className="w-24 h-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
