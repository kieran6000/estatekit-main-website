import { useCallback, useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

/**
 * Initializes a Cal.com embed namespace: applies the shared brand theming
 * and wires up bookingSuccessful/bookingFailed listeners.
 *
 * `namespace` must match the `namespace` prop passed to the rendered
 * <Cal /> component — the theme/listeners are scoped per-namespace by the
 * Cal.com embed API and silently no-op otherwise.
 *
 * The callbacks are read via ref so the effect only re-initializes when
 * `namespace` itself changes, not on every render that passes a new inline
 * callback.
 *
 * Returns `preload`, which fetches the booking page's availability ahead of
 * the embed being rendered. Pass `calLink` to use it.
 */
export function useCalBooking({
  namespace,
  calLink,
  onBookingSuccessful,
  onBookingFailed,
}) {
  const callbacksRef = useRef({ onBookingSuccessful, onBookingFailed });
  useEffect(() => {
    callbacksRef.current = { onBookingSuccessful, onBookingFailed };
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;

      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#0086ff" },
          dark: { "cal-brand": "#0086ff" },
        },
        hideEventTypeDetails: true,
        layout: "month_view",
      });

      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => callbacksRef.current.onBookingSuccessful?.(e),
      });
      cal("on", {
        action: "bookingFailed",
        callback: (e) => callbacksRef.current.onBookingFailed?.(e),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [namespace]);

  const preloadedRef = useRef(false);

  const preload = useCallback(() => {
    if (preloadedRef.current || !calLink) return;
    preloadedRef.current = true;

    getCalApi({ namespace })
      .then((cal) => cal("preload", { calLink }))
      .catch(() => {
        // A warm-up failing is not worth surfacing — the embed still loads
        // normally on mount, just without the head start.
        preloadedRef.current = false;
      });
  }, [namespace, calLink]);

  return { preload };
}
