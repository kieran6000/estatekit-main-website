import { createContext } from "react";

/**
 * Where usePageMeta and useJsonLd report when the page is being prerendered.
 *
 * In the browser there is no provider, so this is null and both hooks fall
 * back to editing document.head from an effect, exactly as before. During
 * the build, entry-server.jsx provides a collector's `report` function, the
 * hooks call it while rendering, and the prerender script turns what it
 * gathered into real <head> tags.
 */
export const HeadContext = createContext(null);

export function createHeadCollector() {
  const head = { meta: null, jsonLd: {} };
  head.report = (kind, value, id) => {
    if (kind === "meta") head.meta = value;
    if (kind === "jsonLd") head.jsonLd[id] = value;
  };
  return head;
}
