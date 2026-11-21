import { readFileSync } from 'node:fs';

function loadEnv() {
  try {
    const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // env may already be set in the shell
  }
}
loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('missing env'); process.exit(1); }

const anon = async (path, body) => {
  const res = await fetch(`${url}/functions/v1/admin-api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const results = [];
const check = (name, cond) => results.push(`${cond ? 'PASS' : 'FAIL'} ${name}`);

const stateRes = await fetch(`${url}/rest/v1/phone_state?id=eq.1&select=published`, { headers: { apikey: key } });
const stateData = await stateRes.json();
check('public read published state', stateRes.ok && stateData[0]?.published?.cameraPhrase === 'من زين التصوير');
check('published has 6 conversations', stateData[0]?.published?.whatsapp?.conversations?.length === 6);

const authRes = await fetch(`${url}/rest/v1/admin_auth?id=eq.1`, { headers: { apikey: key } });
const authText = await authRes.text();
check('admin_auth blocked from public', authRes.status === 401 || authText.trim() === '[]' || authRes.status === 404);

const writeRes = await fetch(`${url}/rest/v1/phone_state?id=eq.1`, {
  method: 'PATCH',
  headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  body: JSON.stringify({ published: { hacked: true } }),
});
check('public write blocked', writeRes.status === 401 || writeRes.status === 403 || writeRes.status === 404);

const bad = await anon('login', { password: 'wrong' });
check('wrong password rejected', bad.status === 401);

const good = await anon('login', { password: 'yasser555' });
check('correct password accepted', good.status === 200 && good.body.ok === true);

const noauth = await anon('state', {});
check('state requires password', noauth.status === 401);

const s = await anon('state', { password: 'yasser555' });
check('state works with password', s.status === 200 && !!s.body.draft && !!s.body.published);

const draft = s.body.draft;
const sd = await anon('savedraft', { password: 'yasser555', draft });
check('savedraft ok', sd.status === 200);
const pub = await anon('publish', { password: 'yasser555' });
check('publish ok', pub.status === 200);
const s2 = await anon('state', { password: 'yasser555' });
check('published matches draft after publish', JSON.stringify(s2.body.published) === JSON.stringify(s2.body.draft));
check('publish preserved conversations', s2.body.published?.whatsapp?.conversations?.length === 6);
check('publish preserved calls', s2.body.published?.calls?.length === 6);
check('publish preserved 7 tasks unchecked', s2.body.published?.notes?.[0]?.tasks?.length === 7 && s2.body.published.notes[0].tasks.every(t => !t.done));

console.log(results.join('\n'));
const fails = results.filter((r) => r.startsWith('FAIL')).length;
process.exit(fails ? 1 : 0);
