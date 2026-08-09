// Optional cloud sync over plain Supabase REST (PostgREST) — no SDK, same
// fetch()-with-apikey-header pattern the repo's poller/ worker already
// uses server-side, just with the public anon key instead of the secret
// one. Every method no-ops (returns false/null) when js/config.js hasn't
// been filled in, or when the network call fails — cloud sync is a bonus
// layer on top of a fully-functional local app, never a dependency of it.
//
// No accounts, no email: a profile's cloud identity is a random sync code
// (~50 bits of entropy) generated on first push. That code is also the
// only credential — anyone who has it can push stats under it, the same
// trust model as an "anyone with this link can edit" doc. Fine for
// aggregated XP numbers; see docs/CLOUD_SETUP.md before storing anything
// more sensitive than that. `anon` has zero direct privileges on either
// table (see sql/schema.sql) — every read AND write goes through a narrow
// SECURITY DEFINER function, so no client can ever enumerate other
// people's codes or stats. (Writes go through a function too, not just
// reads: an upsert-by-code needs SELECT under the hood to check for the
// existing row — Postgres always requires that for `ON CONFLICT DO
// UPDATE` — which is fundamentally incompatible with "anon can never
// read this table" as a direct grant, so it has to happen inside a
// definer function like the reads do.)

const Cloud = {
  config: null,

  init() {
    this.config = (window.DISCOVERY_QUEST_CLOUD && window.DISCOVERY_QUEST_CLOUD.url && window.DISCOVERY_QUEST_CLOUD.anonKey)
      ? window.DISCOVERY_QUEST_CLOUD
      : null;
  },

  isConfigured() {
    return !!this.config;
  },

  headers() {
    return { apikey: this.config.anonKey, Authorization: `Bearer ${this.config.anonKey}`, "Content-Type": "application/json" };
  },

  genSyncCode() {
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I — less to mistype
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    let code = "";
    bytes.forEach((b, i) => {
      code += alphabet[b % alphabet.length];
      if (i % 4 === 3 && i !== bytes.length - 1) code += "-";
    });
    return code;
  },

  ensureSyncCode(profile) {
    if (profile.syncCode) return profile.syncCode;
    const code = this.genSyncCode();
    Storage.setProfileCloudInfo(profile.id, { syncCode: code });
    profile.syncCode = code;
    return code;
  },

  // Pushes only aggregated, non-identifying stats — no free-text answers,
  // no name (the profile's display name never leaves the device).
  async pushStats(profile, state) {
    if (!this.isConfigured()) return false;
    const code = this.ensureSyncCode(profile);
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_push_stats`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          p_code: code,
          p_xp: state.xp,
          p_streak_current: state.streak.current,
          p_streak_longest: state.streak.longest,
          p_total_time_ms: state.totalTimeMs,
        }),
      });
      if (res.ok) state.cloudSyncedAt = Date.now();
      return res.ok;
    } catch {
      return false; // offline or unreachable — quietly stay local-only
    }
  },

  // Pulls aggregated stats down for a code typed in on a different device.
  // Caller decides how to merge (Dashboard.handleRestore takes the max per
  // domain so a restore can never lose progress made on this device).
  async restoreFromCode(code) {
    if (!this.isConfigured() || !code) return null;
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_restore`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ p_code: code.trim().toUpperCase() }),
      });
      if (!res.ok) return null;
      const rows = await res.json();
      return rows && rows[0] ? rows[0] : null;
    } catch {
      return null;
    }
  },

  // Anonymous percentile rank for one domain — never exposes any other
  // profile's raw row, just "you beat N% of pushed profiles."
  async getPercentile(domain, xp) {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_percentile`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ p_domain: domain, p_xp: xp }),
      });
      if (!res.ok) return null;
      const value = await res.json();
      return typeof value === "number" ? value : null;
    } catch {
      return null;
    }
  },

  async queueSubjectRequest(profile, entry) {
    if (!this.isConfigured()) return false;
    const code = this.ensureSyncCode(profile);
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_queue_subject_request`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ p_code: code, p_domain: entry.domain, p_text: entry.text }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Full-fidelity answer log, including free-response text — a step up in
  // sensitivity from the aggregate-only stats above, on purpose: this is
  // what lets a parent (or the player on another device) pull up "what did
  // I answer/write" for a profile from anywhere, given its code. Same
  // trust model as everything else here: the code is the only credential.
  async logAnswer(profile, entry) {
    if (!this.isConfigured()) return false;
    const code = this.ensureSyncCode(profile);
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_log_answer`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          p_code: code,
          p_node_id: entry.nodeId,
          p_domain: entry.domain,
          p_style: entry.style,
          p_question: entry.question,
          p_answer: entry.answer,
          p_correct: entry.correct,
          p_completed: entry.completed,
          p_enjoyment: entry.enjoyment,
          p_xp_gained: entry.xpGained,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Pulls a profile's full answer log by code, most recent first — for
  // viewing from a different device (or after clearing local storage).
  async getAnswerLog(code, limit = 200) {
    if (!this.isConfigured() || !code) return null;
    try {
      const res = await fetch(`${this.config.url}/rest/v1/rpc/quest_get_answer_log`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ p_code: code.trim().toUpperCase(), p_limit: limit }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

Cloud.init();
