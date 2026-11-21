import { useEffect, useState } from 'react';

export function usePhoneBack(active: boolean): boolean {
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (!active) return;
    setPopped(false);
    const handler = () => setPopped(true);
    window.addEventListener('phone-back', handler);
    return () => window.removeEventListener('phone-back', handler);
  }, [active]);

  useEffect(() => {
    if (popped) {
      const t = setTimeout(() => setPopped(false), 100);
      return () => clearTimeout(t);
    }
  }, [popped]);

  return popped;
}
