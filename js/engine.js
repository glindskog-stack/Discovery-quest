// Adaptive branching engine. No backend, no ML — just a weighted-random
// walk over domain/style affinity that shifts after every single response.
//
// Two ways a "next prompt" gets picked:
//   1. Explicit branch: a writing node has `next[choiceIndex]` — the story
//      keeps going down the path the player chose. Only used while inside
//      a branch chain.
//   2. General pick: everything else. Weighted by how much the player has
//      been enjoying/nailing each domain and style lately.

const MIN_WEIGHT = 0.15;
const MAX_WEIGHT = 6;

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function weightedPick(weightMap, downweightKey) {
  const entries = Object.entries(weightMap).map(([k, w]) => [k, k === downweightKey ? w * 0.45 : w]);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[entries.length - 1][0];
}

const Engine = {
  // Score a just-answered node and mutate `state` in place (xp, tier,
  // affinity, streak/session bookkeeping). Returns a small result summary
  // the UI uses for feedback (xpGained, correct, leveledUp).
  recordResponse(state, node, response) {
    const domain = node.domain;
    const beforeLevel = Storage.levelForXP(state.xp[domain]);
    let xpGained = 0;
    let correct = null; // true/false for rigorous, null for creative (no such thing)
    let goodOutcome = false; // correct rigorous answer, or a completed+enjoyed creative one — drives correctStreak/achievements

    if (node.style === "rigorous") {
      correct = response.choiceIndex === node.answer;
      goodOutcome = correct;
      const tier = state.tier[domain];
      if (correct) {
        xpGained = 10 + tier * 5;
        state.tier[domain] = clamp(tier + 1, 1, 3);
        state.affinity.domain[domain] = clamp(state.affinity.domain[domain] + 0.35, MIN_WEIGHT, MAX_WEIGHT);
        state.affinity.style.rigorous = clamp(state.affinity.style.rigorous + 0.2, MIN_WEIGHT, MAX_WEIGHT);
      } else {
        xpGained = 2;
        state.tier[domain] = clamp(tier - 1, 1, 3);
        state.affinity.domain[domain] = clamp(state.affinity.domain[domain] - 0.1, MIN_WEIGHT, MAX_WEIGHT);
        state.affinity.style.creative = clamp(state.affinity.style.creative + 0.15, MIN_WEIGHT, MAX_WEIGHT);
      }
    } else {
      // Creative/open: judged by completion + a self-rated "how'd that feel"
      // tap, never by being "right."
      const tier = state.tier[domain];
      if (response.completed) {
        xpGained = 10 + tier * 5;
        const enjoyment = response.enjoyment ?? 3; // 1-4 scale
        goodOutcome = enjoyment >= 3;
        if (enjoyment >= 3) {
          state.tier[domain] = clamp(tier + 1, 1, 3);
          state.affinity.domain[domain] = clamp(state.affinity.domain[domain] + 0.25 + enjoyment * 0.08, MIN_WEIGHT, MAX_WEIGHT);
          state.affinity.style.creative = clamp(state.affinity.style.creative + 0.25, MIN_WEIGHT, MAX_WEIGHT);
        } else {
          state.tier[domain] = clamp(tier - 1, 1, 3);
          state.affinity.domain[domain] = clamp(state.affinity.domain[domain] - 0.1, MIN_WEIGHT, MAX_WEIGHT);
          state.affinity.style.rigorous = clamp(state.affinity.style.rigorous + 0.15, MIN_WEIGHT, MAX_WEIGHT);
        }
      } else {
        xpGained = 1;
        state.affinity.domain[domain] = clamp(state.affinity.domain[domain] - 0.08, MIN_WEIGHT, MAX_WEIGHT);
      }
    }

    state.xp[domain] += xpGained;
    state.correctStreak = goodOutcome ? state.correctStreak + 1 : 0;
    Storage.recordAnswered(state, node.id);
    Storage.bumpStreak(state);
    state.lastDomain = domain;
    state.lastNodeId = node.id;

    return { xpGained, correct, goodOutcome, leveledUp: Storage.levelForXP(state.xp[domain]) > beforeLevel };
  },

  // Follows an explicit writing branch if the just-answered node has one.
  // Returns a node, or null if there's no branch to follow (chain ended,
  // or the node wasn't a branching one).
  followBranch(node, choiceIndex) {
    if (!node.next) return null;
    const nextId = node.next[choiceIndex];
    if (!nextId) return null;
    return QUESTIONS.writing.find((n) => n.id === nextId) || null;
  },

  // General weighted pick: domain -> style -> a matching, not-recently-seen
  // question at the domain's current tier (relaxing constraints if the
  // pool comes up empty). Reads state.focus for the "drill into" picks:
  //   - breadth "narrow": hard-restricts domain choice to whatever's
  //     focused (or, with no explicit picks, locks onto the single
  //     strongest domain) and stops down-weighting repeats — narrow means
  //     staying put on purpose.
  //   - breadth "broad": focused domains just get a weight bump, everything
  //     stays in the mix — variety is the point.
  //   Selected topics/regions are tried first regardless of breadth; the
  //   relax chain only drops them if nothing matches, so a pick never
  //   dead-ends the quest loop.
  pickNextNode(state) {
    const focus = state.focus || { breadth: "broad", topics: {}, regions: [] };
    const narrow = focus.breadth === "narrow";
    const focusedDomains = DOMAIN_ORDER.filter(
      (d) => (focus.topics[d] || []).length > 0 || (d === "trivia" && (focus.regions || []).length > 0)
    );

    let domainWeights = { ...state.affinity.domain };
    if (narrow) {
      domainWeights = focusedDomains.length
        ? Object.fromEntries(focusedDomains.map((d) => [d, state.affinity.domain[d]]))
        : { [topAffinityDomain(state)]: 1 };
    } else if (focusedDomains.length) {
      domainWeights = Object.fromEntries(Object.entries(domainWeights).map(([d, w]) => [d, focusedDomains.includes(d) ? w * 2.2 : w]));
    }

    const domain = weightedPick(domainWeights, narrow ? null : state.lastDomain);
    const pool = QUESTIONS[domain];
    const availableStyles = new Set(pool.map((n) => n.style));
    const styleWeights = Object.fromEntries(Object.entries(state.affinity.style).filter(([s]) => availableStyles.has(s)));
    const style = weightedPick(Object.keys(styleWeights).length ? styleWeights : { creative: 1, rigorous: 1 });
    const targetTier = state.tier[domain];

    const topicFilter = focus.topics[domain] || [];
    const regionFilter = domain === "trivia" ? focus.regions || [] : [];
    const matchesFocus = (n) =>
      (!topicFilter.length || topicFilter.includes(n.topic)) && (!regionFilter.length || regionFilter.includes(n.region));

    const candidates = (filterFn) => pool.filter((n) => !n.branchOnly && filterFn(n));
    let matches = candidates((n) => n.style === style && n.tier === targetTier && matchesFocus(n) && !state.answeredIds.includes(n.id));
    if (!matches.length) matches = candidates((n) => n.style === style && matchesFocus(n) && !state.answeredIds.includes(n.id));
    if (!matches.length) matches = candidates((n) => matchesFocus(n) && !state.answeredIds.includes(n.id));
    if (!matches.length) matches = candidates((n) => !state.answeredIds.includes(n.id));
    if (!matches.length) matches = candidates(() => true);
    if (!matches.length) matches = pool.filter((n) => !n.branchOnly);

    return matches[Math.floor(Math.random() * matches.length)];
  },
};

function topAffinityDomain(state) {
  return Object.entries(state.affinity.domain).sort((a, b) => b[1] - a[1])[0][0];
}
