// App shell: screen routing, profile picker, and the quest loop. Talks to
// Storage for persistence and Engine for what comes next; doesn't know
// anything about how affinity math works internally.

const AVATAR_EMOJI = ["🦊", "🐙", "🦂", "🐍", "🦇", "🐺", "🦅", "🐲", "👾", "🛸"];

const els = {};
let activeProfile = null;
let state = null;
let currentNode = null;
let sessionEntry = null;
let sessionTimer = null;
let pendingFreeResponse = null; // { node, wordCount } while waiting on enjoyment tap

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
    addBtn.addEventListener("click", () => {
      list.classList.add("hidden");
      $("new-profile-form").classList.remove("hidden");
      buildEmojiPicker();
    });
    list.appendChild(addBtn);
  }
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
  Storage.saveState(id, state);
  startSessionTimer();
  showScreen("quest");
  renderActiveProfileTag();
  loadNextNode();
}

function renderActiveProfileTag() {
  $("active-profile-tag").innerHTML = `<span class="profile-emoji">${activeProfile.emoji}</span> ${escapeHTML(activeProfile.name)}`;
}

$("new-profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("new-profile-name").value.trim();
  if (!name) return;
  const emoji = $("emoji-picker").getSelected();
  const profile = Storage.createProfile(name, emoji);
  $("new-profile-form").reset();
  $("new-profile-form").classList.add("hidden");
  $("profile-list").classList.remove("hidden");
  selectProfile(profile.id);
});

$("cancel-new-profile").addEventListener("click", () => {
  $("new-profile-form").classList.add("hidden");
  $("profile-list").classList.remove("hidden");
});

$("switch-profile").addEventListener("click", () => {
  endSession();
  activeProfile = null;
  showScreen("profiles");
  $("new-profile-form").classList.add("hidden");
  $("profile-list").classList.remove("hidden");
  renderProfileList();
});

// ---------- Session bookkeeping ----------

function startSessionTimer() {
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(() => flushSessionTime(), 15000);
  window.addEventListener("beforeunload", flushSessionTime);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSessionTime();
  });
}

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
  trackAnswered(node);
  showFeedback(result, node);
  $("next-prompt").classList.remove("hidden");
  $("next-prompt").onclick = () => {
    const branchNext = Engine.followBranch(node, choiceIndex ?? 0);
    currentNode = branchNext || Engine.pickNextNode(state);
    renderNode(currentNode);
  };
  Storage.saveState(activeProfile.id, state);
}

function trackAnswered(node) {
  sessionEntry.promptsAnswered += 1;
  if (!sessionEntry.domainsTouched.includes(node.domain)) sessionEntry.domainsTouched.push(node.domain);
}

function showFeedback(result, node) {
  const feedback = $("quest-feedback");
  const parts = [];
  if (result.xpGained) parts.push(`+${result.xpGained} XP`);
  if (result.leveledUp) parts.push(`Level up`);
  if (node.style === "rigorous") {
    if (node.explain) parts.push(node.explain);
    if (node.source) parts.push(`Source: ${node.source}${node.verifiedAt ? " · checked " + node.verifiedAt : ""}`);
  }
  feedback.textContent = parts.join(" — ");
  feedback.classList.toggle("hidden", parts.length === 0);
}

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
