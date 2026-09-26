import { useEffect } from "react";

/**
 * Injects a JSON-LD <script> for the current route and removes it on unmount.
 *
 * Structured data is what lets Google show a star rating, review count and
 * organisation detail directly in the result — on a page that is mostly
 * screenshots, it is the difference between "indexed" and "understood".
 *
 * @param {object|object[]} schema - one schema.org object, or several
 * @param {string} id - element id so repeat renders replace rather than stack
 */
export function useJsonLd(schema, id = "ek-jsonld") {
  useEffect(() => {
    if (!schema) return;

    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    el.textContent = JSON.stringify(schema);

    document.getElementById(id)?.remove();
    document.head.appendChild(el);

    return () => el.remove();
  }, [schema, id]);
}
