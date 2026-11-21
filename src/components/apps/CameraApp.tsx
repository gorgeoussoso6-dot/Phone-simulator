import { useEffect, useRef, useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

export function CameraApp({ content }: { content: PhoneContent }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState<'pending' | 'active' | 'denied' | 'unavailable'>('pending');
  const popped = usePhoneBack(true);
  void popped;

  useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setLive('unavailable');
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setLive('active');
      } catch {
        setLive('denied');
      }
    };
    start();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col bg-black anim-fade" dir="rtl">
      <div className="flex-1 relative overflow-hidden">
        {live === 'active' && (
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        )}
        {live !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117] px-6 text-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/30 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <div className="text-white/60 text-sm">
              {live === 'denied'
                ? 'تم رفض الوصول للكاميرا. الصورة المعروضة للعرض فقط وليست من كاميرا الجهاز.'
                : 'الكاميرا غير متاحة في هذا المتصفح. هذه شاشة توضيحية فقط.'}
            </div>
          </div>
        )}

        <div className="absolute top-4 inset-x-0 flex justify-center">
          <div className="bg-black/60 backdrop-blur rounded-full px-5 py-2 text-white text-lg font-bold">
            {content.cameraPhrase}
          </div>
        </div>

        {live === 'active' && (
          <div className="absolute inset-6 border border-white/20 rounded-2xl pointer-events-none" />
        )}
      </div>

      <div className="bg-[#101318] pt-3 pb-6 shrink-0">
        <div className="flex justify-center gap-5 text-white/70 text-xs mb-4">
          {['تصوير', 'فيديو', 'بورتريه', 'ليلي'].map((m, i) => (
            <span key={m} className={i === 0 ? 'text-yellow-400 font-bold' : ''}>{m}</span>
          ))}
        </div>
        <div className="flex items-center justify-around px-10">
          <div className="w-11 h-11 rounded-lg bg-white/10" aria-hidden />
          <button className="w-16 h-16 rounded-full border-4 border-white bg-white/20 active:scale-90 transition-transform" aria-label="التقاط" />
          <button
            className="w-11 h-11 rounded-full"
            style={{
              background: live === 'active'
                ? 'conic-gradient(from 0deg, #f43f5e, #f59e0b, #22c55e, #3b82f6, #f43f5e)'
                : '#2a2f38',
            }}
            aria-label="معرض"
          />
        </div>
      </div>
    </div>
  );
}
