/*
# Create phone simulator state, admin credentials, and photo storage

1. New Tables
- `phone_state`: the single row holding the entire simulator content.
  - `id` (integer, primary key, must always be 1)
  - `draft` (jsonb) — the administrator's private working copy (never public)
  - `published` (jsonb) — the version public visitors see
  - `published_at` (timestamptz) — when the last publish happened
- `admin_auth`: the administrator password hash (sha256 hex).
  - `id` (integer, primary key, must always be 1)
  - `password_hash` (text) — sha256 hex digest, never the plain password

2. Security
- RLS ENABLED on both tables.
- `phone_state`: SELECT granted to anon + authenticated so any visitor can read
  the published version. NO insert/update/delete policies and no grants for
  those verbs — only the server (service role) can modify state.
- `admin_auth`: NO grants and NO policies at all — it is unreachable from the
  browser. Only the edge function using the service role key can read it.

3. Storage
- New public bucket `gallery-photos` for persistent uploaded photos.
- Public read policy on the bucket's objects; no browser write policies.

4. Seed Data
- Both `draft` and `published` are seeded with the full initial phone content:
  WhatsApp conversations (including the archived Kick✳️ chat), call history,
  the Samsung Notes checklist, camera phrase, Google search text, weather,
  and phone customization (5:55, 67% battery, Riyadh).

5. Notes
- Publishing copies `draft` into `published` in the edge function; publishing
  never deletes content.
*/

CREATE TABLE IF NOT EXISTS phone_state (
  id integer PRIMARY KEY CHECK (id = 1),
  draft jsonb NOT NULL,
  published jsonb NOT NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_auth (
  id integer PRIMARY KEY CHECK (id = 1),
  password_hash text NOT NULL
);

ALTER TABLE phone_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON phone_state TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read published phone state" ON phone_state;
CREATE POLICY "Public can read published phone state"
ON phone_state FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO admin_auth (id, password_hash) VALUES (1, '56c948ad640d78418e61e53cab7d357c372502346ebe36a59e9b60248eda213c')
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-photos', 'gallery-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view gallery photos" ON storage.objects;
CREATE POLICY "Public can view gallery photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery-photos');

INSERT INTO phone_state (id, draft, published) VALUES (1, $j${
  "phone": { "battery": 67, "time": "5:55", "location": "الرياض، السعودية", "wallpaper": "#0a1930" },
  "cameraPhrase": "من زين التصوير",
  "googleText": "10 تيشيرتات بـ100 ريال",
  "weather": { "temp": 28, "condition": "صافٍ", "high": 33, "low": 19, "humidity": 18, "wind": 12, "simulated": true },
  "whatsapp": {
    "conversations": [
      {
        "id": "c-hnodi", "name": "هنودي اوسوم", "type": "individual", "archived": false, "sort": 1, "time": "11:24", "unread": true,
        "members": ["هنودي اوسوم"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "اهلاً هنودي زمان عنك", "time": "11:10 ص", "incoming": false },
          { "id": "m2", "sender": "هنودي اوسوم", "text": "لا اهلاً  ولا سهلاً اللي يطلع من تي يو يطلع من قلبي", "time": "11:24 ص", "incoming": true }
        ]
      },
      {
        "id": "c-abid", "name": "ابو عابد الشمري🇰🇵", "type": "individual", "archived": false, "sort": 2, "time": "10:02", "unread": true,
        "members": ["ابو عابد الشمري🇰🇵"],
        "messages": [
          { "id": "m1", "sender": "ابو عابد الشمري🇰🇵", "text": "تعال القصر عندنا تصوير", "time": "10:02 ص", "incoming": true }
        ]
      },
      {
        "id": "c-albania", "name": "سفرة البانيا🇦🇱", "type": "group", "archived": false, "sort": 3, "time": "9:47", "unread": false,
        "members": ["ياسر مخ", "معاذ اج", "ثنيان خالد", "ابو داحم"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "شرايكم السفرة الجاية تكون تنزانيا", "time": "9:41 ص", "incoming": false },
          { "id": "m2", "sender": "معاذ اج", "text": "لا هناك دودو دالي و اخوياه بيجدولون علينا خلونا نروح سريلانكا", "time": "9:43 ص", "incoming": true },
          { "id": "m3", "sender": "ثنيان خالد", "text": "مين قال لكم اني بسافر معاكم مره ثانية؟", "time": "9:47 ص", "incoming": true }
        ]
      },
      {
        "id": "c-winter", "name": "كولكشن شتاء 2026", "type": "group", "archived": false, "sort": 4, "time": "أمس", "unread": false,
        "members": ["ياسر مخ", "ريان مدير المتجر"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "و ليه مسوي قروب؟", "time": "أمس 8:30 م", "incoming": false }
        ]
      },
      {
        "id": "c-mohammed", "name": "محمد اخوي", "type": "individual", "archived": false, "sort": 5, "time": "12 ديسمبر 2024", "unread": false,
        "members": ["محمد اخوي"],
        "messages": [
          { "id": "m1", "sender": "محمد اخوي", "text": "ياسر…\nأعتذر لك على اني أكلت البيتزا حقتك بدون اذن و أدري ان هذا الشيء ممكن يضايقك\nالسبب اني كنت مستعجل لأني كنت ناوي أصوم بكرة والوقت كان ضيق و تصرفت بدون ما افكر كفاية\nاوعدك اعوضك عنها و آسف مره ثانية.\nاخوك : محمد", "time": "11:32 ص", "incoming": true },
          { "id": "m2", "sender": "ياسر مخ", "text": "الاخ محمد\nوعليكم السلام ورحمة الله وبركاته\nاشكرك على إعتذارك و توضيحك وهذا يدل على حُسن خُلقك و تقديرك، الامر بسيط ولا يستدعي كل هذا القلق\nو اتمنى لك صيامًا مقبولاً بإذن الله و بالنسبة للبيتزا فلا يوجد اي إشكال و يمكن تعويضها في وقت لاحق.\nتقبل تحياتي\nياسر", "time": "11:58 ص", "incoming": false },
          { "id": "m3", "sender": "محمد اخوي", "text": "شاكر و مقدر تفهمك و تقديرك\nجزاك الله خيرًا", "time": "12:15 م", "incoming": true }
        ]
      },
      {
        "id": "c-kick", "name": "Kick✳️", "type": "individual", "archived": true, "sort": 6, "time": "14 أكتوبر", "unread": true,
        "members": ["Kick✳️"],
        "messages": [
          { "id": "m1", "sender": "Kick✳️", "text": "تبي ترجع للبثوث ولا نبندك؟", "time": "14 أكتوبر", "incoming": true }
        ]
      }
    ]
  },
  "calls": [
    { "id": "k1", "name": "العفوية", "type": "missed", "time": "اليوم 4:12 م" },
    { "id": "k2", "name": "ريان مدير المتجر", "type": "missed", "time": "اليوم 1:05 م" },
    { "id": "k3", "name": "مندوب البروتين بيتزا", "type": "incoming", "time": "اليوم 11:30 ص" },
    { "id": "k4", "name": "ريكو", "type": "missed", "time": "أمس 9:15 م" },
    { "id": "k5", "name": "الوالد", "type": "incoming", "time": "أمس 7:48 م" },
    { "id": "k6", "name": "محمد اخوي", "type": "incoming", "time": "الأحد 6:20 م" }
  ],
  "notes": [
    {
      "id": "n1", "title": "مهام بكرة العصر", "updatedAt": "اليوم",
      "tasks": [
        { "id": "t1", "text": "ارجع للبثوث", "done": false },
        { "id": "t2", "text": "ارجع لليوتيوب", "done": false },
        { "id": "t3", "text": "ارجع للتيك توك", "done": false },
        { "id": "t4", "text": "ارجع للسناب", "done": false },
        { "id": "t5", "text": "اعطي موفا روبوكساتها", "done": false },
        { "id": "t6", "text": "انهي مسابقة بلوفر مخ", "done": false },
        { "id": "t7", "text": "اشتري اطقم", "done": false }
      ]
    }
  ],
  "albums": [{ "id": "a-all", "name": "الكل" }],
  "photos": []
}$j$::jsonb, $j${
  "phone": { "battery": 67, "time": "5:55", "location": "الرياض، السعودية", "wallpaper": "#0a1930" },
  "cameraPhrase": "من زين التصوير",
  "googleText": "10 تيشيرتات بـ100 ريال",
  "weather": { "temp": 28, "condition": "صافٍ", "high": 33, "low": 19, "humidity": 18, "wind": 12, "simulated": true },
  "whatsapp": {
    "conversations": [
      {
        "id": "c-hnodi", "name": "هنودي اوسوم", "type": "individual", "archived": false, "sort": 1, "time": "11:24", "unread": true,
        "members": ["هنودي اوسوم"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "اهلاً هنودي زمان عنك", "time": "11:10 ص", "incoming": false },
          { "id": "m2", "sender": "هنودي اوسوم", "text": "لا اهلاً  ولا سهلاً اللي يطلع من تي يو يطلع من قلبي", "time": "11:24 ص", "incoming": true }
        ]
      },
      {
        "id": "c-abid", "name": "ابو عابد الشمري🇰🇵", "type": "individual", "archived": false, "sort": 2, "time": "10:02", "unread": true,
        "members": ["ابو عابد الشمري🇰🇵"],
        "messages": [
          { "id": "m1", "sender": "ابو عابد الشمري🇰🇵", "text": "تعال القصر عندنا تصوير", "time": "10:02 ص", "incoming": true }
        ]
      },
      {
        "id": "c-albania", "name": "سفرة البانيا🇦🇱", "type": "group", "archived": false, "sort": 3, "time": "9:47", "unread": false,
        "members": ["ياسر مخ", "معاذ اج", "ثنيان خالد", "ابو داحم"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "شرايكم السفرة الجاية تكون تنزانيا", "time": "9:41 ص", "incoming": false },
          { "id": "m2", "sender": "معاذ اج", "text": "لا هناك دودو دالي و اخوياه بيجدولون علينا خلونا نروح سريلانكا", "time": "9:43 ص", "incoming": true },
          { "id": "m3", "sender": "ثنيان خالد", "text": "مين قال لكم اني بسافر معاكم مره ثانية؟", "time": "9:47 ص", "incoming": true }
        ]
      },
      {
        "id": "c-winter", "name": "كولكشن شتاء 2026", "type": "group", "archived": false, "sort": 4, "time": "أمس", "unread": false,
        "members": ["ياسر مخ", "ريان مدير المتجر"],
        "messages": [
          { "id": "m1", "sender": "ياسر مخ", "text": "و ليه مسوي قروب؟", "time": "أمس 8:30 م", "incoming": false }
        ]
      },
      {
        "id": "c-mohammed", "name": "محمد اخوي", "type": "individual", "archived": false, "sort": 5, "time": "12 ديسمبر 2024", "unread": false,
        "members": ["محمد اخوي"],
        "messages": [
          { "id": "m1", "sender": "محمد اخوي", "text": "ياسر…\nأعتذر لك على اني أكلت البيتزا حقتك بدون اذن و أدري ان هذا الشيء ممكن يضايقك\nالسبب اني كنت مستعجل لأني كنت ناوي أصوم بكرة والوقت كان ضيق و تصرفت بدون ما افكر كفاية\nاوعدك اعوضك عنها و آسف مره ثانية.\nاخوك : محمد", "time": "11:32 ص", "incoming": true },
          { "id": "m2", "sender": "ياسر مخ", "text": "الاخ محمد\nوعليكم السلام ورحمة الله وبركاته\nاشكرك على إعتذارك و توضيحك وهذا يدل على حُسن خُلقك و تقديرك، الامر بسيط ولا يستدعي كل هذا القلق\nو اتمنى لك صيامًا مقبولاً بإذن الله و بالنسبة للبيتزا فلا يوجد اي إشكال و يمكن تعويضها في وقت لاحق.\nتقبل تحياتي\nياسر", "time": "11:58 ص", "incoming": false },
          { "id": "m3", "sender": "محمد اخوي", "text": "شاكر و مقدر تفهمك و تقديرك\nجزاك الله خيرًا", "time": "12:15 م", "incoming": true }
        ]
      },
      {
        "id": "c-kick", "name": "Kick✳️", "type": "individual", "archived": true, "sort": 6, "time": "14 أكتوبر", "unread": true,
        "members": ["Kick✳️"],
        "messages": [
          { "id": "m1", "sender": "Kick✳️", "text": "تبي ترجع للبثوث ولا نبندك؟", "time": "14 أكتوبر", "incoming": true }
        ]
      }
    ]
  },
  "calls": [
    { "id": "k1", "name": "العفوية", "type": "missed", "time": "اليوم 4:12 م" },
    { "id": "k2", "name": "ريان مدير المتجر", "type": "missed", "time": "اليوم 1:05 م" },
    { "id": "k3", "name": "مندوب البروتين بيتزا", "type": "incoming", "time": "اليوم 11:30 ص" },
    { "id": "k4", "name": "ريكو", "type": "missed", "time": "أمس 9:15 م" },
    { "id": "k5", "name": "الوالد", "type": "incoming", "time": "أمس 7:48 م" },
    { "id": "k6", "name": "محمد اخوي", "type": "incoming", "time": "الأحد 6:20 م" }
  ],
  "notes": [
    {
      "id": "n1", "title": "مهام بكرة العصر", "updatedAt": "اليوم",
      "tasks": [
        { "id": "t1", "text": "ارجع للبثوث", "done": false },
        { "id": "t2", "text": "ارجع لليوتيوب", "done": false },
        { "id": "t3", "text": "ارجع للتيك توك", "done": false },
        { "id": "t4", "text": "ارجع للسناب", "done": false },
        { "id": "t5", "text": "اعطي موفا روبوكساتها", "done": false },
        { "id": "t6", "text": "انهي مسابقة بلوفر مخ", "done": false },
        { "id": "t7", "text": "اشتري اطقم", "done": false }
      ]
    }
  ],
  "albums": [{ "id": "a-all", "name": "الكل" }],
  "photos": []
}$j$::jsonb)
ON CONFLICT (id) DO NOTHING;