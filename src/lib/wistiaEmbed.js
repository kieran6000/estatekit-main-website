/** Raw HTML for a self-loading Wistia embed, for use with dangerouslySetInnerHTML. */
export function wistiaEmbedHtml(id) {
  return `
  <script src="https://fast.wistia.com/embed/${id}.js" async type="module"></script>
  <style>
    wistia-player[media-id='${id}']:not(:defined) {
      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${id}/swatch');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%;
    }
  </style>
  <wistia-player media-id="${id}" seo="false" aspect="1.7777777777777777"></wistia-player>
`;
}
