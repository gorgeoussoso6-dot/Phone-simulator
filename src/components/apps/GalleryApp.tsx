import { useEffect, useState } from 'react';
import { PhoneContent, Photo } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

export function GalleryApp({ content }: { content: PhoneContent }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [album, setAlbum] = useState<string>('a-all');
  const popped = usePhoneBack(true);

  useEffect(() => {
    if (popped) setOpenIdx(null);
  }, [popped]);

  const photos: Photo[] = content.photos.filter((p) => album === 'a-all' || p.albumId === album);
  const activeAlbum = content.albums.find((a) => a.id === album);

  if (openIdx !== null && photos[openIdx]) {
    const p = photos[openIdx];
    return (
      <div className="absolute inset-0 flex flex-col bg-black anim-chat" dir="rtl">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#14181f] shrink-0">
          <button onClick={() => setOpenIdx(null)} className="text-white/90 p-1" aria-label="رجوع">
            <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <span className="text-white text-sm">{p.name}</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <img src={p.url} alt={p.name} className="max-w-full max-h-full object-contain" />
          {openIdx > 0 && (
            <button
              onClick={() => setOpenIdx(openIdx - 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
              aria-label="السابق"
            >
              ›
            </button>
          )}
          {openIdx < photos.length - 1 && (
            <button
              onClick={() => setOpenIdx(openIdx + 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
              aria-label="التالي"
            >
              ‹
            </button>
          )}
        </div>
        <div className="bg-[#14181f] py-3 flex justify-around text-white/60 text-[11px] shrink-0">
          <span>{openIdx + 1} / {photos.length}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1117] anim-fade" dir="rtl">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <h1 className="text-white text-xl font-bold">معرض</h1>
      </div>
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar shrink-0">
        {content.albums.map((a) => (
          <button
            key={a.id}
            onClick={() => setAlbum(a.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              album === a.id ? 'bg-[#3D7BF7] text-white' : 'bg-white/10 text-white/70'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-1">
        {photos.length === 0 ? (
          <div className="text-white/40 text-center text-sm mt-16 px-8">
            {activeAlbum?.name === 'الكل' ? 'لا توجد صور بعد. يمكن للإدارة رفع الصور من لوحة التحكم الخاصة.' : 'هذا الألبوم فارغ.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {photos.map((p, i) => (
              <button key={p.id} onClick={() => setOpenIdx(i)} className="aspect-square overflow-hidden group">
                <img src={p.url} alt={p.name} className="w-full h-full object-cover group-active:scale-95 transition-transform" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
