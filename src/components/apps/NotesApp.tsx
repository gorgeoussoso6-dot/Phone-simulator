import { useEffect, useState } from 'react';
import { PhoneContent, Note } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

function NoteScreen({ note, onBack }: { note: Note; onBack: () => void }) {
  const [tasks, setTasks] = useState(note.tasks);
  const [title, setTitle] = useState(note.title);
  const [editing, setEditing] = useState<number | null>(null);
  const [newTask, setNewTask] = useState('');

  return (
    <div className="absolute inset-0 flex flex-col bg-[#141d26] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1b2733] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-white text-sm font-semibold flex-1 truncate">{title}</span>
        <span className="text-white/40 text-[11px]">{tasks.filter((t) => t.done).length}/{tasks.length}</span>
      </div>
      <div className="px-4 pt-3 pb-1 shrink-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-white text-2xl font-bold outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-2 space-y-1">
        {tasks.map((t, i) => (
          <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              className="w-5 h-5 accent-[#4C9EF8] shrink-0"
            />
            {editing === i ? (
              <input
                autoFocus
                value={t.text}
                onChange={(e) => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, text: e.target.value } : x)))}
                onBlur={() => setEditing(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/30"
              />
            ) : (
              <button
                onClick={() => setEditing(i)}
                className={`flex-1 text-right text-sm ${t.done ? 'text-white/40 line-through' : 'text-white'}`}
              >
                {t.text}
              </button>
            )}
            <button
              onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))}
              className="text-white/30 hover:text-red-400 text-lg shrink-0"
              aria-label="حذف"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1b2733] shrink-0">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newTask.trim()) {
              setTasks((ts) => [...ts, { id: `t-${Date.now()}`, text: newTask, done: false }]);
              setNewTask('');
            }
          }}
          placeholder="إضافة مهمة"
          className="flex-1 bg-white/10 text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder:text-white/40"
        />
        <button
          onClick={() => {
            if (newTask.trim()) {
              setTasks((ts) => [...ts, { id: `t-${Date.now()}`, text: newTask, done: false }]);
              setNewTask('');
            }
          }}
          className="w-10 h-10 rounded-full bg-[#4C9EF8] text-white text-xl"
          aria-label="إضافة"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function NotesApp({ content }: { content: PhoneContent }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const popped = usePhoneBack(true);

  useEffect(() => {
    if (popped) setOpenId(null);
  }, [popped]);

  const active = content.notes.find((n) => n.id === openId);

  if (active) return <NoteScreen note={active} onBack={() => setOpenId(null)} />;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#141d26] anim-fade" dir="rtl">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
        <h1 className="text-white text-xl font-bold">ملاحظات سامسونج</h1>
        <button className="w-9 h-9 rounded-full bg-[#4C9EF8] text-white text-xl" aria-label="ملاحظة جديدة">+</button>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar px-4 py-2">
        {content.notes.map((n) => (
          <button
            key={n.id}
            onClick={() => setOpenId(n.id)}
            className="w-full text-right rounded-3xl bg-[#1b2733] p-4 mb-3 hover:bg-[#223140] transition-colors"
          >
            <div className="text-white font-semibold">{n.title}</div>
            <div className="text-white/50 text-xs mt-1">
              {n.updatedAt} · {n.tasks.filter((t) => t.done).length}/{n.tasks.length} مكتملة
            </div>
            <div className="mt-2 space-y-1">
              {n.tasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-white/60 text-xs">
                  <div className={`w-3 h-3 rounded border ${t.done ? 'bg-[#4C9EF8] border-[#4C9EF8]' : 'border-white/30'}`} />
                  <span className={t.done ? 'line-through' : ''}>{t.text}</span>
                </div>
              ))}
              {n.tasks.length > 3 && <div className="text-white/30 text-[11px]">+{n.tasks.length - 3} أخرى</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
