import { useRef, useState } from 'react';
import { PhoneContent, Photo } from '../lib/types';
import { uploadPhoto, deletePhotoFile } from '../lib/api';
import { Card, Btn, Field, inputCls } from './ui';

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function GallerySection({
  draft,
  update,
  password,
}: {
  draft: PhoneContent;
  update: (fn: (d: PhoneContent) => PhoneContent) => void;
  password: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [albumTarget, setAlbumTarget] = useState('a-all');

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr('');
    try {
      const added: Photo[] = [];
      for (const file of Array.from(files)) {
        const { url, path } = await uploadPhoto(password, file, albumTarget);
        added.push({ id: `p-${uid()}`, url, path, albumId: albumTarget, name: file.name, addedAt: new Date().toISOString() });
      }
      update((d) => ({ ...d, photos: [...d.photos, ...added] }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'فشل رفع الصور');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removePhoto = async (p: Photo) => {
    update((d) => ({ ...d, photos: d.photos.filter((x) => x.id !== p.id) }));
    try {
      await deletePhotoFile(password, p.path);
    } catch {
      // row already removed from draft; storage cleanup best-effort
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-white font-semibold mb-3">رفع صور جديدة</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Field label="الألبوم المستهدف">
            <select className={inputCls} value={albumTarget} onChange={(e) => setAlbumTarget(e.target.value)}>
              {draft.albums.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="w-full text-white/70 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#3D7BF7] file:px-4 file:py-2 file:text-white"
            />
          </div>
        </div>
        {busy && <div className="text-[#3D7BF7] text-sm">جارٍ الرفع…</div>}
        {err && <div className="text-red-400 text-sm">{err}</div>}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">الألبومات</span>
          <Btn
            onClick={() => update((d) => ({ ...d, albums: [...d.albums, { id: `a-${uid()}`, name: 'ألبوم جديد' }] }))}
          >
            + ألبوم
          </Btn>
        </div>
        {draft.albums.map((a) => (
          <div key={a.id} className="flex items-center gap-2 mb-2">
            <input
              className={inputCls}
              value={a.name}
              onChange={(e) => update((d) => ({ ...d, albums: d.albums.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)) }))}
            />
            {a.id !== 'a-all' && (
              <button
                onClick={() => update((d) => ({ ...d, albums: d.albums.filter((x) => x.id !== a.id) }))}
                className="text-white/40 hover:text-red-400 px-2"
              >
                حذف
              </button>
            )}
          </div>
        ))}
      </Card>

      <Card>
        <div className="text-white font-semibold mb-3">الصور ({draft.photos.length})</div>
        {draft.photos.length === 0 && <div className="text-white/40 text-sm">لا توجد صور مرفوعة بعد.</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {draft.photos.map((p) => (
            <div key={p.id} className="relative group">
              <img src={p.url} alt={p.name} className="w-full aspect-square object-cover rounded-xl" />
              <button
                onClick={() => removePhoto(p)}
                className="absolute top-1 left-1 w-7 h-7 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="حذف الصورة"
              >
                ×
              </button>
              <select
                className="w-full mt-1 bg-white/10 border border-white/10 rounded-lg text-[11px] text-white py-1"
                value={p.albumId}
                onChange={(e) => update((d) => ({ ...d, photos: d.photos.map((x) => (x.id === p.id ? { ...x, albumId: e.target.value } : x)) }))}
              >
                {draft.albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function SimpleSection({
  draft,
  update,
}: {
  draft: PhoneContent;
  update: (fn: (d: PhoneContent) => PhoneContent) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <Field label="عبارة شاشة الكاميرا">
          <input
            className={inputCls}
            value={draft.cameraPhrase}
            onChange={(e) => update((d) => ({ ...d, cameraPhrase: e.target.value }))}
          />
        </Field>
      </Card>
      <Card>
        <Field label="نص البحث الابتدائي في Google">
          <input
            className={inputCls}
            value={draft.googleText}
            onChange={(e) => update((d) => ({ ...d, googleText: e.target.value }))}
          />
        </Field>
      </Card>
    </div>
  );
}

export function CustomizeSection({
  draft,
  update,
}: {
  draft: PhoneContent;
  update: (fn: (d: PhoneContent) => PhoneContent) => void;
}) {
  const wallpapers = ['#0a1930', '#000000', '#101820', '#1a1a2e', '#0f2027', '#2c3e50'];
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="الوقت المعروض">
            <input
              className={inputCls}
              value={draft.phone.time}
              onChange={(e) => update((d) => ({ ...d, phone: { ...d.phone, time: e.target.value } }))}
            />
          </Field>
          <Field label="نسبة البطارية (%)">
            <input
              type="number"
              min={1}
              max={100}
              className={inputCls}
              value={draft.phone.battery}
              onChange={(e) => update((d) => ({ ...d, phone: { ...d.phone, battery: Number(e.target.value) || 0 } }))}
            />
          </Field>
          <Field label="الموقع">
            <input
              className={inputCls}
              value={draft.phone.location}
              onChange={(e) => update((d) => ({ ...d, phone: { ...d.phone, location: e.target.value } }))}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="text-white/60 text-xs mb-2">الخلفية</div>
        <div className="flex flex-wrap gap-3">
          {wallpapers.map((c) => (
            <button
              key={c}
              onClick={() => update((d) => ({ ...d, phone: { ...d.phone, wallpaper: c } }))}
              className={`w-12 h-12 rounded-xl border-2 transition-transform active:scale-90 ${
                draft.phone.wallpaper === c ? 'border-[#3D7BF7]' : 'border-white/20'
              }`}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-white font-semibold mb-3">الطقس</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="درجة الحرارة">
            <input type="number" className={inputCls} value={draft.weather.temp} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, temp: Number(e.target.value) || 0 } }))} />
          </Field>
          <Field label="الحالة">
            <input className={inputCls} value={draft.weather.condition} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, condition: e.target.value } }))} />
          </Field>
          <Field label="أعلى درجة">
            <input type="number" className={inputCls} value={draft.weather.high} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, high: Number(e.target.value) || 0 } }))} />
          </Field>
          <Field label="أدنى درجة">
            <input type="number" className={inputCls} value={draft.weather.low} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, low: Number(e.target.value) || 0 } }))} />
          </Field>
          <Field label="الرطوبة %">
            <input type="number" className={inputCls} value={draft.weather.humidity} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, humidity: Number(e.target.value) || 0 } }))} />
          </Field>
          <Field label="الرياح كم/س">
            <input type="number" className={inputCls} value={draft.weather.wind} onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, wind: Number(e.target.value) || 0 } }))} />
          </Field>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={draft.weather.simulated}
            onChange={(e) => update((d) => ({ ...d, weather: { ...d.weather, simulated: e.target.checked } }))}
            className="accent-[#3D7BF7]"
          />
          إظهار علامة "بيانات جو محاكاة"
        </label>
      </Card>
    </div>
  );
}
