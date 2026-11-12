/**
 * WistiaPlayer
 *
 * Renders the <wistia-player> custom element.
 * React 18 passes unknown props straight through to the DOM on custom elements,
 * so we just spread the props. The Wistia embed scripts loaded in index.html
 * upgrade the element once they initialise.
 */
export default function WistiaPlayer({ mediaId, aspect = '1.7777777777777777' }) {
  return (
    <wistia-player
      media-id={mediaId}
      aspect={aspect}
      style={{ display: 'block', width: '100%' }}
      // On a prerendered page Wistia's script can upgrade this element (and
      // stamp a unique-id attribute on it) before React hydrates. The player
      // lives in its own shadow DOM, so that attribute is the only
      // difference and is safe to leave as Wistia set it.
      suppressHydrationWarning
    />
  )
}
