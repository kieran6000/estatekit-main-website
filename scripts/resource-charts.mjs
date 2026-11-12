/**
 * Draws the bar charts used in the resource guides as static SVG files in
 * content/resources/images. Run with `node scripts/resource-charts.mjs`
 * after updating the numbers below; the guides pick the files up on the next
 * build.
 *
 * Where the numbers come from (pulled 12 November 2026):
 *   COST_BY_AREA  Meta Ads Manager, seller campaigns only, 1 June to
 *                 11 November 2026, one agent per area.
 *   ARRIVALS      Supabase `leads`, Seller pipeline, test leads removed,
 *                 created_at in South African time. 1,829 leads, 28 June to
 *                 12 November 2026.
 *   TIMELINE      The same leads' answer to "how soon would you sell?"
 *                 (1,451 answered).
 *   HOT_BY_REASON The same leads, share answering ASAP or 1 to 3 months,
 *                 grouped by their reason for selling. Reasons with fewer
 *                 than 45 answers are left out.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "resources", "images");

const BRAND = "#0086ff";
const MUTED_BAR = "#b8dcff";
const INK = "#0f172a";
const INK_2 = "#475569";
const INK_3 = "#94a3b8";
const GRID = "#e2e8f0";
const FONT = "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A bar anchored at x0 with only its data end rounded (4px). */
function bar(x0, y, w, h, fill) {
  const r = Math.min(4, w / 2, h / 2);
  return `<path d="M${x0} ${y}h${w - r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - r}z" fill="${fill}"/>`;
}

/**
 * One horizontal bar chart. rows: [{ label, value, text, highlight? }]
 * Values are drawn to scale from zero; `text` is what's printed at the end.
 */
function hbar({ file, title, subtitle, rows, source, max }) {
  const W = 760;
  const labelW = 190;
  const x0 = labelW + 14;
  const plotW = 400;
  const barH = 24;
  const step = 38;
  const top = subtitle ? 92 : 70;
  const plotH = rows.length * step;
  const H = top + plotH + 54;
  const scale = plotW / (max ?? Math.max(...rows.map((r) => r.value)));

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(title)}">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<text x="24" y="40" font-size="21" font-weight="700" fill="${INK}">${esc(title)}</text>`,
  ];
  if (subtitle) parts.push(`<text x="24" y="66" font-size="14" fill="${INK_2}">${esc(subtitle)}</text>`);

  // Baseline
  parts.push(`<line x1="${x0}" y1="${top - 8}" x2="${x0}" y2="${top + plotH - 6}" stroke="${GRID}" stroke-width="1"/>`);

  rows.forEach((r, i) => {
    const y = top + i * step;
    const w = Math.max(2, r.value * scale);
    parts.push(
      `<text x="${labelW}" y="${y + barH / 2 + 5}" font-size="14" fill="${INK}" text-anchor="end">${esc(r.label)}</text>`,
      bar(x0, y, w, barH, r.highlight === false ? MUTED_BAR : BRAND),
      `<text x="${x0 + w + 8}" y="${y + barH / 2 + 5}" font-size="14" font-weight="600" fill="${INK}">${esc(r.text)}</text>`,
    );
    if (r.note) {
      parts.push(`<text x="${x0 + w + 8 + r.text.length * 8.4 + 6}" y="${y + barH / 2 + 5}" font-size="13" fill="${INK_3}">${esc(r.note)}</text>`);
    }
  });

  parts.push(
    `<text x="24" y="${H - 20}" font-size="12" fill="${INK_3}">${esc(source)}</text>`,
    `<text x="${W - 24}" y="${H - 20}" font-size="12" font-weight="700" fill="${INK_3}" text-anchor="end">estatekit.co</text>`,
    "</svg>",
  );
  writeFileSync(join(OUT, file), parts.join("\n"));
  console.log(`  wrote content/resources/images/${file}`);
}

// ── Data ────────────────────────────────────────────────────────────────────

const COST_BY_AREA = [
  { area: "Durban", cpl: 5.12, leads: 1273 },
  { area: "Pietermaritzburg", cpl: 6.78, leads: 196 },
  { area: "Pretoria", cpl: 10.67, leads: 449 },
  { area: "Boksburg", cpl: 13.0, leads: 687 },
  { area: "Cape Town", cpl: 17.79, leads: 471 },
  { area: "Centurion", cpl: 19.59, leads: 117 },
  { area: "Midrand", cpl: 38.88, leads: 186 },
];
const AVERAGE_CPL = 11.68; // R39,476 spent / 3,379 leads, all seven together

const ARRIVALS = [
  ["Midnight to 6am", 132],
  ["6am to 9am", 226],
  ["9am to noon", 285],
  ["Noon to 3pm", 311],
  ["3pm to 6pm", 295],
  ["6pm to 9pm", 357],
  ["9pm to midnight", 223],
];

const TIMELINE = [
  ["As soon as possible", 253, true],
  ["1 to 3 months", 217, true],
  ["3 to 6 months", 198, false],
  ["6 to 12 months", 196, false],
  ["12 months or more", 61, false],
  ["Not sure yet", 507, false],
  ["Not planning to sell", 19, false],
];

const HOT_BY_REASON = [
  ["Relocating", 40.3, 273],
  ["Financial reasons", 39.4, 94],
  ["Inherited property", 28.3, 46],
  ["Retirement", 27.5, 80],
  ["Upgrading", 24.1, 145],
  ["Downsizing", 22.8, 232],
  ["Just curious", 19.2, 52],
];

// ── Charts ──────────────────────────────────────────────────────────────────

const rand = (n) => `R${n.toFixed(2)}`;
const pct = (n, total) => `${((100 * n) / total).toFixed(0)}%`;

hbar({
  file: "chart-cost-per-lead-by-area.svg",
  title: "What a seller lead cost, by area",
  subtitle: "Cost per lead on Facebook and Instagram, seller campaigns, June to November 2026",
  rows: [
    { label: "All 7 areas", value: AVERAGE_CPL, text: rand(AVERAGE_CPL), note: "3,379 leads" },
    ...COST_BY_AREA.map((r) => ({
      label: r.area,
      value: r.cpl,
      text: rand(r.cpl),
      note: `${r.leads.toLocaleString("en-US")} leads`,
      highlight: false,
    })),
  ],
  max: 46,
  source: "Source: EstateKit client ad accounts, 3,379 seller leads",
});

const arrivalTotal = ARRIVALS.reduce((s, [, n]) => s + n, 0);
const peak = Math.max(...ARRIVALS.map(([, n]) => n));
hbar({
  file: "chart-when-seller-leads-arrive.svg",
  title: "When seller leads come in",
  subtitle: "Time of day each lead filled in the form, South African time",
  rows: ARRIVALS.map(([label, n]) => ({
    label,
    value: n,
    text: pct(n, arrivalTotal),
    highlight: n === peak,
  })),
  source: `Source: EstateKit dashboard, ${arrivalTotal.toLocaleString("en-US")} seller leads, June to November 2026`,
});

const timelineTotal = TIMELINE.reduce((s, [, n]) => s + n, 0);
hbar({
  file: "chart-how-soon-sellers-would-sell.svg",
  title: "“If the valuation is good, how soon would you sell?”",
  subtitle: "What homeowners answered on the lead form",
  rows: TIMELINE.map(([label, n, hot]) => ({ label, value: n, text: pct(n, timelineTotal), highlight: hot })),
  source: `Source: EstateKit dashboard, ${timelineTotal.toLocaleString("en-US")} seller leads who answered`,
});

hbar({
  file: "chart-urgency-by-reason.svg",
  title: "Who wants to sell soonest",
  subtitle: "Share planning to sell within 3 months, by reason for selling",
  rows: HOT_BY_REASON.map(([label, p, n], i) => ({
    label,
    value: p,
    text: `${p.toFixed(0)}%`,
    note: `of ${n}`,
    highlight: i < 2,
  })),
  max: 50,
  source: "Source: EstateKit dashboard, seller leads who answered both questions",
});
