import { useEffect, useState } from 'react';
import { PhoneContent, Conversation, Message } from '../../lib/types';
import { usePhoneBack } from './usePhoneBack';

function InitialAvatar({ name, group }: { name: string; group?: boolean }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
      style={{ background: group ? 'linear-gradient(135deg,#25D366,#128C7E)' : '#4A5B6A' }}
    >
      {group ? (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#fff">
          <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 13c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4Zm8 0c-.7 0-1.6.1-2.5.3 1.5 1 2.5 2.3 2.5 3.7v2h8v-2c0-2.7-5.3-4-8-4Z" />
        </svg>
      ) : (
        name.trim().charAt(0) || '؟'
      )}
    </div>
  );
}

function ChatScreen({
  convo,
  onBack,
  onOpenInfo,
}: {
  convo: Conversation;
  onBack: () => void;
  onOpenInfo: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [extra, setExtra] = useState<Message[]>([]);
  const all = [...convo.messages, ...extra];

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const t = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() < 12 ? 'ص' : 'م'}`;
    setExtra((x) => [...x, { id: `local-${Date.now()}`, sender: 'ياسر مخ', text: draft, time: t, incoming: false }]);
    setDraft('');
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1f2c34] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button onClick={onOpenInfo} className="flex items-center gap-3 flex-1 text-right min-w-0">
          <InitialAvatar name={convo.name} group={convo.type === 'group'} />
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">{convo.name}</div>
            <div className="text-white/50 text-[11px]">
              {convo.type === 'group' ? convo.members.join('، ') : 'متصل الآن'}
            </div>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-2">
        {convo.type === 'group' && (
          <div className="text-center text-[11px] text-white/40 bg-white/5 rounded-full px-3 py-1 mx-auto w-fit">
            {convo.members.map((m) => m).join('، ')}
          </div>
        )}
        {all.map((m) => (
          <div key={m.id} className={`flex ${m.incoming ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                m.incoming ? 'bg-[#1f2c34] text-white rounded-tr-sm' : 'bg-[#005c4b] text-white rounded-tl-sm'
              }`}
            >
              {convo.type === 'group' && m.incoming && (
                <div className="text-[11px] font-bold text-[#25D366] mb-0.5">{m.sender}</div>
              )}
              <div className="text-[13.5px] leading-relaxed msg-text">{m.text}</div>
              <div className="text-[10px] text-white/50 mt-1 text-left" dir="ltr">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-[#1f2c34] shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="اكتب رسالة"
          className="flex-1 bg-[#2a3942] text-white text-sm rounded-full px-4 py-2.5 outline-none placeholder:text-white/40"
        />
        <button onClick={send} className="w-10 h-10 rounded-full bg-[#005c4b] flex items-center justify-center" aria-label="إرسال">
          <svg viewBox="0 0 24 24" className="w-5 h-5 -scale-x-100" fill="#fff"><path d="M2 21 23 12 2 3l4 9-4 9Z" /></svg>
        </button>
      </div>
    </div>
  );
}

function InfoScreen({ convo, onBack }: { convo: Conversation; onBack: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1f2c34] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-white text-sm font-semibold">معلومات {convo.type === 'group' ? 'المجموعة' : 'جهة الاتصال'}</span>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar p-6 flex flex-col items-center">
        <InitialAvatar name={convo.name} group={convo.type === 'group'} />
        <div className="text-white text-lg font-bold mt-3">{convo.name}</div>
        {convo.type === 'group' && (
          <>
            <div className="text-white/50 text-xs mt-1">{convo.members.length} أعضاء</div>
            <div className="w-full mt-6 space-y-1">
              {convo.members.map((m) => (
                <div key={m} className="flex items-center gap-3 bg-[#1f2c34] rounded-2xl px-4 py-3">
                  <InitialAvatar name={m} />
                  <span className="text-white text-sm">{m}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {convo.type === 'individual' && (
          <div className="w-full mt-6 bg-[#1f2c34] rounded-2xl px-4 py-3 text-white/70 text-sm">
            الاسم: {convo.name}
          </div>
        )}
      </div>
    </div>
  );
}

function ArchivedScreen({
  conversations,
  onOpen,
  onBack,
}: {
  conversations: Conversation[];
  onOpen: (c: Conversation) => void;
  onBack: () => void;
}) {
  const archived = conversations.filter((c) => c.archived);
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] anim-chat" dir="rtl">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1f2c34] shrink-0">
        <button onClick={onBack} className="text-white/90 p-1" aria-label="رجوع">
          <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="text-white text-sm font-semibold">المحادثات المؤرشفة</span>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        {archived.length === 0 && <div className="text-white/40 text-center text-sm mt-10">لا توجد محادثات مؤرشفة</div>}
        {archived.map((c) => (
          <button key={c.id} onClick={() => onOpen(c)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-right">
            <InitialAvatar name={c.name} group={c.type === 'group'} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{c.name}</div>
              <div className="text-white/50 text-xs truncate">{c.messages[c.messages.length - 1]?.text || ''}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function WhatsAppApp({ content }: { content: PhoneContent }) {
  const conversations = content.whatsapp.conversations;
  const [openId, setOpenId] = useState<string | null>(null);
  const [info, setInfo] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const popped = usePhoneBack(true);

  useEffect(() => {
    if (popped) {
      if (info) setInfo(false);
      else if (openId) setOpenId(null);
      else if (showArchived) setShowArchived(false);
    }
  }, [popped]); // eslint-disable-line react-hooks/exhaustive-deps

  const active = conversations.find((c) => c.id === openId) || null;

  if (active && info) return <InfoScreen convo={active} onBack={() => setInfo(false)} />;
  if (active) return <ChatScreen convo={active} onBack={() => setOpenId(null)} onOpenInfo={() => setInfo(true)} />;
  if (showArchived)
    return (
      <ArchivedScreen
        conversations={conversations}
        onOpen={(c) => setOpenId(c.id)}
        onBack={() => setShowArchived(false)}
      />
    );

  const visible = conversations.filter((c) => !c.archived).sort((a, b) => a.sort - b.sort);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] anim-fade" dir="rtl">
      <div className="px-4 pt-3 pb-2 bg-[#1f2c34] shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">WhatsApp</h1>
          <div className="flex items-center gap-4 text-white/80">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <button
          onClick={() => setShowArchived(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-white/5 text-right hover:bg-white/5"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h18l-1.5 11a2 2 0 0 1-2 1.8h-11a2 2 0 0 1-2-1.8L3 8Zm3-4h12l2 4H4l2-4Z" /></svg>
          <span className="text-white/80 text-sm flex-1">المحادثات المؤرشفة</span>
          <span className="text-white/40 text-xs">{conversations.filter((c) => c.archived).length}</span>
        </button>
        {visible.map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-right">
              <InitialAvatar name={c.name} group={c.type === 'group'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white text-[15px] font-semibold truncate">{c.name}</span>
                  <span className="text-white/40 text-[11px] shrink-0">{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-white/50 text-[13px] truncate">{last ? last.text.replace(/\n/g, ' ') : ''}</span>
                  {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shrink-0 anim-dot" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        className="absolute bottom-20 left-4 w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-xl"
        aria-label="محادثة جديدة"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#fff"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>
      </button>
    </div>
  );
}
