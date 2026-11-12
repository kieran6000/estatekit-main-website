import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Starts each new page at the top.
 *
 * Links inside the site swap pages without a reload, so the browser keeps
 * the old scroll position: click a guide at the bottom of the homepage and
 * the guide opened halfway down. This resets it on every forward
 * navigation, jumps to the #section when the link has one, and leaves back
 * and forward alone so the browser can return people to where they were.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
