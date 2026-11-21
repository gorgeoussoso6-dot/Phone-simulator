import { PhoneContent, Conversation, Message, CallEntry, Note } from '../lib/types';
import { Card, Btn, Field, inputCls } from './ui';

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function WhatsAppSection({
  draft,
  update,
}: {
  draft: PhoneContent;
  update: (fn: (d: PhoneContent) => PhoneContent) => void;
}) {
  const convos = draft.whatsapp.conversations;

  const setConvos = (next: Conversation[]) =>
    update((d) => ({ ...d, whatsapp: { conversations: next } }));

  const patch = (id: string, patch: Partial<Conversation>) =>
    setConvos(convos.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addConversation = (type: 'individual' | 'group') =>
    setConvos([
      ...convos,
      {
        id: `c-${uid()}`,
        name: type === 'group' ? 'مجموعة جديدة' : 'جهة اتصال جديدة',
        type,
        archived: false,
        sort: convos.length + 1,
        time: 'الآن',
        unread: false,
        members: type === 'group' ? ['ياسر مخ'] : ['ياسر مخ'],
        messages: [],
      },
    ]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Btn onClick={() => addConversation('individual')} variant="primary">+ محادثة فردية</Btn>
        <Btn onClick={() => addConversation('group')} variant="primary">+ مجموعة</Btn>
      </div>

      {convos.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                {c.type === 'group' ? 'مجموعة' : 'فردي'}
              </span>
              {c.archived && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">مؤرشفة</span>}
              <span className="text-white font-semibold truncate">{c.name}</span>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Btn onClick={() => patch(c.id, { archived: !c.archived })} className="!px-3 !py-1 text-xs">
                {c.archived ? 'إلغاء الأرشفة' : 'أرشفة'}
              </Btn>
              <Btn onClick={() => setConvos(convos.filter((x) => x.id !== c.id))} variant="danger" className="!px-3 !py-1 text-xs">
                حذف
              </Btn>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="الاسم">
              <input className={inputCls} value={c.name} onChange={(e) => patch(c.id, { name: e.target.value })} />
            </Field>
            <Field label="النوع">
              <select className={inputCls} value={c.type} onChange={(e) => patch(c.id, { type: e.target.value as 'individual' | 'group' })}>
                <option value="individual">فردي</option>
                <option value="group">مجموعة</option>
              </select>
            </Field>
            <Field label="وقت المعاينة">
              <input className={inputCls} value={c.time} onChange={(e) => patch(c.id, { time: e.target.value })} />
            </Field>
            <Field label="الترتيب">
              <input type="number" className={inputCls} value={c.sort} onChange={(e) => patch(c.id, { sort: Number(e.target.value) || 0 })} />
            </Field>
          </div>

          <label className="flex items-center gap-2 mt-3 text-sm text-white/80">
            <input type="checkbox" checked={c.unread} onChange={(e) => patch(c.id, { unread: e.target.checked })} className="accent-[#3D7BF7]" />
            غير مقروءة
          </label>

          <div className="mt-3">
            <div className="text-white/60 text-xs mb-2">الأعضاء (الأحرف الأولى تُستخدم كصور دائرية تلقائياً)</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {c.members.map((m, i) => (
                <span key={`${m}-${i}`} className="flex items-center gap-1 bg-white/10 rounded-full pl-2 pr-3 py-1 text-xs text-white">
                  {m}
                  <button
                    onClick={() => patch(c.id, { members: c.members.filter((_, j) => j !== i) })}
                    className="text-white/40 hover:text-red-400"
                    aria-label="إزالة"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputCls}
                placeholder="اسم عضو جديد"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    patch(c.id, { members: [...c.members, e.currentTarget.value.trim()] });
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs">الرسائل ({c.messages.length})</span>
              <Btn
                onClick={() =>
                  patch(c.id, {
                    messages: [
                      ...c.messages,
                      { id: `m-${uid()}`, sender: 'ياسر مخ', text: 'رسالة جديدة', time: 'الآن', incoming: false },
                    ],
                  })
                }
                className="!px-3 !py-1 text-xs"
              >
                + رسالة
              </Btn>
            </div>
            <div className="space-y-2">
              {c.messages.map((m, i) => (
                <MessageEditor
                  key={m.id}
                  msg={m}
                  index={i}
                  onChange={(msg: Message) =>
                    patch(c.id, { messages: c.messages.map((x) => (x.id === m.id ? msg : x)) })
                  }
                  onDelete={() => patch(c.id, { messages: c.messages.filter((x) => x.id !== m.id) })}
                />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MessageEditor({
  msg,
  index,
  onChange,
  onDelete,
}: {
  msg: Message;
  index: number;
  onChange: (m: Message) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-[11px]">رسالة {index + 1}</span>
        <button onClick={onDelete} className="text-white/40 hover:text-red-400 text-xs">حذف</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <input className={inputCls} value={msg.sender} onChange={(e) => onChange({ ...msg, sender: e.target.value })} placeholder="المُرسل" />
        <input className={inputCls} value={msg.time} onChange={(e) => onChange({ ...msg, time: e.target.value })} placeholder="الوقت" />
        <select className={inputCls} value={msg.incoming ? 'in' : 'out'} onChange={(e) => onChange({ ...msg, incoming: e.target.value === 'in' })}>
          <option value="in">واردة</option>
          <option value="out">صادرة</option>
        </select>
      </div>
      <textarea
        className={`${inputCls} min-h-[70px]`}
        value={msg.text}
        onChange={(e) => onChange({ ...msg, text: e.target.value })}
      />
    </div>
  );
}

export function PhoneSection({ draft, update }: { draft: PhoneContent; update: (fn: (d: PhoneContent) => PhoneContent) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-sm">سجل المكالمات ({draft.calls.length})</span>
        <Btn
          variant="primary"
          onClick={() =>
            update((d) => ({
              ...d,
              calls: [...d.calls, { id: `k-${uid()}`, name: 'مكالمة جديدة', type: 'incoming' as const, time: 'الآن' }],
            }))
          }
        >
          + مكالمة
        </Btn>
      </div>
      {draft.calls.map((c, i) => (
        <Card key={c.id}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Field label="الاسم">
              <input
                className={inputCls}
                value={c.name}
                onChange={(e) => update((d) => ({ ...d, calls: d.calls.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) }))}
              />
            </Field>
            <Field label="النوع">
              <select
                className={inputCls}
                value={c.type}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    calls: d.calls.map((x) => (x.id === c.id ? { ...x, type: e.target.value as CallEntry['type'] } : x)),
                  }))
                }
              >
                <option value="missed">فقوتة</option>
                <option value="incoming">واردة</option>
                <option value="outgoing">صادرة</option>
              </select>
            </Field>
            <Field label="الوقت">
              <input
                className={inputCls}
                value={c.time}
                onChange={(e) => update((d) => ({ ...d, calls: d.calls.map((x) => (x.id === c.id ? { ...x, time: e.target.value } : x)) }))}
              />
            </Field>
            <div className="flex items-end gap-2">
              <button
                onClick={() => update((d) => ({ ...d, calls: d.calls.filter((_, j) => j !== i) }))}
                className="text-white/50 hover:text-red-400 text-sm px-2 py-2"
              >
                حذف
              </button>
              {i > 0 && (
                <button
                  onClick={() =>
                    update((d) => {
                      const calls = [...d.calls];
                      [calls[i - 1], calls[i]] = [calls[i], calls[i - 1]];
                      return { ...d, calls };
                    })
                  }
                  className="text-white/50 hover:text-white text-sm px-2 py-2"
                >
                  ▲
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function NotesSection({ draft, update }: { draft: PhoneContent; update: (fn: (d: PhoneContent) => PhoneContent) => void }) {
  return (
    <div className="space-y-3">
      <Btn
        variant="primary"
        onClick={() =>
          update((d) => ({
            ...d,
            notes: [...d.notes, { id: `n-${uid()}`, title: 'ملاحظة جديدة', updatedAt: 'الآن', tasks: [] }],
          }))
        }
      >
        + ملاحظة
      </Btn>
      {draft.notes.map((n, ni) => (
        <Card key={n.id}>
          <div className="flex items-center gap-3 mb-3">
            <input
              className={inputCls}
              value={n.title}
              onChange={(e) => update((d) => ({ ...d, notes: d.notes.map((x) => (x.id === n.id ? { ...x, title: e.target.value } : x)) }))}
            />
            <Btn
              variant="danger"
              onClick={() => update((d) => ({ ...d, notes: d.notes.filter((_, i) => i !== ni) }))}
              className="shrink-0"
            >
              حذف
            </Btn>
          </div>
          {n.tasks.map((t, ti) => (
            <div key={t.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    notes: d.notes.map((x) =>
                      x.id === n.id ? { ...x, tasks: x.tasks.map((y) => (y.id === t.id ? { ...y, done: e.target.checked } : y)) } : x
                    ),
                  }))
                }
                className="accent-[#3D7BF7]"
              />
              <input
                className={inputCls}
                value={t.text}
                onChange={(e) =>
                  update((d) => ({
                    ...d,
                    notes: d.notes.map((x) =>
                      x.id === n.id ? { ...x, tasks: x.tasks.map((y) => (y.id === t.id ? { ...y, text: e.target.value } : y)) } : x
                    ),
                  }))
                }
              />
              <button
                onClick={() =>
                  update((d) => ({
                    ...d,
                    notes: d.notes.map((x) => (x.id === n.id ? { ...x, tasks: x.tasks.filter((_, j) => j !== ti) } : x)),
                  }))
                }
                className="text-white/40 hover:text-red-400 px-2"
              >
                ×
              </button>
            </div>
          ))}
          <Btn
            onClick={() =>
              update((d) => ({
                ...d,
                notes: d.notes.map((x) =>
                  x.id === n.id ? { ...x, tasks: [...x.tasks, { id: `t-${uid()}`, text: 'مهمة جديدة', done: false }] } : x
                ),
              }))
            }
            className="text-xs"
          >
            + مهمة
          </Btn>
        </Card>
      ))}
    </div>
  );
}

export type { Note };
