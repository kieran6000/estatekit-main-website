/** Coarse OS/device/browser sniffing from the user agent, for tracking embeds. */
export function getDeviceInfo() {
  const ua = navigator.userAgent;

  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown";

  const device = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android.*Mobile/.test(ua)
        ? "Android Phone"
        : /Android/.test(ua)
          ? "Android Tablet"
          : window.innerWidth < 768
            ? "Mobile"
            : "Desktop";

  const browser =
    /Chrome/.test(ua) && !/Edg/.test(ua)
      ? "Chrome"
      : /Safari/.test(ua) && !/Chrome/.test(ua)
        ? "Safari"
        : /Firefox/.test(ua)
          ? "Firefox"
          : /Edg/.test(ua)
            ? "Edge"
            : "Other";

  return { os, device, browser };
}

/** Best-effort IP geolocation via ipapi.co. Falls back to "Unknown" on failure. */
export async function getLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const d = await res.json();

    return {
      full: `${d.city}, ${d.region}, ${d.country_name}`,
      countryCode: d.country_code,
    };
  } catch {
    return {
      full: "Unknown",
      countryCode: null,
    };
  }
}

export function formatDuration(seconds) {
  return seconds < 60
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/** ISO 3166-1 alpha-2 country code -> flag emoji (via regional indicator symbols). */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join("");
}

export function formatClicks(clicks) {
  if (!clicks || !clicks.length) return "None";

  return clicks
    .slice(0, 10)
    .map((c) => `• ${c.element} — ${c.text} (${c.at})`)
    .join("\n");
}

/**
 * Rates how engaged a visitor was, 0-100, from the two signals worth reading:
 * dwell time and video watching.
 *
 * Video carries most of the weight because on these pages it is the offer —
 * someone who watched two testimonials through is warmer than someone who left
 * the tab open. Scroll depth was dropped: it rewards flicking to the bottom.
 *
 * @param {object} signals
 * @param {number} signals.seconds - total time on page
 * @param {{ count: number, avgPercent: number }} [signals.video]
 */
export function scoreEngagement({ seconds, video }) {
  const timeScore = Math.min(seconds / 300, 1) * 35;

  const { count = 0, avgPercent = 0 } = video || {};
  // Playing anything at all is worth a floor; depth earns the rest.
  const videoScore =
    count === 0
      ? 0
      : Math.min(15 + count * 5, 30) + Math.min(avgPercent / 100, 1) * 35;

  const score = Math.round(timeScore + videoScore);

  return {
    score,
    band: score >= 75 ? "HOT" : score >= 45 ? "WARM" : score >= 20 ? "COOL" : "COLD",
  };
}

export function generateAvatar(name) {
  const seed = encodeURIComponent(name || "Unknown");
  return `https://api.dicebear.com/7.x/initials/png?seed=${seed}`;
}
