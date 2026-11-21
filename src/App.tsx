import { useEffect, useState } from 'react';
import { PhoneFrame } from './components/phone/PhoneFrame';
import { AdminApp } from './admin/AdminApp';
import { getPublishedState } from './lib/api';
import { initialContent, sanitizeContent } from './lib/defaults';
import type { PhoneContent } from './lib/types';

export default function App() {
  const [route, setRoute] = useState<'phone' | 'admin'>(() =>
    window.location.hash === '#admin' ? 'admin' : 'phone'
  );
  const [content, setContent] = useState<PhoneContent>(initialContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash === '#admin' ? 'admin' : 'phone');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    getPublishedState()
      .then(setContent)
      .catch(() => setContent(sanitizeContent(initialContent)))
      .finally(() => setLoaded(true));
  }, []);

  if (route === 'admin') return <AdminApp onExit={() => (window.location.hash = '')} />;

  return (
    <div className="h-screen bg-[#05070c]">
      {!loaded ? (
        <div className="h-full flex items-center justify-center" dir="rtl">
          <span className="text-white/50 text-sm">جارٍ تحميل جوال ياسر مخ…</span>
        </div>
      ) : (
        <PhoneFrame content={content} />
      )}
    </div>
  );
}
