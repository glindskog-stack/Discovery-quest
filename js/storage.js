// Profile + persistence layer. No cap on profile count, fully separate
// state — nothing is ever read across profile boundaries. localStorage is
// plenty for this data size; swap for IndexedDB later if the content bank
// or session history grows large enough to matter.

const STORAGE_PREFIX = "dq:";
const PROFILES_KEY = STORAGE_PREFIX + "profiles";
const ACTIVE_KEY = STORAGE_PREFIX + "active";
const REMINDER_KEY = STORAGE_PREFIX + "reminder"; // device-level, like language — a push subscription belongs to the browser install, not a profile

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

  // `onboarding` (all optional): { age, difficulty: 1|2|3, interests: [domainId],
  // goalType: "count"|"time", goalValue: number }. Age/difficulty/interests are
  // recorded on the profile for reference; their *effects* (starting tier,
  // domain affinity, daily goal) get baked into the state once, at creation —
  // the adaptive engine takes over from there.
  createProfile(name, emoji, onboarding = {}) {
    const profiles = this.listProfiles();
    const profile = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 24),
      emoji,
      age: onboarding.age || null,
      difficulty: onboarding.difficulty || 2,
      interests: onboarding.interests || [],
      createdAt: Date.now(),
    };
    profiles.push(profile);
    writeJSON(PROFILES_KEY, profiles);

    const state = this.defaultState();
    const tier = onboarding.difficulty || 2;
    Object.keys(state.tier).forEach((d) => (state.tier[d] = tier));
    (onboarding.interests || []).forEach((d) => {
      if (state.affinity.domain[d] !== undefined) state.affinity.domain[d] += 1.5;
    });
    // Stated interests are a hard filter from day one, not just a soft nudge —
    // otherwise a player who only picked "Math" still sees Coding in the mix.
    // They can always widen it again from Focus > Subjects.
    if (onboarding.interests && onboarding.interests.length) {
      state.focus.domains = onboarding.interests.filter((d) => DOMAIN_ORDER.includes(d));
    }
    if (onboarding.goalType && onboarding.goalValue) {
      state.sessionGoal = { type: onboarding.goalType, value: onboarding.goalValue };
    }
    writeJSON(stateKey(profile.id), state);
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

  getReminderPrefs() {
    return readJSON(REMINDER_KEY, { enabled: false, hour: 18, minute: 0 });
  },

  setReminderPrefs(prefs) {
    writeJSON(REMINDER_KEY, prefs);
  },

  defaultState() {
    return {
      xp: { math: 0, writing: 0, coding: 0, trivia: 0 },
      tier: { math: 1, writing: 1, coding: 1, trivia: 1 },
      affinity: {
        domain: { math: 1, writing: 1, coding: 1, trivia: 1 },
      },
      streak: { current: 0, longest: 0, lastActiveDate: null },
      totalTimeMs: 0,
      sessionHistory: [], // [{date, startedAt, durationMs, domainsTouched, promptsAnswered}]
      answerLog: [], // [{nodeId, domain, style, question, answer, correct, completed, enjoyment, xpGained, at}] — full history, capped; see appendAnswerLog
      answeredIds: [], // recent, capped — avoids immediate repeats
      lastDomain: null,
      lastNodeId: null, // for resuming a writing branch mid-thread
      focus: {
        breadth: "broad", // "broad" | "narrow" — read by Engine.pickNextNode
        topics: { math: [], writing: [], coding: [], trivia: [] }, // selected topic tags per domain; empty = no filter
        regions: [], // selected trivia regions; empty = no filter
        domains: [...DOMAIN_ORDER], // enabled domains — hard filter, always >= 1
        styleMix: 25, // 0-100, % chance of a creative/writing prompt vs rigorous multiple-choice
      },
      rocketCourse: { stageIndex: 0, nodeIndex: 0, stagesCompleted: [] }, // fixed 3-stage curriculum (js/rocket.js), not the adaptive engine
      requestedSubjects: [], // [{id, domain, text, createdAt}] — "write a subject to add" queue, synced to cloud when configured
      cloudSyncedAt: null,
      sessionGoal: { type: "count", value: 10 }, // "count" prompts or "time" minutes — editable anytime from the goal pill
      goalsCompletedCount: 0,
      lastGoalCompletedDate: null,
      correctStreak: 0, // current consecutive-correct run, resets on a miss/bail
      achievements: [], // [{id, unlockedAt}] — one-time unlocks, see js/achievements.js
      records: { bestCorrectStreak: 0, bestSessionXP: 0, bestSessionPrompts: 0 },
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
    // One-time backfill for profiles saved before per-domain toggles existed:
    // if they picked interests at onboarding, honor those as the domain
    // filter instead of defaulting to "everything." Once focus.domains gets
    // saved once (any saveState call), this never runs again for them.
    const hasDomainsField = !!(state.focus && Array.isArray(state.focus.domains));
    let domainsDefault = fallback.focus.domains;
    if (!hasDomainsField) {
      const profile = this.listProfiles().find((p) => p.id === profileId);
      if (profile && profile.interests && profile.interests.length) domainsDefault = profile.interests;
    }
    // Merge in any new default keys added since this profile was created.
    return {
      ...fallback,
      ...state,
      xp: { ...fallback.xp, ...state.xp },
      tier: { ...fallback.tier, ...state.tier },
      affinity: {
        domain: { ...fallback.affinity.domain, ...(state.affinity && state.affinity.domain) },
      },
      focus: {
        breadth: (state.focus && state.focus.breadth) || fallback.focus.breadth,
        topics: { ...fallback.focus.topics, ...(state.focus && state.focus.topics) },
        regions: (state.focus && state.focus.regions) || fallback.focus.regions,
        domains: hasDomainsField ? state.focus.domains : domainsDefault,
        styleMix: (state.focus && typeof state.focus.styleMix === "number") ? state.focus.styleMix : fallback.focus.styleMix,
      },
      rocketCourse: { ...fallback.rocketCourse, ...state.rocketCourse },
      sessionGoal: { ...fallback.sessionGoal, ...state.sessionGoal },
      records: { ...fallback.records, ...state.records },
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

  // Full answer history — question, what was answered/written, right or
  // not, when. Capped locally so localStorage can't grow unbounded; the
  // cloud copy (Cloud.logAnswer, pushed alongside this) has no such cap.
  appendAnswerLog(state, entry) {
    state.answerLog.push({ at: Date.now(), ...entry });
    if (state.answerLog.length > 1000) state.answerLog.shift();
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

  hasAchievement(state, id) {
    return state.achievements.some((a) => a.id === id);
  },

  unlockAchievement(state, id) {
    if (this.hasAchievement(state, id)) return false;
    state.achievements.push({ id, unlockedAt: Date.now() });
    return true;
  },

  // Updates personal bests in place; returns the list of record keys that
  // were just broken, so the UI can show a "new record" moment.
  updateRecords(state, { correctStreak, sessionXP, sessionPrompts }) {
    const broken = [];
    if (correctStreak !== undefined && correctStreak > state.records.bestCorrectStreak) {
      state.records.bestCorrectStreak = correctStreak;
      broken.push("bestCorrectStreak");
    }
    if (sessionXP !== undefined && sessionXP > state.records.bestSessionXP) {
      state.records.bestSessionXP = sessionXP;
      broken.push("bestSessionXP");
    }
    if (sessionPrompts !== undefined && sessionPrompts > state.records.bestSessionPrompts) {
      state.records.bestSessionPrompts = sessionPrompts;
      broken.push("bestSessionPrompts");
    }
    return broken;
  },

  // { current, target, type, met } — "count" compares prompts answered this
  // session against the goal; "time" compares elapsed minutes.
  sessionGoalProgress(state, sessionEntry) {
    const goal = state.sessionGoal;
    if (goal.type === "time") {
      const minutes = (Date.now() - sessionEntry.startedAt) / 60000;
      return { current: minutes, target: goal.value, type: "time", met: minutes >= goal.value };
    }
    return { current: sessionEntry.promptsAnswered, target: goal.value, type: "count", met: sessionEntry.promptsAnswered >= goal.value };
  },

  // Returns true only the first time the goal is completed on a given day —
  // callers use that to fire the celebration once, not on every prompt after.
  markGoalCompletedToday(state) {
    const today = todayStr();
    if (state.lastGoalCompletedDate === today) return false;
    state.lastGoalCompletedDate = today;
    state.goalsCompletedCount += 1;
    return true;
  },
};
