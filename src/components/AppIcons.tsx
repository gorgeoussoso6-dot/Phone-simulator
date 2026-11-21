import type { JSX } from 'react';

const S = ({ children, bg }: { children: React.ReactNode; bg: string }) => (
  <div
    className="icon-shape w-full h-full flex items-center justify-center shadow-lg"
    style={{ background: bg }}
  >
    {children}
  </div>
);

export function WhatsAppIcon() {
  return (
    <div className="relative w-full h-full icon-shape overflow-hidden">
      <S bg="#075E54">
        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="#fff">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3 0-.5-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
        </svg>
      </S>
    </div>
  );
}

export function PhoneAppIcon() {
  return (
    <S bg="#3DBE72">
      <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="#fff">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.3 0 .7-.2 1l-2.3 2Z" />
      </svg>
    </S>
  );
}

export function GalleryIcon() {
  return (
    <S bg="#fff">
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5">
        <circle cx="8.2" cy="8.2" r="3.4" fill="#FFCF3F" />
        <circle cx="15.8" cy="8.2" r="3.4" fill="#FF5964" />
        <circle cx="8.2" cy="15.8" r="3.4" fill="#4CB8FF" />
        <circle cx="15.8" cy="15.8" r="3.4" fill="#43D16A" />
      </svg>
    </S>
  );
}

export function SettingsIcon() {
  return (
    <S bg="#8E9AA6">
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="#fff">
        <path d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.5a.5.5 0 0 0 .1-.7l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.3 1a7.6 7.6 0 0 0-1.7-1l-.4-2.5a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.5c-.6.3-1.2.6-1.7 1l-2.3-1a.5.5 0 0 0-.6.2L2.5 8.8a.5.5 0 0 0 .1.7l2 1.5a7.8 7.8 0 0 0 0 2l-2 1.5a.5.5 0 0 0-.1.7l1.9 3.3c.1.2.4.3.6.2l2.3-1c.5.4 1.1.7 1.7 1l.4 2.5c0 .2.3.4.5.4h3.8c.2 0 .5-.2.5-.4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.3 1c.2.1.5 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.7l-2-1.5ZM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" />
      </svg>
    </S>
  );
}

export function NotesIcon() {
  return (
    <S bg="#FFD54D">
      <div className="w-3/5 h-3/5 flex flex-col justify-center gap-[9%]" dir="ltr">
        <div className="h-[7%] w-full rounded-full bg-[#7A5C00]" />
        <div className="h-[7%] w-4/5 rounded-full bg-[#7A5C00]" />
        <div className="h-[7%] w-3/5 rounded-full bg-[#7A5C00]" />
      </div>
    </S>
  );
}

export function CameraAppIcon() {
  return (
    <S bg="#2B3038">
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#DDE3EA" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="#5AB0FF" />
        <circle cx="13.8" cy="10" r="1.2" fill="#EAF4FF" />
      </svg>
    </S>
  );
}

export function GoogleIcon() {
  return (
    <S bg="#fff">
      <svg viewBox="0 0 48 48" className="w-3/5 h-3/5">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5Z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5Z" />
        <path fill="#FBBC05" d="M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1Z" />
        <path fill="#34A853" d="M24 48c6.1 0 11.2-2 15-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.5 2.2-6.3 0-11.7-3.7-13.6-9l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
      </svg>
    </S>
  );
}

export function WeatherAppIcon() {
  return (
    <S bg="#4C9EF8">
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="#fff">
        <circle cx="9" cy="9" r="4" />
        <path d="M17.5 11a3.5 3.5 0 0 0-3.4 2.6 3 3 0 0 0 .4 5.9h6a3 3 0 0 0 .5-5.9A3.5 3.5 0 0 0 17.5 11Z" opacity="0.95" />
        <path d="M5 15.5a2.8 2.8 0 0 0 0 5.6h.3" opacity="0" />
      </svg>
    </S>
  );
}

export function MessageCircleIcon() {
  return (
    <S bg="#3D7BF7">
      <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="#fff">
        <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.4 5.1 3.6 6.7L5 22l4.3-1.9c.9.2 1.8.3 2.7.3 5.5 0 10-3.9 10-8.7S17.5 3 12 3Z" />
      </svg>
    </S>
  );
}

export function ClockAppIcon() {
  return (
    <S bg="#0F1B2E">
      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="#4C9EF8" strokeWidth="1.6" />
        <path d="M12 7.5V12l3 2" stroke="#4C9EF8" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </S>
  );
}

export function StoreAppIcon() {
  return (
    <S bg="#fff">
      <svg viewBox="0 0 48 48" className="w-3/5 h-3/5">
        <path fill="#00C4FF" d="M8 6l16 18L8 42c-.9-.5-1.5-1.4-1.5-2.6V8.6C6.5 7.4 7.1 6.5 8 6Z" opacity="0" />
        <path fill="#00A0FF" d="M8 5.5 26.5 24 8 42.5c-.9-.5-1.5-1.5-1.5-2.7V8.2C6.5 7 7.1 6 8 5.5Z" />
        <path fill="#FFCE00" d="m32.5 17.9-6 6.1 6 6.1 7.6-4.3c1.8-1 1.8-2.6 0-3.6l-7.6-4.3Z" />
        <path fill="#FF3A44" d="M26.5 24 8 42.5c.4.2 1 .3 1.6 0L26.5 24l-6-6.1L26.5 24Z" opacity="0" />
        <path fill="#00E076" d="M9.6 5.2c-.6-.3-1.1-.2-1.6 0l18.5 18.8 6-6.1L9.6 5.2Z" />
        <path fill="#FF3A44" d="M26.5 24 8 42.8c.5.3 1 .3 1.6-.1L32.5 30l-6-6Z" />
      </svg>
    </S>
  );
}

export const appIconMap: Record<string, () => JSX.Element> = {
  whatsapp: WhatsAppIcon,
  phone: PhoneAppIcon,
  gallery: GalleryIcon,
  settings: SettingsIcon,
  notes: NotesIcon,
  camera: CameraAppIcon,
  google: GoogleIcon,
  weather: WeatherAppIcon,
};
