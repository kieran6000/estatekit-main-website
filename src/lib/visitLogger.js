import { postDiscordEmbed } from "./discord";

function formatStamp(date) {
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDeviceEmoji(ua) {
  if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "📟";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "📱";
  return "🖥️";
}

/** Logs each page visit (and a 25s-still-here follow-up) to the shared Discord webhook. */
export function initVisitLogger() {
  (async () => {
    const fullUrl = window.location.href;
    const deviceEmoji = getDeviceEmoji(navigator.userAgent);

    let ip = "Unknown IP";
    let city = "Unknown location";
    try {
      const geo = await fetch("https://ipapi.co/json/").then((r) => r.json());
      ip = geo.ip || ip;
      city = [geo.city, geo.country_name].filter(Boolean).join(", ") || city;
    } catch {
      // keep defaults
    }

    postDiscordEmbed(
      {
        description: `${deviceEmoji}  \`${ip}\` | **${city}** | ${fullUrl}`,
        color: 0x57f287,
        footer: { text: formatStamp(new Date()) },
      },
      { username: "visit log" },
    );

    setTimeout(() => {
      postDiscordEmbed(
        {
          description: `⏱️  \`${ip}\` | over 25s on ${fullUrl}`,
          color: 0xfee75c,
          footer: { text: formatStamp(new Date()) },
        },
        { username: "visit log" },
      );
    }, 25000);
  })();
}
