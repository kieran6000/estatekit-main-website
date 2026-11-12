/**
 * The moment a prerendered page was built.
 *
 * Anything that shows a date (the booking calendar's month, a footer year)
 * has to render exactly what is in the static HTML on the browser's first
 * pass, or hydration fails. So the build records its own time on the root
 * element, the browser renders that same moment first, and components that
 * care move on to the real date right after mounting.
 *
 * Unset in a normal client-only render, so new Date() is used as before.
 */
let frozen = null;

export function setRenderTime(ms) {
  frozen = Number.isFinite(ms) ? ms : null;
}

/** Called once the hydrated tree has mounted. */
export function clearRenderTime() {
  frozen = null;
}

export function firstRenderNow() {
  return frozen === null ? new Date() : new Date(frozen);
}
