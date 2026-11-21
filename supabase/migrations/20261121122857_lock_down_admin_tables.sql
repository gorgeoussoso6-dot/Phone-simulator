/*
# Lock down admin credentials and phone_state writes

1. Security fix
- `admin_auth` previously had default Data API privileges (SELECT/INSERT/UPDATE/
  DELETE for anon + authenticated) even though RLS blocked row access. Defense
  in depth: revoke ALL privileges from anon and authenticated so the password
  hash is only ever reachable by the edge function's service role.
- `phone_state`: revoke INSERT/UPDATE/DELETE from anon + authenticated. The
  browser may only ever SELECT (the published column is exposed by design);
  all writes go through the server-side edge function.

2. Notes
- No policies added; privilege revocation happens at the grant level.
- service_role bypasses RLS and keeps full access for the admin API function.
*/

REVOKE ALL ON admin_auth FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON phone_state FROM anon, authenticated;