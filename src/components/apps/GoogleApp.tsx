import { useEffect, useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

export function GoogleApp({ content }: { content: PhoneContent }) {
  const [text, setText] = useState(content.googleText);
  const [submitted, setSubmitted] = useState(false);
  const popped = usePhoneBack(true);

  useEffect(() => {
    setText(content.googleText);
    setSubmitted(false);
  }, [content.googleText]);

  useEffect(() => {
    if (popped) setSubmitted(false);
  }, [popped]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0f1113] anim-fade" dir="rtl">
      <div className="px-4 pt-6 pb-2 shrink-0 text-center">
        <span className="text-3xl font-bold tracking-tight" dir="ltr">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </span>
      </div>
      <div className="px-4 mt-4 shrink-0">
        <div className="flex items-center gap-2 bg-[#1f2226] rounded-full px-4 py-3 border border-white/10 focus-within:border-white/30 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSubmitted(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setSubmitted(true)}
            className="flex-1 bg-transparent text-white text-[15px] outline-none text-right"
            dir="rtl"
          />
          {text && (
            <button onClick={() => { setText(''); setSubmitted(false); }} className="text-white/40 text-lg" aria-label="مسح">×</button>
          )}
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="mt-3 w-full py-2.5 rounded-full bg-[#2b2f36] text-white/90 text-sm hover:bg-[#343941] transition-colors"
        >
          بحث في Google
        </button>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 pt-5">
        {submitted && text.trim() && (
          <div className="anim-fade">
            <div className="text-white/40 text-xs mb-3">نتائج البحث عن: <span className="text-white/70">{text}</span></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-5 border-b border-white/5 pb-4">
                <div className="text-emerald-400/80 text-[11px] mb-1" dir="ltr">example{i}.com › results</div>
                <div className="text-[#8ab4f8] text-base leading-snug mb-1">{text} — نتيجة {i}</div>
                <div className="text-white/50 text-xs leading-relaxed">هذه شاشة محاكاة لبحث Google. النتائج المعروضة توضيحية فقط.</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
