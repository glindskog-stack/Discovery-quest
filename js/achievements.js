// Achievement definitions + the rules that unlock them. Pure/local — no
// cloud dependency. Achievements are one-time (see Storage.unlockAchievement);
// personal-best *records* (streaks, session XP) are separate and can be
// re-broken, tracked via Storage.updateRecords.

const ACHIEVEMENTS = {
  "first-correct": { label: "First Blood", desc: "Land your first correct/engaged answer.", icon: "🎯" },
  "streak-3": { label: "3 in a Row", desc: "Chain 3 in a row.", icon: "🔥" },
  "streak-7": { label: "Hot Streak", desc: "Chain 7 in a row.", icon: "🔥" },
  "streak-15": { label: "Unstoppable", desc: "Chain 15 in a row.", icon: "⚡" },
  polymath: { label: "Polymath", desc: "Touch all 4 domains in one session.", icon: "🧠" },
  "domain-maxed": { label: "Maxed Out", desc: "Hit the top level in any domain.", icon: "🏆" },
  renaissance: { label: "Renaissance Mind", desc: "Reach level 3+ in every domain.", icon: "🌟" },
  "day-streak-7": { label: "Week One", desc: "7-day streak.", icon: "📅" },
  "day-streak-30": { label: "Dedicated", desc: "30-day streak.", icon: "📆" },
  "goal-crusher": { label: "Goal Crusher", desc: "Hit your daily goal.", icon: "🚀" },
  "goal-crusher-10": { label: "Creature of Habit", desc: "Hit your daily goal 10 times.", icon: "🔁" },
  "night-owl": { label: "Night Owl", desc: "Answer something after 11pm.", icon: "🦉" },
  "early-bird": { label: "Early Bird", desc: "Answer something before 7am.", icon: "🐦" },
};

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
