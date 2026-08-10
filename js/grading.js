// Optional AI-assisted grading for free-response (creative writing)
// answers, via a Supabase Edge Function that calls Gemini — replaces pure
// word-count as the "did they actually try" check, since word count alone
// let "bla bla bla" x 15 pass. Fully optional and non-blocking: if the
// Edge Function is unreachable, slow, or cloud sync isn't configured,
// callers get `null` back and the caller falls back to the word-count
// heuristic that was already there before AI grading existed.

const Grading = {
  async gradeFreeResponse({ question, answer, language }) {
    if (!Cloud.isConfigured()) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${Cloud.config.url}/functions/v1/grade-writing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, language }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (typeof data.pass !== "boolean" || typeof data.feedback !== "string") return null;
      return data;
    } catch {
      return null; // offline, timed out, or function unreachable — quietly fall back
    } finally {
      clearTimeout(timeout);
    }
  },
};
