// Per-profile dashboard: skill-tree-style domain bars, streak/time stat
// tiles, session history, and a "what you gravitate toward" read-out.
// Pure render function — takes a container + data, returns nothing, owns
// no state of its own.

const Dashboard = {
  render(container, profile, state) {
    container.innerHTML = "";
    container.appendChild(this.buildHero(state));
    container.appendChild(this.buildStatRow(state));
    container.appendChild(this.buildDomainBars(state));
    container.appendChild(this.buildRecords(state));
    container.appendChild(this.buildTrophyCase(state));
    container.appendChild(this.buildInsight(state));
    container.appendChild(this.buildPeersCard(profile, state));
    container.appendChild(this.buildSyncCard(profile, state, container));
    container.appendChild(this.buildSessionHistory(state));
  },

  buildHero(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-hero";
    const streak = state.streak.current;
    wrap.innerHTML = `
      <div class="dash-hero-value">${streak}</div>
      <div class="dash-hero-label">day streak${streak === 1 ? "" : "s"} — longest run: ${state.streak.longest}</div>
    `;
    return wrap;
  },

  buildStatRow(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-stat-row";
    const totalPrompts = Object.values(state.xp).length ? state.answeredIds.length : 0;
    const sessions = state.sessionHistory.length;
    wrap.innerHTML = `
      <div class="stat-tile"><div class="stat-value">${formatDuration(state.totalTimeMs)}</div><div class="stat-label">time invested</div></div>
      <div class="stat-tile"><div class="stat-value">${sessions}</div><div class="stat-label">session${sessions === 1 ? "" : "s"}</div></div>
      <div class="stat-tile"><div class="stat-value">${totalPrompts}</div><div class="stat-label">prompts logged</div></div>
    `;
    return wrap;
  },

  buildDomainBars(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-domains";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = "Skill tree";
    wrap.appendChild(title);

    DOMAIN_ORDER.forEach((domainId) => {
      const domain = DOMAINS[domainId];
      const xp = state.xp[domainId];
      const { level, progress } = Storage.xpIntoLevel(xp);
      const levelTitle = domain.levels[Math.min(level, domain.levels.length) - 1];

      const row = document.createElement("div");
      row.className = "domain-row";
      row.innerHTML = `
        <div class="domain-row-label">
          <span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span>
          <span>${domain.shortLabel}</span>
          <span class="level-title">${levelTitle}</span>
        </div>
        <div class="meter-track">
          <div class="meter-fill" style="width:${Math.round(progress * 100)}%; background:${domain.accent}"></div>
        </div>
        <div class="domain-row-value">${xp} XP · Lv ${level}</div>
      `;
      wrap.appendChild(row);
    });
    return wrap;
  },

  buildRecords(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-records";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = "Personal bests";
    wrap.appendChild(title);

    const row = document.createElement("div");
    row.className = "dash-stat-row";
    row.innerHTML = `
      <div class="stat-tile"><div class="stat-value">${state.records.bestCorrectStreak}</div><div class="stat-label">best streak</div></div>
      <div class="stat-tile"><div class="stat-value">${state.records.bestSessionXP}</div><div class="stat-label">best session XP</div></div>
      <div class="stat-tile"><div class="stat-value">${state.goalsCompletedCount}</div><div class="stat-label">goals crushed</div></div>
    `;
    wrap.appendChild(row);
    return wrap;
  },

  buildTrophyCase(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-trophies";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = `Trophy case — ${state.achievements.length}/${Object.keys(ACHIEVEMENTS).length}`;
    wrap.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "trophy-grid";
    Object.entries(ACHIEVEMENTS).forEach(([id, a]) => {
      const unlocked = Storage.hasAchievement(state, id);
      const cell = document.createElement("div");
      cell.className = "trophy-cell" + (unlocked ? " trophy-unlocked" : "");
      cell.title = unlocked ? a.desc : "???";
      cell.innerHTML = `<div class="trophy-icon">${unlocked ? a.icon : "🔒"}</div><div class="trophy-label">${unlocked ? a.label : "???"}</div>`;
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);
    return wrap;
  },

  buildInsight(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-insight";
    const top = DOMAIN_ORDER.map((id) => [id, state.affinity.domain[id]]).sort((a, b) => b[1] - a[1])[0];
    if (top && state.answeredIds.length >= 3) {
      const domain = DOMAINS[top[0]];
      wrap.innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> Lately you're gravitating toward <strong>${domain.label}</strong>.`;
    } else {
      wrap.innerHTML = `Not enough signal yet — keep going and this fills in.`;
    }
    return wrap;
  },

  // Anonymous, always-encouraging framing: "ahead of N%" is the only shape
  // this takes — there's no "behind" phrasing, on purpose. Percentiles load
  // async (one RPC per domain) so the card renders instantly with a loading
  // state and fills in as replies land; if cloud sync isn't configured at
  // all, it says so instead of pretending there's a leaderboard.
  buildPeersCard(profile, state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-peers";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = "Vs. everyone else";
    wrap.appendChild(title);

    if (!Cloud.isConfigured()) {
      const p = document.createElement("p");
      p.className = "dash-empty";
      p.textContent = "Cloud sync isn't connected — turn it on to see how you stack up, anonymously.";
      wrap.appendChild(p);
      return wrap;
    }

    const rows = document.createElement("div");
    rows.className = "peer-rows";
    DOMAIN_ORDER.forEach((domainId) => {
      const domain = DOMAINS[domainId];
      const row = document.createElement("div");
      row.className = "peer-row";
      row.innerHTML = `<span class="domain-icon" style="color:${domain.accent}">${domain.icon}</span> <span class="peer-domain">${domain.shortLabel}</span> <span class="peer-value">…</span>`;
      rows.appendChild(row);

      Cloud.getPercentile(domainId, state.xp[domainId]).then((pct) => {
        const valueEl = row.querySelector(".peer-value");
        if (pct == null) {
          valueEl.textContent = "—";
        } else {
          valueEl.textContent = `ahead of ${Math.round(pct)}%`;
        }
      });
    });
    wrap.appendChild(rows);
    return wrap;
  },

  buildSyncCard(profile, state, container) {
    const wrap = document.createElement("div");
    wrap.className = "dash-sync";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = "Cloud sync";
    wrap.appendChild(title);

    if (!Cloud.isConfigured()) {
      const p = document.createElement("p");
      p.className = "dash-empty";
      p.textContent = "Not connected — stats are staying on this device. See docs/CLOUD_SETUP.md to turn it on.";
      wrap.appendChild(p);
      return wrap;
    }

    const code = Cloud.ensureSyncCode(profile);

    const box = document.createElement("div");
    box.className = "sync-box";
    box.innerHTML = `
      <div class="sync-code-label">Your code — enter it on another device to pull these stats in</div>
      <div class="sync-code">${code}</div>
      <form class="restore-form">
        <input type="text" placeholder="Got a code? Restore it" maxlength="20" />
        <button type="submit" class="btn btn-ghost btn-small">Restore</button>
      </form>
      <div class="restore-status"></div>
    `;
    wrap.appendChild(box);

    box.querySelector(".restore-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = box.querySelector("input");
      const status = box.querySelector(".restore-status");
      const value = input.value.trim();
      if (!value) return;
      status.textContent = "Checking…";
      const remote = await Cloud.restoreFromCode(value);
      if (!remote) {
        status.textContent = "No stats found for that code.";
        return;
      }
      DOMAIN_ORDER.forEach((d) => {
        state.xp[d] = Math.max(state.xp[d], (remote.xp && remote.xp[d]) || 0);
      });
      state.streak.current = Math.max(state.streak.current, remote.streak_current || 0);
      state.streak.longest = Math.max(state.streak.longest, remote.streak_longest || 0);
      state.totalTimeMs = Math.max(state.totalTimeMs, remote.total_time_ms || 0);
      Storage.saveState(profile.id, state);
      status.textContent = "Restored — merged in, nothing on this device was lost.";
      this.render(container, profile, state);
    });

    return wrap;
  },

  buildSessionHistory(state) {
    const wrap = document.createElement("div");
    wrap.className = "dash-sessions";
    const title = document.createElement("h3");
    title.className = "dash-section-title";
    title.textContent = "Recent sessions";
    wrap.appendChild(title);

    const recent = [...state.sessionHistory].reverse().slice(0, 8);
    if (!recent.length) {
      const empty = document.createElement("p");
      empty.className = "dash-empty";
      empty.textContent = "Nothing logged yet.";
      wrap.appendChild(empty);
      return wrap;
    }

    const list = document.createElement("div");
    list.className = "session-list";
    recent.forEach((s) => {
      const row = document.createElement("div");
      row.className = "session-row";
      const dots = s.domainsTouched
        .map((id) => `<span class="session-dot" style="background:${DOMAINS[id].accent}" title="${DOMAINS[id].label}"></span>`)
        .join("");
      row.innerHTML = `
        <span class="session-date">${s.date}</span>
        <span class="session-dots">${dots}</span>
        <span class="session-meta">${s.promptsAnswered} prompt${s.promptsAnswered === 1 ? "" : "s"} · ${formatDuration(s.durationMs)}</span>
      `;
      list.appendChild(row);
    });
    wrap.appendChild(list);
    return wrap;
  },
};

function formatDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 1) return "<1m";
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
