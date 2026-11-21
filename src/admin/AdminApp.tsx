import { useEffect, useMemo, useState } from 'react';
import type { PhoneContent, AdminSection } from '../lib/types';
import { login, logout, getStoredPassword, getAdminState, saveDraft, publish, changePassword } from '../lib/api';
import { initialContent, sanitizeContent } from '../lib/defaults';
import { PhoneFrame } from '../components/phone/PhoneFrame';
import { Btn, Card, diffPaths } from './ui';
import { WhatsAppSection, PhoneSection, NotesSection } from './sections';
import { GallerySection, SimpleSection, CustomizeSection } from './sections2';
import { inputCls } from './ui';

const SECTIONS: { id: AdminSection; label: string; icon: string }[] = [
  { id: 'whatsapp', label: 'إدارة واتساب', icon: '💬' },
  { id: 'phone', label: 'سجل المكالمات', icon: '📞' },
  { id: 'notes', label: 'الملاحظات', icon: '📝' },
  { id: 'gallery', label: 'المعرض', icon: '🖼' },
  { id: 'camera', label: 'الكاميرا و Google', icon: '📷' },
  { id: 'google', label: 'تخصيص الجهاز والطقس', icon: '⚙️' },
  { id: 'security', label: 'كلمة المرور', icon: '🔒' },
];

function Login({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr('');
    try {
      await login(pw);
      onLogin(pw);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'فشل تسجيل الدخول');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070c] p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8">
        <h1 className="text-white text-2xl font-bold text-center mb-1">جوال ياسر مخ</h1>
        <p className="text-white/50 text-sm text-center mb-6">لوحة التحكم الخاصة — الدخول للمشرف فقط</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="كلمة المرور"
          className={`${inputCls} mb-3`}
          autoFocus
        />
        {err && <div className="text-red-400 text-sm mb-3">{err}</div>}
        <Btn variant="primary" onClick={submit} className="w-full">
          {busy ? 'جارٍ التحقق…' : 'دخول'}
        </Btn>
        <p className="text-white/30 text-[11px] mt-4 text-center leading-relaxed">
          كلمة المرور الافتراضية: yasser555 — يُنصح بتغييرها من قسم كلمة المرور بعد أول دخول.
        </p>
      </div>
    </div>
  );
}

export function AdminApp({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(() => !!getStoredPassword());
  const [draft, setDraft] = useState<PhoneContent>(initialContent);
  const [published, setPublished] = useState<PhoneContent>(initialContent);
  const [publishedAt, setPublishedAt] = useState('');
  const [section, setSection] = useState<AdminSection>('whatsapp');
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [curPw, setCurPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const password = getStoredPassword() || '';

  useEffect(() => {
    if (!authed) return;
    getAdminState(password)
      .then((s) => {
        setDraft(s.draft);
        setPublished(s.published);
        setPublishedAt(s.publishedAt);
      })
      .catch(() => setStatus('فشل تحميل البيانات'));
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (fn: (d: PhoneContent) => PhoneContent) => {
    setDraft((d) => fn(d));
    setDirty(true);
  };

  const doSave = async () => {
    setBusy(true);
    setStatus('');
    try {
      await saveDraft(password, draft);
      setDirty(false);
      setStatus('تم حفظ المسودة');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setBusy(false);
    }
  };

  const doPublish = async () => {
    setBusy(true);
    setStatus('');
    try {
      await saveDraft(password, draft);
      await publish(password);
      const s = await getAdminState(password);
      setPublished(s.published);
      setPublishedAt(s.publishedAt);
      setDirty(false);
      setStatus('تم النشر بنجاح — النسخة المنشورة محفوظة');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'فشل النشر');
    } finally {
      setBusy(false);
    }
  };

  const doChangePw = async () => {
    setPwMsg('');
    try {
      await changePassword(password, curPw, newPw);
      sessionStorage.setItem('yasser-admin-session', newPw);
      setPwMsg('تم تغيير كلمة المرور');
      setCurPw('');
      setNewPw('');
    } catch (e) {
      setPwMsg(e instanceof Error ? e.message : 'فشل التغيير');
    }
  };

  const diffs = useMemo(() => diffPaths(published, draft), [published, draft]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  if (preview)
    return (
      <div className="h-screen flex flex-col bg-[#05070c]" dir="rtl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 shrink-0">
          <span className="text-white text-sm font-semibold">معاينة المسودة (خاصة — لم يتم النشر)</span>
          <Btn onClick={() => setPreview(false)}>إغلاق المعاينة</Btn>
        </div>
        <div className="flex-1 min-h-0">
          <PhoneFrame content={draft} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#05070c] text-white" dir="rtl">
      <header className="sticky top-0 z-40 bg-[#0a0e16]/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold ml-2">جوال ياسر مخ — لوحة التحكم</h1>
          <span className="text-xs text-white/40">
            آخر نشر: {publishedAt ? new Date(publishedAt).toLocaleString('ar-SA') : 'لم يُنشر بعد'}
          </span>
          <div className="flex-1" />
          {dirty && <span className="text-xs text-amber-400">تغييرات غير محفوظة</span>}
          {status && <span className="text-xs text-emerald-400">{status}</span>}
          <Btn onClick={() => setPreview(true)} className="text-xs">معاينة</Btn>
          <Btn onClick={doSave} className="text-xs">حفظ المسودة</Btn>
          <Btn variant="success" onClick={doPublish} className="text-xs">نشر</Btn>
          <Btn variant="ghost" onClick={onExit} className="text-xs">عرض الجوال</Btn>
          <Btn
            variant="ghost"
            onClick={() => {
              logout();
              setAuthed(false);
            }}
            className="text-xs"
          >
            خروج
          </Btn>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 p-4">
        <nav className="lg:w-56 shrink-0 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                section === s.id ? 'bg-[#3D7BF7] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setShowDiff(true)}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm bg-white/5 text-white/70 hover:bg-white/10 whitespace-nowrap"
          >
            <span>🔀</span> مقارنة المسودة بالمنشور ({diffs.length})
          </button>
        </nav>

        <main className="flex-1 min-w-0">
          {showDiff ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">الفرق بين النسخة المنشورة والمسودة</span>
                <Btn onClick={() => setShowDiff(false)}>إغلاق</Btn>
              </div>
              {diffs.length === 0 ? (
                <div className="text-white/50 text-sm">لا توجد فروق — المسودة مطابقة للنسخة المنشورة.</div>
              ) : (
                <div className="space-y-2">
                  {diffs.map((d, i) => (
                    <div key={i} className="rounded-xl bg-black/30 p-3 text-sm">
                      <div className="text-white/40 text-[11px] mb-1" dir="ltr">{d.path}</div>
                      <div className="text-red-300/80 text-xs">المنشور: {d.before || '—'}</div>
                      <div className="text-emerald-300/90 text-xs">المسودة: {d.after || '—'}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <>
              {section === 'whatsapp' && <WhatsAppSection draft={draft} update={update} />}
              {section === 'phone' && <PhoneSection draft={draft} update={update} />}
              {section === 'notes' && <NotesSection draft={draft} update={update} />}
              {section === 'gallery' && <GallerySection draft={draft} update={update} password={password} />}
              {section === 'camera' && <SimpleSection draft={draft} update={update} />}
              {section === 'google' && <CustomizeSection draft={draft} update={update} />}
              {section === 'security' && (
                <Card className="max-w-md">
                  <div className="font-semibold mb-4">تغيير كلمة المرور</div>
                  <div className="space-y-3">
                    <input type="password" placeholder="كلمة المرور الحالية" className={inputCls} value={curPw} onChange={(e) => setCurPw(e.target.value)} />
                    <input type="password" placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)" className={inputCls} value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                    {pwMsg && <div className="text-sm text-emerald-400">{pwMsg}</div>}
                    <Btn variant="primary" onClick={doChangePw}>تغيير</Btn>
                  </div>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export { sanitizeContent };
