import { PhoneContent } from '../../lib/types';
import { WhatsAppApp } from '../apps/WhatsAppApp';
import { PhoneApp } from '../apps/PhoneApp';
import { NotesApp } from '../apps/NotesApp';
import { CameraApp } from '../apps/CameraApp';
import { GalleryApp } from '../apps/GalleryApp';
import { GoogleApp } from '../apps/GoogleApp';
import { SettingsApp } from '../apps/SettingsApp';
import { WeatherApp } from '../apps/WeatherApp';

export function AppRouter({ appId, content }: { appId: string; content: PhoneContent }) {
  switch (appId) {
    case 'whatsapp':
      return <WhatsAppApp content={content} />;
    case 'phone':
      return <PhoneApp content={content} />;
    case 'notes':
      return <NotesApp content={content} />;
    case 'camera':
      return <CameraApp content={content} />;
    case 'gallery':
      return <GalleryApp content={content} />;
    case 'google':
      return <GoogleApp content={content} />;
    case 'settings':
      return <SettingsApp content={content} />;
    case 'weather':
      return <WeatherApp content={content} />;
    default:
      return <div className="h-full bg-[#0b121e]" />;
  }
}
