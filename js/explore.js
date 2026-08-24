// "Drill into anything": lets a user type ANY topic (roses, a religion,
// fixing an old car) and get a real 5-question quiz generated live by
// Gemini via the generate-topic-quiz Edge Function — a standalone flow
// (js/app.js explore screen), not merged into the adaptive engine, same
// spirit as Rocket Science. Results are cached locally by topic+language
// +difficulty so replaying or revisiting a topic doesn't re-hit the API.

const Explore = {
  CACHE_KEY: "dq:explore-cache",
  MAX_CACHED_TOPICS: 15,

  _loadCache() {
    try {
      return JSON.parse(localStorage.getItem(this.CACHE_KEY) || "{}");
    } catch {
      return {};
    }
  },

  _saveCache(cache) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch {
      // storage full or unavailable — cache just won't persist, not fatal
    }
  },

  _cacheKey(topic, language, difficulty) {
    return `${topic.trim().toLowerCase()}|${language}|${difficulty}`;
  },

  // Most recently generated topics, newest first — powers the "recent" chips.
  listRecent() {
    const cache = this._loadCache();
    return Object.values(cache).sort((a, b) => b.generatedAt - a.generatedAt);
  },

  async generate(topic, language, difficulty) {
    const cleanTopic = topic.trim();
    if (!cleanTopic) return { error: "empty" };

    const key = this._cacheKey(cleanTopic, language, difficulty);
    const cache = this._loadCache();
    if (cache[key]) return { ...cache[key], fromCache: true };

    if (!Cloud.isConfigured()) return { error: "unavailable" };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(`${Cloud.config.url}/functions/v1/generate-topic-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic, language, difficulty }),
        signal: controller.signal,
      });
      if (!res.ok) return { error: "failed" };
      const data = await res.json();
      if (data.refused) return { refused: true, reason: data.refusalReason || "" };
      if (!Array.isArray(data.nodes) || !data.nodes.length) return { error: "failed" };

      const entry = { topic: cleanTopic, language, difficulty, nodes: data.nodes, generatedAt: Date.now() };
      cache[key] = entry;
      const keys = Object.keys(cache).sort((a, b) => cache[b].generatedAt - cache[a].generatedAt);
      keys.slice(this.MAX_CACHED_TOPICS).forEach((k) => delete cache[k]);
      this._saveCache(cache);
      return entry;
    } catch {
      return { error: "failed" };
    } finally {
      clearTimeout(timeout);
    }
  },
};
