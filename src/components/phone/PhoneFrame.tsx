import { useCallback, useEffect, useRef, useState } from 'react';
import { PhoneContent } from '../../lib/types';
import { HomeScreen } from './HomeScreen';
import { AppDrawer } from './AppDrawer';
import { LockScreen } from './LockScreen';
import { QuickPanel } from './QuickPanel';
import { AppRouter } from './AppRouter';

export type Screen = 'lock' | 'home' | 'drawer';

interface PhoneFrameProps {
  content: PhoneContent;
}

export function PhoneFrame({ content }: PhoneFrameProps) {
  const [screen, setScreen] = useState<Screen>('lock');
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ y: number; x: number } | null>(null);

  const timeStr = content.phone.time || '5:55';
  const battery = Math.max(1, Math.min(100, content.phone.battery ?? 67));

  const openApp = useCallback((id: string) => {
    setActiveApp(id);
    setScreen('home');
  }, []);

  const goHome = useCallback(() => {
    setActiveApp(null);
    setScreen('home');
  }, []);

  const goBack = useCallback(() => {
    window.dispatchEvent(new CustomEvent('phone-back'));
  }, []);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      touchStart.current = { y: e.touches[0].clientY, x: e.touches[0].clientX };
    };
    const onMove = (e: TouchEvent) => {
      const start = touchStart.current;
      if (!start || panelOpen) return;
      const dy = start.y - e.touches[0].clientY;
      const dx = Math.abs(start.x - e.touches[0].clientX);
      if (dy > 45 && dx < 50) {
        touchStart.current = null;
        if (screen === 'home' && !activeApp) {
          setScreen('drawer');
        }
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, [screen, activeApp, panelOpen]);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    let startY = 0;
    let dragging = false;
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      startY = e.clientY;
      dragging = true;
    };
    const onUp = (e: MouseEvent) => {
      if (!dragging) return;
      dragging = false;
      const dy = startY - e.clientY;
      if (dy > 45 && screen === 'home' && !activeApp && !panelOpen) {
        setScreen('drawer');
      }
      if (dy < -60 && panelOpen) {
        setPanelOpen(false);
      }
    };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [screen, activeApp, panelOpen]);

  const wallpaper = content.phone.wallpaper || '#0a1930';

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#05070c] p-2 sm:p-4">
      <div className="relative w-full max-w-[400px] h-full max-h-[860px] aspect-[9/19.5] max-h-full min-h-[560px]">
        <div
          className="absolute inset-0 rounded-[3rem] p-[10px] shadow-[0_0_60px_rgba(70,120,255,0.15)]"
          style={{ background: 'linear-gradient(160deg, #2a2f3a 0%, #14161c 60%, #23262e 100%)' }}
        >
          <div
            ref={homeRef}
            dir="rtl"
            className="relative w-full h-full rounded-[2.4rem] overflow-hidden select-none flex flex-col"
            style={{ background: wallpaper }}
          >
            {screen === 'lock' ? (
              <LockScreen
                content={content}
                timeStr={timeStr}
                battery={battery}
                onUnlock={() => setScreen('home')}
              />
            ) : (
              <>
                {/* Status bar */}
                <div className="relative z-30 flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-white shrink-0">
                  <span>{timeStr}</span>
                  <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 bg-black rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <span dir="ltr" className="tabular-nums">{battery}%</span>
                    <div className="relative w-6 h-3 border border-white/70 rounded-[3px] flex items-center px-[1.5px]" dir="ltr">
                      <div className="h-[7px] rounded-[1px] bg-white" style={{ width: `${battery * 0.75}%` }} />
                      <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-white/70 rounded-r" />
                    </div>
                  </div>
                </div>

                {/* Main area */}
                <div className="relative flex-1 min-h-0">
                  {screen === 'home' && (
                    <div className="absolute inset-0 anim-fade">
                      <HomeScreen content={content} onOpenApp={openApp} onOpenPanel={() => setPanelOpen(true)} onOpenDrawer={() => setScreen('drawer')} />
                    </div>
                  )}
                  {screen === 'drawer' && (
                    <div className="absolute inset-0 anim-fade" style={{ background: wallpaper }}>
                      <AppDrawer content={content} onOpenApp={openApp} onClose={() => setScreen('home')} />
                    </div>
                  )}
                  {activeApp && (
                    <div key={activeApp} className="absolute inset-0 anim-app z-10">
                      <AppRouter appId={activeApp} content={content} />
                    </div>
                  )}
                </div>

                {/* Nav bar */}
                <div className="shrink-0 h-12 flex items-center justify-around px-10 z-30" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <button aria-label="Recents" onClick={() => { setActiveApp(null); setScreen('home'); }} className="text-white/80 hover:text-white p-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                  </button>
                  <button aria-label="Home" onClick={goHome} className="text-white/80 hover:text-white p-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>
                  </button>
                  <button aria-label="Back" onClick={goBack} className="text-white/80 hover:text-white p-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                  </button>
                </div>

                {panelOpen && (
                  <QuickPanel content={content} onClose={() => setPanelOpen(false)} battery={battery} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -right-[3px] top-28 w-[3px] h-16 rounded bg-[#2a2f3a]" />
        <div className="absolute -left-[3px] top-24 w-[3px] h-10 rounded bg-[#2a2f3a]" />
        <div className="absolute -left-[3px] top-40 w-[3px] h-14 rounded bg-[#2a2f3a]" />
      </div>
    </div>
  );
}
