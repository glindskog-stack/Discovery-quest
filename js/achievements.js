// Achievement definitions + the rules that unlock them. Pure/local — no
// cloud dependency. Achievements are one-time (see Storage.unlockAchievement);
// personal-best *records* (streaks, session XP) are separate and can be
// re-broken, tracked via Storage.updateRecords.

// label/desc are language-dependent — localizeAchievements() (boot + every
// language switch) fills them in from js/i18n.js's ACHIEVEMENT_I18N.
const ACHIEVEMENTS = {
  "first-correct": { icon: "🎯" },
  "streak-3": { icon: "🔥" },
  "streak-7": { icon: "🔥" },
  "streak-15": { icon: "⚡" },
  polymath: { icon: "🧠" },
  "domain-maxed": { icon: "🏆" },
  renaissance: { icon: "🌟" },
  "day-streak-7": { icon: "📅" },
  "day-streak-30": { icon: "📆" },
  "goal-crusher": { icon: "🚀" },
  "goal-crusher-10": { icon: "🔁" },
  "night-owl": { icon: "🦉" },
  "early-bird": { icon: "🐦" },
};

function localizeAchievements() {
  Object.keys(ACHIEVEMENTS).forEach((id) => {
    ACHIEVEMENTS[id].label = I18n.achievementLabel(id);
    ACHIEVEMENTS[id].desc = I18n.achievementDesc(id);
  });
}

const Achievements = {
  // Call after every recorded response. Returns newly-unlocked ids.
  evaluate(state, { sessionEntry, goodOutcome }) {
    const unlocked = [];
    const tryUnlock = (id) => {
      if (Storage.unlockAchievement(state, id)) unlocked.push(id);
    };

    if (goodOutcome) {
      if (state.correctStreak === 1) tryUnlock("first-correct");
      if (state.correctStreak >= 3) tryUnlock("streak-3");
      if (state.correctStreak >= 7) tryUnlock("streak-7");
      if (state.correctStreak >= 15) tryUnlock("streak-15");
    }

    if (sessionEntry.domainsTouched.length >= 4) tryUnlock("polymath");

    DOMAIN_ORDER.forEach((d) => {
      if (Storage.xpIntoLevel(state.xp[d]).level >= DOMAINS[d].levels.length) tryUnlock("domain-maxed");
    });
    if (DOMAIN_ORDER.every((d) => Storage.xpIntoLevel(state.xp[d]).level >= 3)) tryUnlock("renaissance");

    if (state.streak.current >= 7) tryUnlock("day-streak-7");
    if (state.streak.current >= 30) tryUnlock("day-streak-30");

    const hour = new Date().getHours();
    if (hour >= 23 || hour < 4) tryUnlock("night-owl");
    if (hour >= 4 && hour < 7) tryUnlock("early-bird");

    return unlocked;
  },

  // Call when Storage.markGoalCompletedToday returns true.
  evaluateGoalCompletion(state) {
    const unlocked = [];
    if (Storage.unlockAchievement(state, "goal-crusher")) unlocked.push("goal-crusher");
    if (state.goalsCompletedCount >= 10 && Storage.unlockAchievement(state, "goal-crusher-10")) unlocked.push("goal-crusher-10");
    return unlocked;
  },
};
