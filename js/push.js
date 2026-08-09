// Daily reminder push notifications — a second optional layer on top of
// Cloud, same "no-op until configured, never a hard dependency" rule.
// Reuses window.DISCOVERY_QUEST_CLOUD for the Supabase URL/anon key (same
// project, same REST/RPC pattern as cloud.js) and window.DISCOVERY_QUEST_PUSH
// for the VAPID public key. See docs/PUSH_REMINDERS_SETUP.md — this needs
// sql/push_reminders.sql applied and the send-daily-reminders Edge Function
// deployed + scheduled before it does anything beyond "permission granted."
//
// No accounts here either: a subscription's endpoint URL (from the
// PushManager) is unguessable and unique per browser install, so it's used
// directly as the row's identity — same trust model as everything else in
// this app.

const Push = {
  cloudConfig: null,
  vapidPublicKey: null,

  init() {
    this.cloudConfig = (window.DISCOVERY_QUEST_CLOUD && window.DISCOVERY_QUEST_CLOUD.url && window.DISCOVERY_QUEST_CLOUD.anonKey)
      ? window.DISCOVERY_QUEST_CLOUD
      : null;
    this.vapidPublicKey = (window.DISCOVERY_QUEST_PUSH && window.DISCOVERY_QUEST_PUSH.vapidPublicKey) || null;
  },

  isConfigured() {
    return !!(this.cloudConfig && this.vapidPublicKey);
  },

  isSupported() {
    return this.isConfigured() && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  },

  permission() {
    return "Notification" in window ? Notification.permission : "unsupported";
  },

  headers() {
    return { apikey: this.cloudConfig.anonKey, Authorization: `Bearer ${this.cloudConfig.anonKey}`, "Content-Type": "application/json" };
  },

  urlBase64ToUint8Array(base64) {
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  },

  async getExistingSubscription() {
    if (!this.isSupported()) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg.pushManager.getSubscription();
  },

  // hour/minute are in the device's local time — the server stores the
  // UTC offset alongside them so the sender can figure out when "9am for
  // this person" actually is in UTC.
  async enable(hour, minute) {
    if (!this.isSupported()) return { ok: false, reason: "unsupported" };
    if (Notification.permission === "denied") return { ok: false, reason: "denied" };

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return { ok: false, reason: permission };
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });
    }

    const json = sub.toJSON();
    const utcOffsetMinutes = -new Date().getTimezoneOffset();
    try {
      const res = await fetch(`${this.cloudConfig.url}/rest/v1/rpc/quest_save_push_subscription`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          p_endpoint: json.endpoint,
          p_p256dh: json.keys.p256dh,
          p_auth: json.keys.auth,
          p_hour: hour,
          p_minute: minute,
          p_utc_offset_minutes: utcOffsetMinutes,
        }),
      });
      if (!res.ok) return { ok: false, reason: "server" };
      return { ok: true };
    } catch {
      return { ok: false, reason: "offline" };
    }
  },

  async disable() {
    const sub = await this.getExistingSubscription();
    if (!sub) return true;
    const endpoint = sub.endpoint;
    try {
      await sub.unsubscribe();
    } catch {
      // ignore — still try to clear the server-side row below
    }
    if (this.isConfigured()) {
      try {
        await fetch(`${this.cloudConfig.url}/rest/v1/rpc/quest_delete_push_subscription`, {
          method: "POST",
          headers: this.headers(),
          body: JSON.stringify({ p_endpoint: endpoint }),
        });
      } catch {
        // best-effort — the unsubscribe() above already stops delivery locally
      }
    }
    return true;
  },
};

Push.init();
