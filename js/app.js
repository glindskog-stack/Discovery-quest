// App shell: screen routing, profile picker, and the quest loop. Talks to
// Storage for persistence and Engine for what comes next; doesn't know
// anything about how affinity math works internally.

const AVATAR_EMOJI = ["🦊", "🐙", "🦂", "🐍", "🦇", "🐺", "🦅", "🐲", "👾", "🛸"];
const ONBOARDING_STEPS = ["identity", "age", "difficulty", "interests", "goal"];

const els = {};
let activeProfile = null;
let state = null;
let currentNode = null;
let sessionEntry = null;
let sessionTimer = null;
let pendingFreeResponse = null; // { node, wordCount } while waiting on enjoyment tap
let onboardingStepIndex = 0;
let onboardingDraft = {};
let toastQueue = [];
let toastShowing = false;
let firstRunFocus = false; // true while showing Focus as the pre-quest scope step for a brand-new profile

function $(id) {
  return document.getElementById(id);
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("hidden", s.dataset.screen !== name));
}

// ---------- Profile picker ----------

function renderProfileList() {
  const profiles = Storage.listProfiles();
  const list = $("profile-list");
  list.innerHTML = "";

  profiles.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "profile-chip";
    btn.innerHTML = `<span class="profile-emoji">${p.emoji}</span><span>${escapeHTML(p.name)}</span>`;
    btn.addEventListener("click", () => selectProfile(p.id));
    list.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "profile-chip profile-chip-add";
  addBtn.textContent = I18n.t("btn.new_profile");
  addBtn.addEventListener("click", startOnboarding);
  list.appendChild(addBtn);
}

// ---------- Language picker ----------

function renderLangPicker() {
  const wrap = $("lang-picker");
  wrap.innerHTML = "";
  I18N_LANGS.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-option" + (lang.code === I18n.current ? " selected" : "");
    btn.textContent = lang.flag;
    btn.title = lang.name;
    btn.addEventListener("click", () => setLanguage(lang.code));
    wrap.appendChild(btn);
  });
}

function setLanguage(code) {
  if (code === I18n.current) return;
  I18n.setLang(code);
  localizeDomains();
  localizeAchievements();
  I18n.applyStaticDOM();
  fitTaglineToOneLine();
  document.documentElement.lang = code;
  renderLangPicker();
  renderProfileList();
  if (activeProfile) {
    renderActiveProfileTag();
    renderGoalPill();
    if (currentNode) renderNode(currentNode);
  }
  $("close-focus").textContent = I18n.t(firstRunFocus ? "btn.start_quest" : "btn.back");
  $("focus-start-bottom").textContent = I18n.t(firstRunFocus ? "btn.start_quest" : "btn.back");
}

// Some translations run much longer than others (German especially), so a
// fixed or viewport-only font-size can't guarantee one line across all 5
// languages. Measure the actual overflow and shrink until it fits instead.
function fitTaglineToOneLine() {
  const el = $("brand-tagline");
  if (!el) return;
  let size = 15;
  el.style.fontSize = size + "px";
  while (el.scrollWidth > el.clientWidth && size > 9) {
    size -= 0.5;
    el.style.fontSize = size + "px";
  }
}

// ---------- Onboarding wizard ----------

function startOnboarding() {
  onboardingStepIndex = 0;
  onboardingDraft = { age: null, difficulty: 2, interests: [], goalType: "count", goalValue: 10 };
  $("profile-list").classList.add("hidden");
  $("onboarding").classList.remove("hidden");
  $("new-profile-name").value = "";
  $("onboarding-age").value = "";
  buildEmojiPicker();
  buildInterestsChoice();
  wireChoiceRow($("difficulty-choice"), (btn) => {
    onboardingDraft.difficulty = Number(btn.dataset.value);
  });
  wireChoiceRow($("goal-choice"), (btn) => {
    onboardingDraft.goalType = btn.dataset.type;
    onboardingDraft.goalValue = Number(btn.dataset.value);
  });
  applyDefaultSelection($("difficulty-choice"), (btn) => Number(btn.dataset.value) === onboardingDraft.difficulty);
  applyDefaultSelection($("goal-choice"), (btn) => btn.dataset.type === onboardingDraft.goalType && Number(btn.dataset.value) === onboardingDraft.goalValue);
  renderOnboardingStep();
}

function wireChoiceRow(container, onSelect) {
  container.querySelectorAll(".choice-btn-lg").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".choice-btn-lg").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      onSelect(btn);
    });
  });
}

function applyDefaultSelection(container, matchFn) {
  container.querySelectorAll(".choice-btn-lg").forEach((b) => b.classList.toggle("selected", matchFn(b)));
}

function buildInterestsChoice() {
  const wrap = $("interests-choice");
  wrap.innerHTML = "";
  DOMAIN_ORDER.forEach((domainId) => {
    const domain = DOMAINS[domainId];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn-lg choice-btn-domain";
    btn.dataset.value = domainId;
    btn.innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> ${domain.shortLabel}`;
    btn.addEventListener("click", () => {
      const i = onboardingDraft.interests.indexOf(domainId);
      if (i === -1) onboardingDraft.interests.push(domainId);
      else onboardingDraft.interests.splice(i, 1);
      btn.classList.toggle("selected");
    });
    wrap.appendChild(btn);
  });
}

function renderOnboardingStep() {
  const stepName = ONBOARDING_STEPS[onboardingStepIndex];
  document.querySelectorAll(".onboarding-step").forEach((el) => el.classList.toggle("hidden", el.dataset.step !== stepName));
  $("onboarding-dots").innerHTML = ONBOARDING_STEPS.map((_, i) => `<span class="dot${i === onboardingStepIndex ? " active" : ""}"></span>`).join("");
  $("onboarding-back").textContent = onboardingStepIndex === 0 ? I18n.t("btn.cancel") : I18n.t("btn.back");
  $("onboarding-next").textContent = onboardingStepIndex === ONBOARDING_STEPS.length - 1 ? I18n.t("btn.lets_go") : I18n.t("btn.next");
  if (stepName === "identity") $("new-profile-name").focus();
}

$("onboarding-back").addEventListener("click", () => {
  if (onboardingStepIndex === 0) {
    $("onboarding").classList.add("hidden");
    $("profile-list").classList.remove("hidden");
    return;
  }
  onboardingStepIndex -= 1;
  renderOnboardingStep();
});

$("onboarding-next").addEventListener("click", () => {
  const stepName = ONBOARDING_STEPS[onboardingStepIndex];
  if (stepName === "identity" && !$("new-profile-name").value.trim()) {
    $("new-profile-name").focus();
    return;
  }
  if (stepName === "age") {
    const age = Number($("onboarding-age").value);
    onboardingDraft.age = age > 0 ? age : null;
  }
  if (onboardingStepIndex === ONBOARDING_STEPS.length - 1) {
    completeOnboarding();
    return;
  }
  onboardingStepIndex += 1;
  renderOnboardingStep();
});

function completeOnboarding() {
  const name = $("new-profile-name").value.trim();
  const emoji = $("emoji-picker").getSelected();
  const profile = Storage.createProfile(name, emoji, onboardingDraft);
  $("onboarding").classList.add("hidden");
  $("profile-list").classList.remove("hidden");
  selectProfile(profile.id, { fresh: true });
}

function buildEmojiPicker() {
  const picker = $("emoji-picker");
  picker.innerHTML = "";
  let selected = AVATAR_EMOJI[0];
  AVATAR_EMOJI.forEach((emoji, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "emoji-option" + (i === 0 ? " selected" : "");
    btn.textContent = emoji;
    btn.addEventListener("click", () => {
      picker.querySelectorAll(".emoji-option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selected = emoji;
    });
    picker.appendChild(btn);
  });
  picker.dataset.selected = selected;
  picker.getSelected = () => picker.querySelector(".emoji-option.selected")?.textContent || AVATAR_EMOJI[0];
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function selectProfile(id, opts = {}) {
  activeProfile = Storage.listProfiles().find((p) => p.id === id);
  Storage.setActiveProfileId(id);
  state = Storage.getState(id);
  sessionEntry = Storage.startSessionEntry(state);
  sessionEntry.xpGained = 0;
  Storage.saveState(id, state);
  startSessionTimer();
  renderActiveProfileTag();
  renderGoalPill();
  if (opts.fresh) {
    // Brand-new profile: let them shape scope before the first prompt shows,
    // instead of dropping them straight into a random question.
    openFocusScreen(true);
  } else {
    showScreen("quest");
    loadNextNode();
  }
}

function renderGoalPill() {
  const progress = Storage.sessionGoalProgress(state, sessionEntry);
  const current = progress.type === "time" ? Math.floor(progress.current) : progress.current;
  const key = progress.type === "time" ? "goal_pill.min" : "goal_pill.today";
  const label = I18n.t(key, { current, target: progress.target });
  $("goal-pill").textContent = `${progress.met ? "✅" : "🎯"} ${label}`;
  $("goal-pill").classList.toggle("goal-pill-met", progress.met);
  renderStreakPill();
}

function renderStreakPill() {
  const el = $("streak-pill");
  const n = state.streak.current;
  el.textContent = `🔥 ${I18n.plural("streak_pill.days", n)}`;
  el.title = I18n.t("streak_pill.title", { n: state.streak.longest });
  el.classList.toggle("streak-pill-lit", n > 0);
}

function renderActiveProfileTag() {
  $("active-profile-tag").innerHTML = `<span class="profile-emoji">${activeProfile.emoji}</span> ${escapeHTML(activeProfile.name)}`;
}

$("switch-profile").addEventListener("click", () => {
  endSession();
  activeProfile = null;
  showScreen("profiles");
  $("onboarding").classList.add("hidden");
  $("profile-list").classList.remove("hidden");
  renderProfileList();
});

// ---------- Session bookkeeping ----------

function startSessionTimer() {
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(() => {
    flushSessionTime();
    renderGoalPill();
  }, 15000);
  window.addEventListener("beforeunload", flushSessionTime);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSessionTime();
  });
}

// ---------- Session goal picker ----------

$("goal-pill").addEventListener("click", () => {
  markGoalChoiceSelected($("goal-picker-choice"), state.sessionGoal);
  $("goal-picker-overlay").classList.remove("hidden");
});

$("goal-picker-close").addEventListener("click", () => {
  $("goal-picker-overlay").classList.add("hidden");
});

function markGoalChoiceSelected(container, goal) {
  container.querySelectorAll(".choice-btn-lg").forEach((b) => {
    b.classList.toggle("selected", b.dataset.type === goal.type && Number(b.dataset.value) === goal.value);
  });
}

$("goal-picker-choice").querySelectorAll(".choice-btn-lg").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.sessionGoal = { type: btn.dataset.type, value: Number(btn.dataset.value) };
    Storage.saveState(activeProfile.id, state);
    markGoalChoiceSelected($("goal-picker-choice"), state.sessionGoal);
    renderGoalPill();
    $("goal-picker-overlay").classList.add("hidden");
  });
});

function flushSessionTime() {
  if (!sessionEntry || !state) return;
  const elapsed = Date.now() - sessionEntry.startedAt;
  state.totalTimeMs += elapsed - sessionEntry.durationMs;
  sessionEntry.durationMs = elapsed;
  Storage.saveState(activeProfile.id, state);
  Cloud.pushStats(activeProfile, state); // no-op if cloud sync isn't configured
}

function endSession() {
  flushSessionTime();
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = null;
}

// ---------- Quest loop ----------

function loadNextNode() {
  currentNode = Engine.pickNextNode(state);
  renderNode(currentNode);
}

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function renderNode(node) {
  const domain = DOMAINS[node.domain];
  $("domain-badge").innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> ${domain.label}`;
  $("quest-card").style.setProperty("--domain-accent", domain.accent);
  $("quest-prompt").textContent = node.q;
  $("quest-feedback").classList.add("hidden");
  $("next-prompt").classList.add("hidden");
  $("enjoyment-picker").classList.add("hidden");
  pendingFreeResponse = null;

  if (node.freeResponse) {
    $("quest-choices").classList.add("hidden");
    $("quest-choices").innerHTML = "";
    $("quest-freeresponse").classList.remove("hidden");
    $("freeresponse-input").value = "";
    $("freeresponse-input").disabled = false;
    $("submit-freeresponse").disabled = false;
    $("wordcount").textContent = I18n.t("quest.words", { n: 0, target: node.minWords });
  } else {
    $("quest-freeresponse").classList.add("hidden");
    $("quest-choices").classList.remove("hidden");
    const choicesEl = $("quest-choices");
    choicesEl.innerHTML = "";
    node.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="choice-letter">${CHOICE_LETTERS[i]}</span><span>${escapeHTML(choice)}</span>`;
      btn.addEventListener("click", () => handleChoice(node, i, btn));
      choicesEl.appendChild(btn);
    });
  }
}

function handleChoice(node, choiceIndex, btnEl) {
  document.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));

  if (node.style === "rigorous") {
    const isCorrect = choiceIndex === node.answer;
    btnEl.classList.add(isCorrect ? "choice-correct" : "choice-wrong");
    if (!isCorrect) {
      const correctBtn = $("quest-choices").children[node.answer];
      correctBtn.classList.add("choice-correct");
    }
    isCorrect ? Sound.correct() : Sound.wrong();
    buzz(isCorrect ? 15 : [12, 30, 12]);
    const result = Engine.recordResponse(state, node, { choiceIndex });
    finishAnswer(node, result, { choiceIndex, answerText: node.choices[choiceIndex] });
  } else if (node.next) {
    // Branching writing choice: always "completes", no wrong path.
    $("quest-choices").children[choiceIndex].classList.add("choice-correct");
    const result = Engine.recordResponse(state, node, { completed: true, enjoyment: 3 });
    finishAnswer(node, result, { choiceIndex, answerText: node.choices[choiceIndex] });
  }
}

$("freeresponse-input").addEventListener("input", () => {
  const words = $("freeresponse-input").value.trim().split(/\s+/).filter(Boolean).length;
  $("wordcount").textContent = I18n.t("quest.words", { n: words, target: currentNode.minWords });
});

$("submit-freeresponse").addEventListener("click", () => {
  const text = $("freeresponse-input").value.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const completed = wordCount >= currentNode.minWords;
  $("freeresponse-input").disabled = true;
  $("submit-freeresponse").disabled = true;

  if (!text) {
    // Nothing written — count it as a pass, no enjoyment ask, no guilt trip.
    const result = Engine.recordResponse(state, currentNode, { completed: false });
    finishAnswer(currentNode, result, {});
    return;
  }

  pendingFreeResponse = { node: currentNode, completed, text };
  $("enjoyment-picker").classList.remove("hidden");
});

document.querySelectorAll(".enjoyment-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const enjoyment = Number(btn.dataset.value);
    $("enjoyment-picker").classList.add("hidden");
    const { node, completed, text } = pendingFreeResponse;
    const result = Engine.recordResponse(state, node, { completed, enjoyment });
    finishAnswer(node, result, { answerText: text, enjoyment });
  });
});

$("skip-prompt").addEventListener("click", () => {
  loadNextNode();
});

function finishAnswer(node, result, opts = {}) {
  const { choiceIndex, answerText, enjoyment } = opts;
  trackAnswered(node, result.xpGained);

  Storage.appendAnswerLog(state, {
    nodeId: node.id,
    domain: node.domain,
    style: node.style,
    question: node.q,
    answer: answerText ?? null,
    correct: result.correct,
    completed: result.completed,
    enjoyment: enjoyment ?? null,
    xpGained: result.xpGained,
  });
  Cloud.logAnswer(activeProfile, state.answerLog[state.answerLog.length - 1]);

  const brokenRecords = Storage.updateRecords(state, {
    correctStreak: state.correctStreak,
    sessionXP: sessionEntry.xpGained,
    sessionPrompts: sessionEntry.promptsAnswered,
  });
  let unlockedAchievements = Achievements.evaluate(state, { sessionEntry, goodOutcome: result.goodOutcome });

  showFeedback(result, node, brokenRecords);
  renderGoalPill();
  if (result.xpGained) popXP(result.xpGained);
  if (result.leveledUp) Sound.levelUp();

  $("next-prompt").classList.remove("hidden");
  $("next-prompt").onclick = () => {
    const branchNext = Engine.followBranch(node, choiceIndex ?? 0);
    currentNode = branchNext || Engine.pickNextNode(state);
    renderNode(currentNode);
  };

  const progress = Storage.sessionGoalProgress(state, sessionEntry);
  if (progress.met && Storage.markGoalCompletedToday(state)) {
    unlockedAchievements = unlockedAchievements.concat(Achievements.evaluateGoalCompletion(state));
    Storage.saveState(activeProfile.id, state);
    showGoalCompleteOverlay(progress, unlockedAchievements);
  } else {
    Storage.saveState(activeProfile.id, state);
    if (unlockedAchievements.length) queueAchievementToasts(unlockedAchievements);
  }
}

function trackAnswered(node, xpGained) {
  sessionEntry.promptsAnswered += 1;
  sessionEntry.xpGained = (sessionEntry.xpGained || 0) + xpGained;
  if (!sessionEntry.domainsTouched.includes(node.domain)) sessionEntry.domainsTouched.push(node.domain);
}

// Every answer gets a headline (randomized, so it doesn't feel canned) plus
// a one-sentence body: the "explain" fact for rigorous questions, nothing
// extra needed for creative ones since the headline itself is the
// affirmation. XP/level/streak land in a separate, quieter meta line.
function showFeedback(result, node, brokenRecords) {
  const feedback = $("quest-feedback");
  feedback.innerHTML = "";

  let toneClass;
  let icon;
  let headline;
  const bodyParts = [];

  if (node.style === "rigorous") {
    toneClass = result.correct ? "feedback-good" : "feedback-miss";
    icon = result.correct ? "✅" : "💡";
    headline = result.correct ? I18n.tRandom("feedback.correct", 5) : I18n.tRandom("feedback.incorrect", 5);
    if (node.explain) bodyParts.push(node.explain);
    if (node.source) {
      const dateSuffix = node.verifiedAt ? I18n.t("quest.source_checked", { date: node.verifiedAt }) : "";
      bodyParts.push(I18n.t("quest.source", { name: node.source }) + dateSuffix);
    }
  } else if (!result.completed) {
    toneClass = "feedback-neutral";
    icon = "⏭️";
    headline = I18n.t("feedback.creative_skipped");
  } else if (result.goodOutcome) {
    toneClass = "feedback-good";
    icon = "✨";
    headline = I18n.tRandom("feedback.creative_good", 5);
  } else {
    toneClass = "feedback-creative";
    icon = "📝";
    headline = I18n.tRandom("feedback.creative_meh", 3);
  }

  feedback.className = `quest-feedback ${toneClass}`;

  const head = document.createElement("div");
  head.className = "feedback-headline";
  head.textContent = `${icon} ${headline}`;
  feedback.appendChild(head);

  if (bodyParts.length) {
    const body = document.createElement("div");
    body.className = "feedback-body";
    body.textContent = bodyParts.join(" ");
    feedback.appendChild(body);
  }

  const metaParts = [];
  if (result.xpGained) metaParts.push(`+${result.xpGained} XP`);
  if (result.leveledUp) metaParts.push(I18n.t("quest.level_up"));
  if (brokenRecords && brokenRecords.includes("bestCorrectStreak") && state.correctStreak > 1) {
    metaParts.push(I18n.t("quest.new_best_streak", { n: state.correctStreak }));
  }
  if (metaParts.length) {
    const meta = document.createElement("div");
    meta.className = "feedback-meta";
    meta.textContent = metaParts.join(" — ");
    feedback.appendChild(meta);
  }

  if (result.leveledUp && Cloud.isConfigured()) {
    Cloud.getPercentile(node.domain, state.xp[node.domain]).then((pct) => {
      if (pct == null) return;
      const extra = document.createElement("div");
      extra.className = "level-up-percentile";
      extra.textContent = I18n.t("quest.ahead_of", { pct: Math.round(pct), domain: DOMAINS[node.domain].shortLabel });
      feedback.appendChild(extra);
    });
  }
}

// ---------- Achievement toasts + goal-complete overlay ----------

function queueAchievementToasts(ids) {
  toastQueue.push(...ids);
  processToastQueue();
}

function processToastQueue() {
  if (toastShowing || !toastQueue.length) return;
  toastShowing = true;
  const id = toastQueue.shift();
  const a = ACHIEVEMENTS[id];
  const toast = $("achievement-toast");
  toast.innerHTML = `<div class="achievement-toast-icon">${a.icon}</div><div><div class="achievement-toast-label">${a.label}</div><div class="achievement-toast-desc">${a.desc}</div></div>`;
  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("show"));
  Sound.achievement();
  buzz([15, 40, 15]);
  burstConfetti();
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
      toastShowing = false;
      processToastQueue();
    }, 300);
  }, 2600);
}

function showGoalCompleteOverlay(progress, pendingAchievementIds) {
  const key = progress.type === "time" ? "goal_complete.body_time" : "goal_complete.body_count";
  const n = progress.type === "time" ? Math.round(progress.current) : progress.current;
  $("goal-complete-body").textContent = I18n.t(key, { n });
  $("goal-complete-overlay").dataset.pending = JSON.stringify(pendingAchievementIds || []);
  $("goal-complete-overlay").classList.remove("hidden");
  Sound.goalComplete();
  buzz([15, 40, 15, 40, 15]);
  burstConfetti();
}

// ---------- Juice: XP pop, confetti, haptics ----------

function buzz(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function popXP(amount) {
  const pop = document.createElement("div");
  pop.className = "xp-pop";
  pop.textContent = `+${amount} XP`;
  $("quest-card").appendChild(pop);
  requestAnimationFrame(() => pop.classList.add("xp-pop-animate"));
  setTimeout(() => pop.remove(), 1200);
}

const CONFETTI_COLORS = ["#d4ff00", "#ef06b1", "#0098c7", "#719f04", "#bd8005"];

function burstConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-burst";
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 140;
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.abs(Math.sin(angle)) * distance + 60}px`);
    piece.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    piece.style.setProperty("--delay", `${Math.random() * 0.12}s`);
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1500);
}

$("toggle-sound").addEventListener("click", () => {
  const muted = Sound.toggleMute();
  $("toggle-sound").textContent = muted ? "🔇" : "🔊";
  if (!muted) Sound.tap();
});

$("goal-complete-dismiss").addEventListener("click", () => {
  $("goal-complete-overlay").classList.add("hidden");
  const pending = JSON.parse($("goal-complete-overlay").dataset.pending || "[]");
  if (pending.length) queueAchievementToasts(pending);
});

// ---------- Focus: what to drill into ----------

function openFocusScreen(fresh) {
  firstRunFocus = fresh;
  renderFocusScreen();
  $("focus-intro").classList.toggle("hidden", !fresh);
  // Floating CTA is always available — a topic/region list this long
  // shouldn't require scrolling all the way back up or down to leave.
  $("focus-start-bottom").classList.remove("hidden");
  $("focus-start-bottom").textContent = I18n.t(fresh ? "btn.start_quest" : "btn.back");
  document.querySelector(".focus-content").classList.add("has-floating-cta");
  $("close-focus").textContent = I18n.t(fresh ? "btn.start_quest" : "btn.back");
  showScreen("focus");
}

function leaveFocusScreen() {
  const wasFresh = firstRunFocus;
  firstRunFocus = false;
  showScreen("quest");
  if (wasFresh) loadNextNode();
}

$("open-focus").addEventListener("click", () => openFocusScreen(false));
$("close-focus").addEventListener("click", leaveFocusScreen);
$("focus-start-bottom").addEventListener("click", leaveFocusScreen);

function renderFocusScreen() {
  $("difficulty-reset-status").classList.add("hidden");
  renderBreadthToggle();
  renderTopicChips();
  renderRegionChips();
  renderSubjectDomainOptions();
  renderSubjectRequests();
  renderReminderState();
}

// ---------- Daily reminder ----------

function pad2(n) {
  return String(n).padStart(2, "0");
}

function renderReminderState() {
  const btn = $("reminder-toggle");
  const status = $("reminder-status");
  const input = $("reminder-time");
  const prefs = Storage.getReminderPrefs();
  input.value = `${pad2(prefs.hour)}:${pad2(prefs.minute)}`;

  if (!Push.isSupported()) {
    btn.disabled = true;
    input.disabled = true;
    status.textContent = I18n.t("focus.reminder_unsupported");
    return;
  }

  input.disabled = false;
  btn.disabled = false;

  if (Push.permission() === "denied") {
    btn.disabled = true;
    status.textContent = I18n.t("focus.reminder_denied");
    return;
  }

  btn.textContent = I18n.t(prefs.enabled ? "btn.reminder_disable" : "btn.reminder_enable");
  status.textContent = prefs.enabled
    ? I18n.t("focus.reminder_status_on", { time: `${pad2(prefs.hour)}:${pad2(prefs.minute)}` })
    : I18n.t("focus.reminder_status_off");
}

$("reminder-toggle").addEventListener("click", async () => {
  const btn = $("reminder-toggle");
  const status = $("reminder-status");
  const prefs = Storage.getReminderPrefs();
  btn.disabled = true;

  if (prefs.enabled) {
    await Push.disable();
    Storage.setReminderPrefs({ ...prefs, enabled: false });
    renderReminderState();
    return;
  }

  const [hourStr, minuteStr] = $("reminder-time").value.split(":");
  const hour = Number(hourStr), minute = Number(minuteStr);
  const result = await Push.enable(hour, minute);
  if (result.ok) {
    Storage.setReminderPrefs({ enabled: true, hour, minute });
    renderReminderState();
    return;
  }
  status.textContent = I18n.t(result.reason === "denied" ? "focus.reminder_denied" : "focus.reminder_error");
  btn.disabled = false;
});

// Difficulty auto-adjusts per domain as you play (Engine.recordResponse
// nudges state.tier up/down on correct/miss); this is a manual override
// for "it's drifted somewhere I don't want" — resets every domain's tier
// to the chosen level in one shot, same effect as the onboarding pick.
document.querySelectorAll("#difficulty-reset-choice .choice-btn-lg").forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = Number(btn.dataset.value);
    DOMAIN_ORDER.forEach((d) => (state.tier[d] = level));
    Storage.saveState(activeProfile.id, state);
    const levelKey = level === 1 ? "difficulty.easy.title" : level === 2 ? "difficulty.medium.title" : "difficulty.hard.title";
    const status = $("difficulty-reset-status");
    status.textContent = I18n.t("focus.difficulty_reset_confirm", { level: I18n.t(levelKey) });
    status.classList.remove("hidden");
  });
});

function renderBreadthToggle() {
  document.querySelectorAll(".breadth-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.breadth === state.focus.breadth);
  });
}

document.querySelectorAll(".breadth-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.focus.breadth = btn.dataset.breadth;
    Storage.saveState(activeProfile.id, state);
    renderBreadthToggle();
  });
});

function renderTopicChips() {
  const wrap = $("focus-topics");
  wrap.innerHTML = "";
  DOMAIN_ORDER.forEach((domainId) => {
    const domain = DOMAINS[domainId];
    const topics = topicsForDomain(domainId);
    const section = document.createElement("div");
    section.className = "focus-topic-section";
    const title = document.createElement("div");
    title.className = "focus-block-title";
    title.innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> ${domain.shortLabel}`;
    section.appendChild(title);

    const row = document.createElement("div");
    row.className = "chip-row";
    topics.forEach((topic) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = topic;
      chip.classList.toggle("chip-active", state.focus.topics[domainId].includes(topic));
      chip.addEventListener("click", () => toggleTopic(domainId, topic, chip));
      row.appendChild(chip);
    });
    section.appendChild(row);
    wrap.appendChild(section);
  });
}

function toggleTopic(domainId, topic, chipEl) {
  const list = state.focus.topics[domainId];
  const i = list.indexOf(topic);
  if (i === -1) list.push(topic);
  else list.splice(i, 1);
  chipEl.classList.toggle("chip-active");
  Storage.saveState(activeProfile.id, state);
}

function renderRegionChips() {
  const wrap = $("focus-regions");
  wrap.innerHTML = "";
  regionsInUse().forEach((region) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = region;
    chip.classList.toggle("chip-active", state.focus.regions.includes(region));
    chip.addEventListener("click", () => {
      const list = state.focus.regions;
      const i = list.indexOf(region);
      if (i === -1) list.push(region);
      else list.splice(i, 1);
      chip.classList.toggle("chip-active");
      Storage.saveState(activeProfile.id, state);
    });
    wrap.appendChild(chip);
  });
}

function renderSubjectDomainOptions() {
  const select = $("subject-domain");
  if (select.options.length) return; // static across the session
  DOMAIN_ORDER.forEach((domainId) => {
    const opt = document.createElement("option");
    opt.value = domainId;
    opt.textContent = DOMAINS[domainId].shortLabel;
    select.appendChild(opt);
  });
}

function renderSubjectRequests() {
  const list = $("subject-requests-list");
  list.innerHTML = "";
  [...state.requestedSubjects].reverse().forEach((r) => {
    const row = document.createElement("div");
    row.className = "subject-request-item";
    row.innerHTML = `<span class="domain-icon" style="color:${DOMAINS[r.domain].accent}">${DOMAINS[r.domain].icon}</span> <span>${escapeHTML(r.text)}</span> <span class="subject-request-status">${I18n.t("focus.queued")}</span>`;
    list.appendChild(row);
  });
  if (!state.requestedSubjects.length) {
    const empty = document.createElement("p");
    empty.className = "dash-empty";
    empty.textContent = I18n.t("focus.nothing_queued");
    list.appendChild(empty);
  }
}

$("subject-request-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const domain = $("subject-domain").value;
  const text = $("subject-text").value;
  const entry = Storage.addSubjectRequest(state, domain, text);
  if (!entry) return;
  Storage.saveState(activeProfile.id, state);
  Cloud.queueSubjectRequest(activeProfile, entry);
  $("subject-text").value = "";
  renderSubjectRequests();
});

// ---------- Dashboard ----------

$("open-dashboard").addEventListener("click", () => {
  flushSessionTime();
  $("dashboard-title").textContent = `${activeProfile.emoji} ${activeProfile.name}`;
  Dashboard.render($("dashboard-content"), activeProfile, state);
  showScreen("dashboard");
});

$("close-dashboard").addEventListener("click", () => {
  showScreen("quest");
});

// ---------- Boot ----------

function boot() {
  document.documentElement.lang = I18n.current;
  localizeDomains();
  localizeAchievements();
  I18n.applyStaticDOM();
  fitTaglineToOneLine();
  window.addEventListener("resize", fitTaglineToOneLine);
  renderLangPicker();
  $("toggle-sound").textContent = Sound.isMuted() ? "🔇" : "🔊";
  renderProfileList();
  const lastId = Storage.getActiveProfileId();
  const profiles = Storage.listProfiles();
  if (lastId && profiles.some((p) => p.id === lastId)) {
    selectProfile(lastId);
  } else {
    showScreen("profiles");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();
