// Profile + persistence layer. Two profiles max, fully separate state —
// nothing is ever read across profile boundaries. localStorage is plenty
// for this data size; swap for IndexedDB later if the content bank or
// session history grows large enough to matter.

const STORAGE_PREFIX = "dq:";
const PROFILES_KEY = STORAGE_PREFIX + "profiles";
const ACTIVE_KEY = STORAGE_PREFIX + "active";
const MAX_PROFILES = 2;

function stateKey(profileId) {
  return `${STORAGE_PREFIX}state:${profileId}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const Storage = {
  listProfiles() {
    return readJSON(PROFILES_KEY, []);
  },

  canCreateProfile() {
    return this.listProfiles().length < MAX_PROFILES;
  },

  createProfile(name, emoji) {
    const profiles = this.listProfiles();
    if (profiles.length >= MAX_PROFILES) throw new Error("Profile slots full");
    const profile = { id: crypto.randomUUID(), name: name.trim().slice(0, 24), emoji, createdAt: Date.now() };
    profiles.push(profile);
    writeJSON(PROFILES_KEY, profiles);
    writeJSON(stateKey(profile.id), this.defaultState());
    return profile;
  },

  renameProfile(id, name) {
    const profiles = this.listProfiles();
    const p = profiles.find((p) => p.id === id);
    if (p) {
      p.name = name.trim().slice(0, 24);
      writeJSON(PROFILES_KEY, profiles);
    }
  },

  getActiveProfileId() {
    return localStorage.getItem(ACTIVE_KEY);
  },

  setActiveProfileId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  },

  defaultState() {
    return {
      xp: { math: 0, writing: 0, coding: 0, trivia: 0 },
      tier: { math: 1, writing: 1, coding: 1, trivia: 1 },
      affinity: {
        domain: { math: 1, writing: 1, coding: 1, trivia: 1 },
        style: { rigorous: 1, creative: 1 },
      },
      streak: { current: 0, longest: 0, lastActiveDate: null },
      totalTimeMs: 0,
      sessionHistory: [], // [{date, startedAt, durationMs, domainsTouched, promptsAnswered}]
      answeredIds: [], // recent, capped — avoids immediate repeats
      lastDomain: null,
      lastNodeId: null, // for resuming a writing branch mid-thread
      focus: {
        breadth: "broad", // "broad" | "narrow" — read by Engine.pickNextNode
        topics: { math: [], writing: [], coding: [], trivia: [] }, // selected topic tags per domain; empty = no filter
        regions: [], // selected trivia regions; empty = no filter
      },
      requestedSubjects: [], // [{id, domain, text, createdAt}] — "write a subject to add" queue, synced to cloud when configured
      cloudSyncedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  getState(profileId) {
    const state = readJSON(stateKey(profileId), null);
    const fallback = this.defaultState();
    if (!state) {
      writeJSON(stateKey(profileId), fallback);
      return fallback;
    }
    // Merge in any new default keys added since this profile was created.
    return {
      ...fallback,
      ...state,
      xp: { ...fallback.xp, ...state.xp },
      tier: { ...fallback.tier, ...state.tier },
      affinity: {
        domain: { ...fallback.affinity.domain, ...(state.affinity && state.affinity.domain) },
        style: { ...fallback.affinity.style, ...(state.affinity && state.affinity.style) },
      },
      focus: {
        breadth: (state.focus && state.focus.breadth) || fallback.focus.breadth,
        topics: { ...fallback.focus.topics, ...(state.focus && state.focus.topics) },
        regions: (state.focus && state.focus.regions) || fallback.focus.regions,
      },
    };
  },

  saveState(profileId, state) {
    state.updatedAt = Date.now();
    writeJSON(stateKey(profileId), state);
  },

  recordAnswered(state, id) {
    state.answeredIds.push(id);
    if (state.answeredIds.length > 60) state.answeredIds.shift();
  },

  addSubjectRequest(state, domain, text) {
    const trimmed = text.trim().slice(0, 80);
    if (!trimmed) return null;
    const entry = { id: crypto.randomUUID(), domain, text: trimmed, createdAt: Date.now() };
    state.requestedSubjects.push(entry);
    if (state.requestedSubjects.length > 40) state.requestedSubjects.shift();
    return entry;
  },

  // Cloud identity lives on the profile record (it's who they are, not
  // gameplay state) — syncCode is the human-typeable code used to link a
  // second device; cloudUserId is the Supabase anonymous-auth id once
  // linked. Both stay null until js/cloud.js is configured and used.
  setProfileCloudInfo(profileId, { syncCode, cloudUserId } = {}) {
    const profiles = this.listProfiles();
    const p = profiles.find((p) => p.id === profileId);
    if (!p) return;
    if (syncCode !== undefined) p.syncCode = syncCode;
    if (cloudUserId !== undefined) p.cloudUserId = cloudUserId;
    writeJSON(PROFILES_KEY, profiles);
  },

  bumpStreak(state) {
    const today = todayStr();
    if (state.streak.lastActiveDate === today) return; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak.current = state.streak.lastActiveDate === yesterday ? state.streak.current + 1 : 1;
    state.streak.longest = Math.max(state.streak.longest, state.streak.current);
    state.streak.lastActiveDate = today;
  },

  startSessionEntry(state) {
    const entry = { date: todayStr(), startedAt: Date.now(), durationMs: 0, domainsTouched: [], promptsAnswered: 0 };
    state.sessionHistory.push(entry);
    if (state.sessionHistory.length > 100) state.sessionHistory.shift();
    return entry;
  },

  levelForXP(xp) {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    }
    return level;
  },

  xpIntoLevel(xp) {
    const level = this.levelForXP(xp);
    const floor = LEVEL_THRESHOLDS[level - 1];
    const ceilRaw = LEVEL_THRESHOLDS[level];
    const ceil = ceilRaw === undefined ? floor + 1000 : ceilRaw;
    return { level, floor, ceil, progress: (xp - floor) / (ceil - floor) };
  },
};
