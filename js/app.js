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

  if (Storage.canCreateProfile()) {
    const addBtn = document.createElement("button");
    addBtn.className = "profile-chip profile-chip-add";
    addBtn.textContent = "+ New profile";
    addBtn.addEventListener("click", startOnboarding);
    list.appendChild(addBtn);
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
  $("onboarding-back").textContent = onboardingStepIndex === 0 ? "Cancel" : "Back";
  $("onboarding-next").textContent = onboardingStepIndex === ONBOARDING_STEPS.length - 1 ? "Let's go" : "Next";
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
  selectProfile(profile.id);
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

function selectProfile(id) {
  activeProfile = Storage.listProfiles().find((p) => p.id === id);
  Storage.setActiveProfileId(id);
  state = Storage.getState(id);
  sessionEntry = Storage.startSessionEntry(state);
  sessionEntry.xpGained = 0;
  Storage.saveState(id, state);
  startSessionTimer();
  showScreen("quest");
  renderActiveProfileTag();
  renderGoalPill();
  loadNextNode();
}

function renderGoalPill() {
  const progress = Storage.sessionGoalProgress(state, sessionEntry);
  const current = progress.type === "time" ? Math.floor(progress.current) : progress.current;
  const unit = progress.type === "time" ? "min" : "today";
  $("goal-pill").textContent = `${progress.met ? "✅" : "🎯"} ${current}/${progress.target} ${unit}`;
  $("goal-pill").classList.toggle("goal-pill-met", progress.met);
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

function renderNode(node) {
  const domain = DOMAINS[node.domain];
  $("domain-badge").innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> ${domain.label}`;
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
    $("wordcount").textContent = `0 / ${node.minWords} words`;
  } else {
    $("quest-freeresponse").classList.add("hidden");
    $("quest-choices").classList.remove("hidden");
    const choicesEl = $("quest-choices");
    choicesEl.innerHTML = "";
    node.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice;
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
    const result = Engine.recordResponse(state, node, { choiceIndex });
    finishAnswer(node, result);
  } else if (node.next) {
    // Branching writing choice: always "completes", no wrong path.
    $("quest-choices").children[choiceIndex].classList.add("choice-correct");
    const result = Engine.recordResponse(state, node, { completed: true, enjoyment: 3 });
    finishAnswer(node, result, choiceIndex);
  }
}

$("freeresponse-input").addEventListener("input", () => {
  const words = $("freeresponse-input").value.trim().split(/\s+/).filter(Boolean).length;
  $("wordcount").textContent = `${words} / ${currentNode.minWords} words`;
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
    finishAnswer(currentNode, result);
    return;
  }

  pendingFreeResponse = { node: currentNode, completed };
  $("enjoyment-picker").classList.remove("hidden");
});

document.querySelectorAll(".enjoyment-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const enjoyment = Number(btn.dataset.value);
    $("enjoyment-picker").classList.add("hidden");
    const { node, completed } = pendingFreeResponse;
    const result = Engine.recordResponse(state, node, { completed, enjoyment });
    finishAnswer(node, result);
  });
});

$("skip-prompt").addEventListener("click", () => {
  loadNextNode();
});

function finishAnswer(node, result, choiceIndex) {
  trackAnswered(node, result.xpGained);

  const brokenRecords = Storage.updateRecords(state, {
    correctStreak: state.correctStreak,
    sessionXP: sessionEntry.xpGained,
    sessionPrompts: sessionEntry.promptsAnswered,
  });
  let unlockedAchievements = Achievements.evaluate(state, { sessionEntry, goodOutcome: result.goodOutcome });

  showFeedback(result, node, brokenRecords);
  renderGoalPill();

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

function showFeedback(result, node, brokenRecords) {
  const feedback = $("quest-feedback");
  const parts = [];
  if (result.xpGained) parts.push(`+${result.xpGained} XP`);
  if (result.leveledUp) parts.push(`Level up`);
  if (brokenRecords && brokenRecords.includes("bestCorrectStreak") && state.correctStreak > 1) {
    parts.push(`New best streak: ${state.correctStreak}`);
  }
  if (node.style === "rigorous") {
    if (node.explain) parts.push(node.explain);
    if (node.source) parts.push(`Source: ${node.source}${node.verifiedAt ? " · checked " + node.verifiedAt : ""}`);
  }
  feedback.textContent = parts.join(" — ");
  feedback.classList.toggle("hidden", parts.length === 0);

  if (result.leveledUp && Cloud.isConfigured()) {
    Cloud.getPercentile(node.domain, state.xp[node.domain]).then((pct) => {
      if (pct == null) return;
      const extra = document.createElement("div");
      extra.className = "level-up-percentile";
      extra.textContent = `Now ahead of ${Math.round(pct)}% of explorers in ${DOMAINS[node.domain].shortLabel}.`;
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
  const label = progress.type === "time" ? `${Math.round(progress.current)} minutes` : `${progress.current} prompts`;
  $("goal-complete-body").textContent = `${label} in today — that's the goal. Keep going if you're into it, or call it there.`;
  $("goal-complete-overlay").dataset.pending = JSON.stringify(pendingAchievementIds || []);
  $("goal-complete-overlay").classList.remove("hidden");
}

$("goal-complete-dismiss").addEventListener("click", () => {
  $("goal-complete-overlay").classList.add("hidden");
  const pending = JSON.parse($("goal-complete-overlay").dataset.pending || "[]");
  if (pending.length) queueAchievementToasts(pending);
});

// ---------- Focus: what to drill into ----------

$("open-focus").addEventListener("click", () => {
  renderFocusScreen();
  showScreen("focus");
});

$("close-focus").addEventListener("click", () => {
  showScreen("quest");
});

function renderFocusScreen() {
  renderBreadthToggle();
  renderTopicChips();
  renderRegionChips();
  renderSubjectDomainOptions();
  renderSubjectRequests();
}

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
    row.innerHTML = `<span class="domain-icon" style="color:${DOMAINS[r.domain].accent}">${DOMAINS[r.domain].icon}</span> <span>${escapeHTML(r.text)}</span> <span class="subject-request-status">queued</span>`;
    list.appendChild(row);
  });
  if (!state.requestedSubjects.length) {
    const empty = document.createElement("p");
    empty.className = "dash-empty";
    empty.textContent = "Nothing queued yet.";
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
