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

const TAB_SCREENS = new Set(["quest", "focus", "rocket", "dashboard"]);

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("hidden", s.dataset.screen !== name));
  const showTabs = TAB_SCREENS.has(name);
  $("bottom-tabs").classList.toggle("hidden", !showTabs);
  $("app").classList.toggle("has-bottom-tabs", showTabs);
  document.querySelectorAll(".bottom-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
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

// Populates every language picker on the page (profile screen's is always
// visible; the quest header's is a popover) so switching works from
// wherever the player currently is, not just before picking a profile.
function renderLangPicker() {
  document.querySelectorAll(".lang-picker").forEach((wrap) => {
    wrap.innerHTML = "";
    I18N_LANGS.forEach((lang) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option" + (lang.code === I18n.current ? " selected" : "");
      btn.textContent = lang.flag;
      btn.title = lang.name;
      btn.addEventListener("click", () => {
        setLanguage(lang.code);
        $("lang-picker-quest").classList.add("hidden");
      });
      wrap.appendChild(btn);
    });
  });
}

// The toggle button's position isn't fixed (the header can wrap onto a
// second line depending on viewport width and profile-name length), so a
// CSS-only right:0 anchor could push the popover halfway off-screen. Clamp
// it in JS instead, after it's visible and has real dimensions to measure.
function positionLangPopover() {
  const popover = $("lang-picker-quest");
  const wrap = popover.parentElement;
  const wrapRect = wrap.getBoundingClientRect();
  popover.style.right = "auto";
  popover.style.left = "0px";
  const popRect = popover.getBoundingClientRect();
  const margin = 8;
  const desiredLeftViewport = wrapRect.left + wrapRect.width / 2 - popRect.width / 2;
  const clampedLeftViewport = Math.min(Math.max(desiredLeftViewport, margin), window.innerWidth - popRect.width - margin);
  popover.style.left = `${clampedLeftViewport - wrapRect.left}px`;
}

$("toggle-lang").addEventListener("click", (e) => {
  e.stopPropagation();
  $("lang-picker-quest").classList.toggle("hidden");
  if (!$("lang-picker-quest").classList.contains("hidden")) positionLangPopover();
});

document.addEventListener("click", (e) => {
  const popover = $("lang-picker-quest");
  if (!popover.classList.contains("hidden") && !popover.contains(e.target) && e.target.id !== "toggle-lang") {
    popover.classList.add("hidden");
  }
});

function setLanguage(code) {
  if (code === I18n.current) return;
  I18n.setLang(code);
  localizeDomains();
  localizeAchievements();
  localizeQuestions();
  localizeRocketCourse();
  I18n.applyStaticDOM();
  fitTaglineToOneLine();
  document.documentElement.lang = code;
  renderLangPicker();
  renderProfileList();
  if (activeProfile) {
    renderActiveProfileTag();
    renderGoalPill();
    if (currentNode) renderNode(currentNode);
    if (!$("screen-rocket").classList.contains("hidden")) {
      if (!$("rocket-stage-list-view").classList.contains("hidden")) renderRocketStageList();
      if (!$("rocket-play-view").classList.contains("hidden")) renderRocketNode();
    }
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

$("tab-home").addEventListener("click", () => showScreen("quest"));

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

$("submit-freeresponse").addEventListener("click", async () => {
  const node = currentNode;
  const text = $("freeresponse-input").value.trim();
  $("freeresponse-input").disabled = true;
  $("submit-freeresponse").disabled = true;

  if (!text) {
    // Nothing written — count it as a pass, no enjoyment ask, no guilt trip.
    const result = Engine.recordResponse(state, node, { completed: false });
    finishAnswer(node, result, {});
    return;
  }

  $("wordcount").textContent = I18n.t("quest.grading");
  const grade = await Grading.gradeFreeResponse({ question: node.q, answer: text, language: I18n.current });
  if (currentNode !== node) return; // user skipped away while grading was in flight
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const completed = grade ? grade.pass : wordCount >= node.minWords;

  pendingFreeResponse = { node, completed, text, aiFeedback: grade ? grade.feedback : null };
  $("enjoyment-picker").classList.remove("hidden");
});

document.querySelectorAll(".enjoyment-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const enjoyment = Number(btn.dataset.value);
    $("enjoyment-picker").classList.add("hidden");
    const { node, completed, text, aiFeedback } = pendingFreeResponse;
    const result = Engine.recordResponse(state, node, { completed, enjoyment });
    finishAnswer(node, result, { answerText: text, enjoyment, aiFeedback });
  });
});

$("skip-prompt").addEventListener("click", () => {
  // A skipped question still counts as "seen" for repeat-avoidance —
  // otherwise it just comes right back around, especially in a small
  // pool like a single writing topic.
  if (currentNode) {
    Storage.recordAnswered(state, currentNode.id);
    Storage.saveState(activeProfile.id, state);
  }
  loadNextNode();
});

function finishAnswer(node, result, opts = {}) {
  const { choiceIndex, answerText, enjoyment, aiFeedback } = opts;
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

  showFeedback(result, node, brokenRecords, aiFeedback);
  renderGoalPill();
  if (result.dailyBonus) {
    popXP(result.xpGained, I18n.t("quest.daily_bonus_label", { mult: result.dailyBonus }));
    Sound.bonus();
  } else if (result.combo) {
    popXP(result.xpGained, I18n.t("quest.combo_label", { mult: result.combo }));
    Sound.combo();
  } else if (result.xpGained) {
    popXP(result.xpGained);
  }
  if (result.leveledUp) Sound.levelUp();
  if (result.streakFreezeUsed) {
    queueLightToast({
      icon: "🧊",
      label: I18n.t("streak.freeze_used_label"),
      desc: I18n.t("streak.freeze_used_desc", { n: state.streak.current }),
      sound: () => Sound.achievement(),
    });
  }

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
function showFeedback(result, node, brokenRecords, aiFeedback) {
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
    icon = aiFeedback ? "🔁" : "⏭️";
    headline = aiFeedback ? I18n.t("feedback.creative_retry") : I18n.t("feedback.creative_skipped");
    if (aiFeedback) bodyParts.push(aiFeedback);
  } else if (result.goodOutcome) {
    toneClass = "feedback-good";
    icon = "✨";
    headline = I18n.tRandom("feedback.creative_good", 5);
    if (aiFeedback) bodyParts.push(aiFeedback);
  } else {
    toneClass = "feedback-creative";
    icon = "📝";
    headline = I18n.tRandom("feedback.creative_meh", 3);
    if (aiFeedback) bodyParts.push(aiFeedback);
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
  ids.forEach((id) => toastQueue.push(id));
  processToastQueue();
}

// Same toast element/queue as real achievements, but for lighter, repeatable
// moments (streak freeze used) that shouldn't trigger the full
// confetti+achievement-fanfare treatment every time.
function queueLightToast({ icon, label, desc, sound }) {
  toastQueue.push({ icon, label, desc, sound, light: true });
  processToastQueue();
}

function processToastQueue() {
  if (toastShowing || !toastQueue.length) return;
  toastShowing = true;
  const item = toastQueue.shift();
  const a = typeof item === "string" ? ACHIEVEMENTS[item] : item;
  const toast = $("achievement-toast");
  toast.innerHTML = `<div class="achievement-toast-icon">${a.icon}</div><div><div class="achievement-toast-label">${a.label}</div><div class="achievement-toast-desc">${a.desc}</div></div>`;
  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("show"));
  if (typeof item === "string") {
    Sound.achievement();
    buzz([15, 40, 15]);
    burstConfetti();
  } else {
    if (a.sound) a.sound();
    buzz(15);
  }
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

function popXP(amount, bonusLabel) {
  const pop = document.createElement("div");
  pop.className = "xp-pop" + (bonusLabel ? " xp-pop-bonus" : "");
  if (bonusLabel) {
    pop.innerHTML = `<div>+${amount} XP</div><div class="xp-pop-label">${escapeHTML(bonusLabel)}</div>`;
  } else {
    pop.textContent = `+${amount} XP`;
  }
  $("quest-card").appendChild(pop);
  requestAnimationFrame(() => pop.classList.add("xp-pop-animate"));
  setTimeout(() => pop.remove(), 1400);
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
  setDifficultyDial(activeProfile.difficulty || 2);
  renderThemeToggle();
  renderDomainChips();
  renderStyleMixChoice();
  renderBreadthToggle();
  renderTopicChips();
  renderRegionChips();
  renderSubjectDomainOptions();
  renderSubjectRequests();
  renderReminderState();
  renderExploreRecent();
}

// Hard on/off per domain — unlike topic chips (which narrow within a
// domain), this removes a domain from the pick pool entirely. Always keeps
// at least one enabled so the quest loop never runs dry.
function renderDomainChips() {
  const wrap = $("focus-domains");
  wrap.innerHTML = "";
  DOMAIN_ORDER.forEach((domainId) => {
    const domain = DOMAINS[domainId];
    const active = state.focus.domains.includes(domainId);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "domain-card" + (active ? " domain-card-active" : "");
    card.style.setProperty("--domain-accent", domain.accent);
    card.innerHTML = `
      <div class="domain-card-top">
        <div class="domain-card-icon">${domain.icon}</div>
        <div class="domain-card-toggle"><div class="domain-card-toggle-knob"></div></div>
      </div>
      <div class="domain-card-body">
        <div class="domain-card-title">${escapeHTML(domain.shortLabel)}</div>
        <div class="domain-card-tagline">${escapeHTML(domain.tagline || "")}</div>
      </div>
    `;
    card.addEventListener("click", () => toggleDomain(domainId, card));
    wrap.appendChild(card);
  });
}

function toggleDomain(domainId, cardEl) {
  const list = state.focus.domains;
  const i = list.indexOf(domainId);
  if (i === -1) {
    list.push(domainId);
  } else {
    if (list.length <= 1) {
      cardEl.classList.remove("chip-locked");
      void cardEl.offsetWidth; // restart animation if triggered twice in a row
      cardEl.classList.add("chip-locked");
      return; // never let every domain get disabled
    }
    list.splice(i, 1);
  }
  cardEl.classList.toggle("domain-card-active");
  Storage.saveState(activeProfile.id, state);
}

// Direct, user-set quiz-vs-writing ratio — a single active chip out of the
// four tiers, not an adaptive weight the engine can quietly drift away from.
function renderStyleMixChoice() {
  document.querySelectorAll("#style-mix-choice .chip").forEach((chip) => {
    chip.classList.toggle("chip-active", Number(chip.dataset.value) === state.focus.styleMix);
  });
}

document.querySelectorAll("#style-mix-choice .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.focus.styleMix = Number(chip.dataset.value);
    Storage.saveState(activeProfile.id, state);
    renderStyleMixChoice();
  });
});

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
// The dial's thumb position is just "last level you reset to," not a live
// read of per-domain tier (which can differ per domain — see the Skill
// Tree on the dashboard for that).
function setDifficultyDial(level) {
  document.querySelectorAll(".difficulty-dial-option").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.value) === level);
  });
  $("difficulty-dial-thumb").style.transform = `translateX(${(level - 1) * 100}%)`;
}

document.querySelectorAll(".difficulty-dial-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = Number(btn.dataset.value);
    DOMAIN_ORDER.forEach((d) => (state.tier[d] = level));
    Storage.saveState(activeProfile.id, state);
    setDifficultyDial(level);
    const levelKey = level === 1 ? "difficulty.easy.title" : level === 2 ? "difficulty.medium.title" : "difficulty.hard.title";
    const status = $("difficulty-reset-status");
    status.textContent = I18n.t("focus.difficulty_reset_confirm", { level: I18n.t(levelKey) });
    status.classList.remove("hidden");
  });
});

function renderBreadthToggle() {
  document.querySelectorAll("#breadth-toggle .breadth-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.breadth === state.focus.breadth);
  });
}

document.querySelectorAll("#breadth-toggle .breadth-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.focus.breadth = btn.dataset.breadth;
    Storage.saveState(activeProfile.id, state);
    renderBreadthToggle();
  });
});

// Device-level, like language/mute — applied as early as possible by an
// inline script in index.html's <head> (before first paint, to avoid a
// flash of the wrong theme), and re-applied instantly on toggle here.
function getTheme() {
  return localStorage.getItem("dq:theme") || "dark";
}

function setTheme(theme) {
  localStorage.setItem("dq:theme", theme);
  document.documentElement.dataset.theme = theme;
  renderThemeToggle();
}

function renderThemeToggle() {
  const current = getTheme();
  document.querySelectorAll("#theme-toggle .breadth-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === current);
  });
}

document.querySelectorAll("#theme-toggle .breadth-option").forEach((btn) => {
  btn.addEventListener("click", () => setTheme(btn.dataset.theme));
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
      chip.style.setProperty("--domain-accent", domain.accent);
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

function renderSubjectRequests(justAddedId) {
  const list = $("subject-requests-list");
  list.innerHTML = "";
  [...state.requestedSubjects].reverse().forEach((r) => {
    const row = document.createElement("div");
    row.className = "subject-request-item" + (r.id === justAddedId ? " subject-request-item-new" : "");
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
  Sound.tap();
  renderSubjectRequests(entry.id);
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

// ---------- Rocket Science ----------
// Fixed 3-stage curriculum (js/rocket.js), not the adaptive engine — a
// linear course, not a random pick pool. Finishing a stage drops that
// stage's rocket part (see .rocket-part-dropped in styles.css); finishing
// all three leaves just the capsule and unlocks "mission-complete".

$("open-rocket").addEventListener("click", () => {
  $("rocket-play-view").classList.add("hidden");
  $("rocket-mission-complete-view").classList.add("hidden");
  $("rocket-stage-list-view").classList.remove("hidden");
  renderRocketStageList();
  showScreen("rocket");
});

$("close-rocket").addEventListener("click", () => showScreen("quest"));

function renderRocketIllustration() {
  ROCKET_COURSE.forEach((stage) => {
    if (!stage.part) return; // the capsule (last stage) never drops
    $(`rocket-part-${stage.part}`).classList.toggle("rocket-part-dropped", state.rocketCourse.stagesCompleted.includes(stage.id));
  });
}

function renderRocketStageList() {
  renderRocketIllustration();
  const wrap = $("rocket-stage-cards");
  wrap.innerHTML = "";
  const completed = state.rocketCourse.stagesCompleted;
  ROCKET_COURSE.forEach((stage, i) => {
    const isComplete = completed.includes(stage.id);
    const isLocked = i > 0 && !completed.includes(ROCKET_COURSE[i - 1].id);
    const inProgress = state.rocketCourse.stageIndex === i && state.rocketCourse.nodeIndex > 0 && !isComplete;

    const card = document.createElement("div");
    card.className = "rocket-stage-card" + (isComplete ? " rocket-stage-card-complete" : "") + (isLocked ? " rocket-stage-card-locked" : "");

    const iconEl = document.createElement("div");
    iconEl.className = "rocket-stage-card-icon";
    iconEl.textContent = isComplete ? "✅" : isLocked ? "🔒" : "🚀";
    card.appendChild(iconEl);

    const body = document.createElement("div");
    body.className = "rocket-stage-card-body";
    const title = document.createElement("div");
    title.className = "rocket-stage-card-title";
    title.textContent = stage.title;
    const subtitle = document.createElement("div");
    subtitle.className = "rocket-stage-card-subtitle";
    subtitle.textContent = isLocked ? I18n.t("rocket.stage_locked") : stage.subtitle;
    body.appendChild(title);
    body.appendChild(subtitle);
    card.appendChild(body);

    const action = document.createElement("div");
    action.className = "rocket-stage-card-action";
    if (!isComplete && !isLocked) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary btn-small";
      btn.textContent = I18n.t(inProgress ? "rocket.stage_continue" : "rocket.stage_start");
      btn.addEventListener("click", () => startRocketStage(i));
      action.appendChild(btn);
    }
    card.appendChild(action);

    wrap.appendChild(card);
  });
}

function startRocketStage(stageIndex) {
  if (state.rocketCourse.stageIndex !== stageIndex) {
    state.rocketCourse.stageIndex = stageIndex;
    state.rocketCourse.nodeIndex = 0;
  }
  Storage.saveState(activeProfile.id, state);
  $("rocket-stage-list-view").classList.add("hidden");
  $("rocket-play-view").classList.remove("hidden");
  renderRocketNode();
}

$("rocket-back-to-stages").addEventListener("click", () => {
  $("rocket-play-view").classList.add("hidden");
  $("rocket-stage-list-view").classList.remove("hidden");
  renderRocketStageList();
});

function currentRocketNode() {
  const stage = ROCKET_COURSE[state.rocketCourse.stageIndex];
  return stage.nodes[state.rocketCourse.nodeIndex];
}

function renderRocketNode() {
  const stage = ROCKET_COURSE[state.rocketCourse.stageIndex];
  const node = currentRocketNode();
  $("rocket-progress").textContent = I18n.t("rocket.stage_progress", { n: state.rocketCourse.nodeIndex + 1, total: stage.nodes.length });
  $("rocket-prompt").textContent = node.q;
  $("rocket-feedback").classList.add("hidden");
  $("rocket-next").classList.add("hidden");

  if (node.freeResponse) {
    $("rocket-choices").classList.add("hidden");
    $("rocket-choices").innerHTML = "";
    $("rocket-freeresponse").classList.remove("hidden");
    $("rocket-freeresponse-input").value = "";
    $("rocket-freeresponse-input").disabled = false;
    $("rocket-submit-freeresponse").disabled = false;
    $("rocket-wordcount").textContent = I18n.t("quest.words", { n: 0, target: node.minWords });
  } else {
    $("rocket-freeresponse").classList.add("hidden");
    $("rocket-choices").classList.remove("hidden");
    const choicesEl = $("rocket-choices");
    choicesEl.innerHTML = "";
    node.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="choice-letter">${CHOICE_LETTERS[i]}</span><span>${escapeHTML(choice)}</span>`;
      btn.addEventListener("click", () => handleRocketChoice(node, i, btn));
      choicesEl.appendChild(btn);
    });
  }
}

function handleRocketChoice(node, choiceIndex, btnEl) {
  document.querySelectorAll("#rocket-choices .choice-btn").forEach((b) => (b.disabled = true));
  const isCorrect = choiceIndex === node.answer;
  btnEl.classList.add(isCorrect ? "choice-correct" : "choice-wrong");
  if (!isCorrect) $("rocket-choices").children[node.answer].classList.add("choice-correct");
  isCorrect ? Sound.correct() : Sound.wrong();
  buzz(isCorrect ? 15 : [12, 30, 12]);
  logRocketAnswer(node, { answerText: node.choices[choiceIndex], correct: isCorrect, completed: true });
  showRocketFeedback(node, { correct: isCorrect, completed: true });
}

$("rocket-freeresponse-input").addEventListener("input", () => {
  const node = currentRocketNode();
  const words = $("rocket-freeresponse-input").value.trim().split(/\s+/).filter(Boolean).length;
  $("rocket-wordcount").textContent = I18n.t("quest.words", { n: words, target: node.minWords });
});

$("rocket-submit-freeresponse").addEventListener("click", async () => {
  const node = currentRocketNode();
  const text = $("rocket-freeresponse-input").value.trim();
  $("rocket-freeresponse-input").disabled = true;
  $("rocket-submit-freeresponse").disabled = true;

  if (!text) {
    logRocketAnswer(node, { answerText: null, correct: null, completed: false });
    showRocketFeedback(node, { completed: false });
    return;
  }

  $("rocket-wordcount").textContent = I18n.t("quest.grading");
  const grade = await Grading.gradeFreeResponse({ question: node.q, answer: text, language: I18n.current });
  if (currentRocketNode() !== node) return; // navigated away while grading was in flight
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const completed = grade ? grade.pass : wordCount >= node.minWords;
  logRocketAnswer(node, { answerText: text, correct: null, completed });
  showRocketFeedback(node, { completed, aiFeedback: grade ? grade.feedback : null });
});

function logRocketAnswer(node, { answerText, correct, completed }) {
  Storage.appendAnswerLog(state, {
    nodeId: node.id,
    domain: "rocket",
    style: node.style,
    question: node.q,
    answer: answerText ?? null,
    correct,
    completed,
    enjoyment: null,
    xpGained: 0,
  });
  Cloud.logAnswer(activeProfile, state.answerLog[state.answerLog.length - 1]);
}

function showRocketFeedback(node, { correct, completed, aiFeedback } = {}) {
  const feedback = $("rocket-feedback");
  feedback.innerHTML = "";
  let toneClass, icon, headline;
  const bodyParts = [];

  if (node.style === "rigorous") {
    toneClass = correct ? "feedback-good" : "feedback-miss";
    icon = correct ? "✅" : "💡";
    headline = correct ? I18n.tRandom("feedback.correct", 5) : I18n.tRandom("feedback.incorrect", 5);
    if (node.explain) bodyParts.push(node.explain);
    if (node.source) {
      const dateSuffix = node.verifiedAt ? I18n.t("quest.source_checked", { date: node.verifiedAt }) : "";
      bodyParts.push(I18n.t("quest.source", { name: node.source }) + dateSuffix);
    }
  } else if (!completed) {
    toneClass = "feedback-neutral";
    icon = aiFeedback ? "🔁" : "⏭️";
    headline = aiFeedback ? I18n.t("feedback.creative_retry") : I18n.t("feedback.creative_skipped");
    if (aiFeedback) bodyParts.push(aiFeedback);
  } else {
    toneClass = "feedback-good";
    icon = "✨";
    headline = I18n.tRandom("feedback.creative_good", 5);
    if (aiFeedback) bodyParts.push(aiFeedback);
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
  feedback.classList.remove("hidden");

  $("rocket-next").classList.remove("hidden");
  $("rocket-next").onclick = () => advanceRocketCourse();
}

function advanceRocketCourse() {
  const stageIndex = state.rocketCourse.stageIndex;
  const stage = ROCKET_COURSE[stageIndex];
  const nextNodeIndex = state.rocketCourse.nodeIndex + 1;

  if (nextNodeIndex < stage.nodes.length) {
    state.rocketCourse.nodeIndex = nextNodeIndex;
    Storage.saveState(activeProfile.id, state);
    renderRocketNode();
    return;
  }

  if (!state.rocketCourse.stagesCompleted.includes(stage.id)) {
    state.rocketCourse.stagesCompleted.push(stage.id);
  }
  const isLastStage = stageIndex === ROCKET_COURSE.length - 1;
  state.rocketCourse.stageIndex = isLastStage ? stageIndex : stageIndex + 1;
  state.rocketCourse.nodeIndex = 0;

  let unlocked = [];
  if (isLastStage) {
    unlocked = Storage.unlockAchievement(state, "mission-complete") ? ["mission-complete"] : [];
  }
  Storage.saveState(activeProfile.id, state);

  $("rocket-play-view").classList.add("hidden");
  renderRocketIllustration();

  if (isLastStage) {
    burstConfetti();
    Sound.levelUp();
    $("rocket-mission-complete-view").classList.remove("hidden");
    if (unlocked.length) queueAchievementToasts(unlocked);
  } else {
    Sound.correct();
    $("rocket-stage-list-view").classList.remove("hidden");
    renderRocketStageList();
  }
}

$("rocket-mission-done").addEventListener("click", () => {
  $("rocket-mission-complete-view").classList.add("hidden");
  $("rocket-stage-list-view").classList.remove("hidden");
  renderRocketStageList();
});

// ---------- Explore Anything ----------
// Live AI-generated quiz on literally any topic the user types (roses, a
// religion, fixing an old car) — a standalone flow like Rocket Science,
// not merged into the adaptive engine. js/explore.js handles the Gemini
// call + local cache; this just drives the same node-player pattern
// Rocket Science uses (choices / freeResponse / feedback / next).

let exploreSession = null; // { topic, nodes, index, correctCount }

function explorerDifficulty() {
  const tiers = DOMAIN_ORDER.map((d) => state.tier[d] || 2);
  return Math.round(tiers.reduce((a, b) => a + b, 0) / tiers.length) || 2;
}

function renderExploreRecent() {
  const wrap = $("explore-recent");
  wrap.innerHTML = "";
  const recent = Explore.listRecent().slice(0, 6);
  recent.forEach((entry) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = entry.topic;
    chip.addEventListener("click", () => launchExplore(entry.topic));
    wrap.appendChild(chip);
  });
}

$("explore-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const topic = $("explore-topic-input").value.trim();
  if (!topic) return;
  $("explore-topic-input").value = "";
  launchExplore(topic);
});

function showExploreState(name) {
  ["loading", "error", "play", "done"].forEach((s) => {
    $(`explore-${s}-view`).classList.toggle("hidden", s !== name);
  });
}

async function launchExplore(topic) {
  $("explore-header-title").textContent = `✨ ${topic}`;
  showScreen("explore");
  showExploreState("loading");
  Sound.tap();

  const result = await Explore.generate(topic, I18n.current, explorerDifficulty());

  if (result.error) {
    $("explore-error-text").textContent = I18n.t(
      result.error === "unavailable" ? "focus.explore_error_unavailable" : "focus.explore_error_failed"
    );
    $("explore-retry").classList.remove("hidden");
    $("explore-retry").onclick = () => launchExplore(topic);
    showExploreState("error");
    return;
  }
  if (result.refused) {
    $("explore-error-text").textContent = result.reason || I18n.t("focus.explore_error_failed");
    $("explore-retry").classList.add("hidden");
    showExploreState("error");
    return;
  }

  exploreSession = { topic: result.topic, nodes: result.nodes, index: 0, correctCount: 0 };
  showExploreState("play");
  renderExploreNode();
}

function currentExploreNode() {
  return exploreSession.nodes[exploreSession.index];
}

function renderExploreNode() {
  const node = currentExploreNode();
  $("explore-progress").textContent = I18n.t("rocket.stage_progress", { n: exploreSession.index + 1, total: exploreSession.nodes.length });
  $("explore-prompt").textContent = node.q;
  $("explore-feedback").classList.add("hidden");
  $("explore-next").classList.add("hidden");

  if (node.freeResponse) {
    $("explore-choices").classList.add("hidden");
    $("explore-choices").innerHTML = "";
    $("explore-freeresponse").classList.remove("hidden");
    $("explore-freeresponse-input").value = "";
    $("explore-freeresponse-input").disabled = false;
    $("explore-submit-freeresponse").disabled = false;
    $("explore-wordcount").textContent = I18n.t("quest.words", { n: 0, target: node.minWords });
  } else {
    $("explore-freeresponse").classList.add("hidden");
    $("explore-choices").classList.remove("hidden");
    const choicesEl = $("explore-choices");
    choicesEl.innerHTML = "";
    node.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerHTML = `<span class="choice-letter">${CHOICE_LETTERS[i]}</span><span>${escapeHTML(choice)}</span>`;
      btn.addEventListener("click", () => handleExploreChoice(node, i, btn));
      choicesEl.appendChild(btn);
    });
  }
}

function handleExploreChoice(node, choiceIndex, btnEl) {
  document.querySelectorAll("#explore-choices .choice-btn").forEach((b) => (b.disabled = true));
  const isCorrect = choiceIndex === node.answer;
  btnEl.classList.add(isCorrect ? "choice-correct" : "choice-wrong");
  if (!isCorrect) $("explore-choices").children[node.answer].classList.add("choice-correct");
  isCorrect ? Sound.correct() : Sound.wrong();
  buzz(isCorrect ? 15 : [12, 30, 12]);
  if (isCorrect) exploreSession.correctCount++;
  logExploreAnswer(node, { answerText: node.choices[choiceIndex], correct: isCorrect, completed: true });
  showExploreFeedback(node, { correct: isCorrect, completed: true });
}

$("explore-freeresponse-input").addEventListener("input", () => {
  const node = currentExploreNode();
  const words = $("explore-freeresponse-input").value.trim().split(/\s+/).filter(Boolean).length;
  $("explore-wordcount").textContent = I18n.t("quest.words", { n: words, target: node.minWords });
});

$("explore-submit-freeresponse").addEventListener("click", async () => {
  const node = currentExploreNode();
  const text = $("explore-freeresponse-input").value.trim();
  $("explore-freeresponse-input").disabled = true;
  $("explore-submit-freeresponse").disabled = true;

  if (!text) {
    logExploreAnswer(node, { answerText: null, correct: null, completed: false });
    showExploreFeedback(node, { completed: false });
    return;
  }

  $("explore-wordcount").textContent = I18n.t("quest.grading");
  const grade = await Grading.gradeFreeResponse({ question: node.q, answer: text, language: I18n.current });
  if (currentExploreNode() !== node) return; // navigated away while grading was in flight
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const completed = grade ? grade.pass : wordCount >= node.minWords;
  logExploreAnswer(node, { answerText: text, correct: null, completed });
  showExploreFeedback(node, { completed, aiFeedback: grade ? grade.feedback : null });
});

function logExploreAnswer(node, { answerText, correct, completed }) {
  Storage.appendAnswerLog(state, {
    nodeId: `explore:${exploreSession.topic}:${node.id}`,
    domain: "explore",
    style: node.style,
    question: node.q,
    answer: answerText ?? null,
    correct,
    completed,
    enjoyment: null,
    xpGained: 0,
  });
  Storage.saveState(activeProfile.id, state);
  Cloud.logAnswer(activeProfile, state.answerLog[state.answerLog.length - 1]);
}

function showExploreFeedback(node, { correct, completed, aiFeedback } = {}) {
  const feedback = $("explore-feedback");
  feedback.innerHTML = "";
  let toneClass, icon, headline;
  const bodyParts = [];

  if (node.style === "rigorous") {
    toneClass = correct ? "feedback-good" : "feedback-miss";
    icon = correct ? "✅" : "💡";
    headline = correct ? I18n.tRandom("feedback.correct", 5) : I18n.tRandom("feedback.incorrect", 5);
    if (node.explain) bodyParts.push(node.explain);
  } else if (!completed) {
    toneClass = "feedback-neutral";
    icon = aiFeedback ? "🔁" : "⏭️";
    headline = aiFeedback ? I18n.t("feedback.creative_retry") : I18n.t("feedback.creative_skipped");
    if (aiFeedback) bodyParts.push(aiFeedback);
  } else {
    toneClass = "feedback-good";
    icon = "✨";
    headline = I18n.tRandom("feedback.creative_good", 5);
    if (aiFeedback) bodyParts.push(aiFeedback);
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
  feedback.classList.remove("hidden");

  $("explore-next").classList.remove("hidden");
  $("explore-next").onclick = () => advanceExplore();
}

function advanceExplore() {
  const nextIndex = exploreSession.index + 1;
  if (nextIndex < exploreSession.nodes.length) {
    exploreSession.index = nextIndex;
    renderExploreNode();
    return;
  }
  const gradable = exploreSession.nodes.filter((n) => n.style === "rigorous").length;
  $("explore-done-body").textContent = I18n.t("focus.explore_done_body", {
    score: exploreSession.correctCount,
    total: gradable,
    topic: exploreSession.topic,
  });
  burstConfetti();
  Sound.correct();
  showExploreState("done");
}

$("explore-again").addEventListener("click", () => {
  showScreen("focus");
  renderExploreRecent();
  $("explore-topic-input").focus();
});

$("explore-done-back").addEventListener("click", () => {
  showScreen("focus");
  renderExploreRecent();
});

$("explore-error-back").addEventListener("click", () => showScreen("focus"));

$("close-explore").addEventListener("click", () => {
  showScreen("focus");
  renderExploreRecent();
});

// ---------- Boot ----------

function boot() {
  document.documentElement.lang = I18n.current;
  localizeDomains();
  localizeAchievements();
  localizeQuestions();
  localizeRocketCourse();
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

  // Brief guaranteed splash so it reads as an intentional intro, not a
  // flash — the app underneath is already fully rendered by this point.
  setTimeout(() => {
    $("splash-screen").classList.add("splash-hidden");
    setTimeout(() => $("splash-screen").remove(), 450);
  }, 550);
}

boot();
