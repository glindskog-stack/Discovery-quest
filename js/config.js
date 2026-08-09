// Cloud sync is entirely optional — the app is fully playable local-only
// without this file doing anything. Fill in a free Supabase project's
// details to turn on cross-device memory + the anonymous leaderboard; see
// docs/CLOUD_SETUP.md for the exact steps (create project, run sql/schema.sql,
// paste the two values below).
//
// anonKey is the *publishable* key, safe to ship in client code — it's the
// same model every Supabase browser app uses. Never put the secret/
// service_role key here.
window.DISCOVERY_QUEST_CLOUD = {
  url: "https://trtpuwluedasftpaclmq.supabase.co",
  anonKey: "sb_publishable_3eCZx2OW-vuLffCuROwyDg_yGe2Pf6D",
};

// Daily reminder push notifications — also optional, also a no-op until
// sql/push_reminders.sql is applied and a scheduled sender is deployed.
// See docs/PUSH_REMINDERS_SETUP.md. This public key is safe to ship (it's
// the whole point of VAPID — only the matching private key, which never
// leaves the server, can actually sign a push).
window.DISCOVERY_QUEST_PUSH = {
  vapidPublicKey: "BInbJEw1hLO8lG0KxeUr0MG6OS7GzVot6A7iOKNM7C9aDZQV_j1_LRNq0yc5n6d7w4Yt2XkXvm9prb79d2PNDvo",
};
