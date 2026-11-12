/**
 * Vite plugin: turns content/resources/*.md into plain data at build time.
 *
 * Each article is Markdown with a small frontmatter block. Parsing happens
 * here, in Node, so the visitor's bundle carries finished HTML and no
 * Markdown parser. See content/resources/README.md for the file format.
 *
 * Every article is imported two ways (see src/lib/resources.js):
 *   article.md?meta  frontmatter only, small, bundled with the app so the
 *                    index, related links and page titles work instantly
 *   article.md       the full article, its own file, loaded when someone
 *                    opens it, so 38 guides don't weigh down every page
 *
 * Images (`![alt](images/x.webp "Caption")` and the `image` frontmatter
 * field) become real imports, so Vite fingerprints and serves them like any
 * other asset. Their width and height are read from the file here so the
 * page doesn't jump while they load.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { Marked } from "marked";

const REQUIRED = ["title", "description", "slug", "publishedDate", "updatedDate", "shortAnswer"];
const FAQ_HEADING = /^##\s+(FAQ|FAQs|Frequently asked questions)\s*$/im;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CTAS = ["call", "training", "tool"];
const TOOL_FIELDS = ["ctaHref", "ctaTitle", "ctaButton"];
const IMAGE_TYPES = /\.(webp|png|jpe?g|svg|avif|gif)$/i;

/** Boxes that can be dropped into the body with :::name ... ::: */
const BOXES = {
  mistakes: "Common mistakes",
  proof: "Proof",
};

const escHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `key: value` lines only. Values may be wrapped in single or double quotes. */
function parseFrontmatter(src, file) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- frontmatter --- block at the top`);

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const kv = line.match(/^([A-Za-z]+)\s*:\s*(.*)$/);
    if (!kv) throw new Error(`${file}: can't read frontmatter line "${line}"`);
    data[kv[1]] = kv[2].trim().replace(/^(["'])([\s\S]*)\1$/, "$2");
  }
  return { data, body: match[2] };
}

const toText = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

// ── Image size, read straight from the file header ─────────────────────────

function imageSize(buf, file) {
  // PNG
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  // WebP
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  // JPEG: walk the markers to the first frame header
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  // SVG
  const text = buf.toString("utf8", 0, 2000);
  if (/<svg[\s>]/.test(text)) {
    const w = text.match(/<svg[^>]*\swidth="([\d.]+)"/);
    const h = text.match(/<svg[^>]*\sheight="([\d.]+)"/);
    if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };
    const vb = text.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
  }
  throw new Error(`${file}: can't read the size of this image`);
}

/**
 * Collects the images an article uses. Each one becomes a placeholder in the
 * output that the plugin swaps for an import, so the final URL is whatever
 * Vite gives the file.
 */
function imageRegistry(dir, file) {
  const imports = [];
  return {
    imports,
    add(src, where) {
      if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) {
        throw new Error(`${file}: ${where} "${src}" should be a file in content/resources/images, like images/my-chart.webp`);
      }
      if (!IMAGE_TYPES.test(src)) throw new Error(`${file}: ${where} "${src}" isn't a web image (use .webp, .png, .jpg or .svg)`);
      if (!dir) throw new Error(`${file}: images need the article's folder`);
      const abs = resolve(dir, src);
      if (!existsSync(abs)) throw new Error(`${file}: ${where} "${src}" doesn't exist`);
      const size = imageSize(readFileSync(abs), `${file} (${src})`);
      const rel = `./${src.replace(/\\/g, "/").replace(/^\.\//, "")}`;
      let i = imports.indexOf(rel);
      if (i === -1) i = imports.push(rel) - 1;
      return { token: `__EKIMG_${i}__`, ...size };
    },
  };
}

/** A Markdown parser for one article: tables scroll on phones, images get sizes and captions. */
function articleMarkdown(images, file) {
  const md = new Marked();
  md.use({
    renderer: {
      image({ href, text }) {
        if (!text) throw new Error(`${file}: the image "${href}" needs alt text: ![what it shows](${href})`);
        const img = images.add(href, "image");
        return `<img src="${img.token}" alt="${escHtml(text)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async">`;
      },
      // An image on its own line is a figure, and its "title" is the caption.
      paragraph({ tokens }) {
        const meaningful = tokens.filter((t) => !(t.type === "text" && !t.text.trim()));
        if (meaningful.length === 1 && meaningful[0].type === "image") {
          const img = meaningful[0];
          const caption = img.title ? `<figcaption>${escHtml(img.title)}</figcaption>` : "";
          return `<figure class="ek-figure">${this.parser.parseInline([img])}${caption}</figure>\n`;
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
    },
  });
  return (text) =>
    md
      .parse(text.trim())
      .replace(/<table>/g, '<div class="ek-table"><table>')
      .replace(/<\/table>/g, "</table></div>");
}

/**
 * Splits the body into HTML parts and video parts, and turns :::boxes into
 * HTML along the way.
 *
 *   :::mistakes            a "Common mistakes" box, closed by a line of :::
 *   :::proof Juani         a proof box; anything after the name is its label
 *   :::video abc123 Text   a Wistia video by media id, optional caption
 */
function parseBody(md, file, firstLine, toHtml) {
  const parts = [];
  let buffer = [];
  let box = null;

  const flushHtml = () => {
    const text = buffer.join("\n");
    buffer = [];
    if (text.trim()) parts.push({ html: toHtml(text) });
  };

  const lines = md.split(/\r?\n/);
  lines.forEach((line, i) => {
    const at = `${file} line ${firstLine + i}`;
    const directive = line.match(/^:::\s*([a-z]*)\s*(.*)$/i);

    if (!directive) {
      (box ? box.lines : buffer).push(line);
      return;
    }

    const [, name, rest] = directive;

    if (!name) {
      if (!box) throw new Error(`${at}: found a closing ::: with no box open`);
      flushHtml();
      parts.push({
        html:
          `<aside class="ek-callout ek-callout-${box.name}">` +
          `<p class="ek-callout-label">${escHtml(box.label)}</p>` +
          toHtml(box.lines.join("\n")) +
          "</aside>",
      });
      box = null;
      return;
    }

    if (box) throw new Error(`${at}: close the :::${box.name} box with ::: before starting another`);

    if (name === "video") {
      const [id, ...caption] = rest.trim().split(/\s+/);
      if (!/^[a-z0-9]{10}$/i.test(id || "")) {
        throw new Error(`${at}: ":::video" needs a Wistia media id, like ":::video z6oqli7c8o"`);
      }
      flushHtml();
      parts.push({ video: id, caption: caption.join(" ") });
      return;
    }

    if (!BOXES[name]) {
      throw new Error(`${at}: unknown box ":::${name}". Use ${Object.keys(BOXES).map((b) => `:::${b}`).join(", ")} or :::video`);
    }
    box = { name, label: rest.trim() || BOXES[name], lines: [] };
  });

  if (box) throw new Error(`${file}: the :::${box.name} box is never closed. Add a line with just :::`);
  flushHtml();

  // Only videos need to be their own part; join the HTML between them.
  return parts.reduce((out, part) => {
    const last = out[out.length - 1];
    if (part.html && last?.html) last.html += part.html;
    else out.push({ ...part });
    return out;
  }, []);
}

/** "### Question" blocks under the FAQ heading become question/answer pairs. */
function parseFaq(md, file, toHtml) {
  if (/^:::/m.test(md)) throw new Error(`${file}: boxes and videos can't go in the FAQ. Keep answers to plain text.`);
  const items = md.split(/^###\s+/m).slice(1);
  if (!items.length) throw new Error(`${file}: the FAQ section needs at least one "### Question" heading`);
  return items.map((chunk) => {
    const [first, ...rest] = chunk.split(/\r?\n/);
    const answerHtml = toHtml(rest.join("\n"));
    return { question: first.trim(), answerHtml, answerText: toText(answerHtml) };
  });
}

function checkFrontmatter(data, file, images) {
  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`${file}: frontmatter is missing "${key}"`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`${file}: slug "${data.slug}" should be lowercase words joined by hyphens`);
  }
  for (const key of ["publishedDate", "updatedDate"]) {
    if (!DATE.test(data[key])) throw new Error(`${file}: ${key} should look like 2026-11-12`);
  }

  data.cta ||= "call";
  if (!CTAS.includes(data.cta)) {
    throw new Error(`${file}: cta "${data.cta}" should be one of ${CTAS.join(", ")}`);
  }
  if (data.cta === "tool") {
    for (const key of TOOL_FIELDS) {
      if (!data[key]) throw new Error(`${file}: cta is "tool", so add "${key}" to the frontmatter`);
    }
    if (!data.ctaHref.startsWith("/")) {
      throw new Error(`${file}: ctaHref should be a page on this site, starting with /`);
    }
  }

  if (data.image) {
    if (!data.imageAlt) throw new Error(`${file}: add "imageAlt" describing the cover image`);
    const img = images.add(data.image, "cover image");
    data.image = img.token;
    data.imageWidth = img.width;
    data.imageHeight = img.height;
  }
  return data;
}

/**
 * Parses one article. `dir` is the folder it lives in, for resolving
 * images. `onlyMeta` skips the body, for the `?meta` import.
 */
export function parseArticle(src, file, { dir, onlyMeta = false } = {}) {
  const images = imageRegistry(dir, file);
  const toHtml = articleMarkdown(images, file);
  const { data, body } = parseFrontmatter(src, file);
  checkFrontmatter(data, file, images);

  // The page title is the only H1; a second one in the body would compete.
  if (/^#\s/m.test(body)) {
    throw new Error(`${file}: don't use "# " headings in the body, the title is already the page's H1. Start sections with "## ".`);
  }

  const split = body.search(FAQ_HEADING);
  if (split === -1) throw new Error(`${file}: add a "## Frequently asked questions" section at the end`);

  if (onlyMeta) return { article: data, imports: images.imports };

  // Line numbers in errors count from the top of the file, frontmatter included.
  const firstLine = src.slice(0, src.length - body.length).split("\n").length;
  return {
    article: {
      ...data,
      body: parseBody(body.slice(0, split), file, firstLine, toHtml),
      faq: parseFaq(body.slice(split).replace(FAQ_HEADING, ""), file, toHtml),
    },
    imports: images.imports,
  };
}

/** The module source: an import per image, and the article with each placeholder swapped for its URL. */
function toModule({ article, imports }) {
  const json = JSON.stringify(article).replace(/__EKIMG_(\d+)__/g, (_, i) => `" + __ekimg${i} + "`);
  return [
    ...imports.map((p, i) => `import __ekimg${i} from ${JSON.stringify(p)};`),
    `export default ${json};`,
  ].join("\n");
}

export default function markdownResources() {
  return {
    name: "estatekit-markdown-resources",
    transform(src, id) {
      const [path, query = ""] = id.split("?");
      if (!path.endsWith(".md") || !path.replace(/\\/g, "/").includes("/content/resources/")) return null;
      if (basename(path).toLowerCase() === "readme.md") return "export default null;";

      const onlyMeta = new URLSearchParams(query).has("meta");
      const parsed = parseArticle(src, basename(path), { dir: dirname(path), onlyMeta });
      return { code: toModule(parsed), map: null };
    },
  };
}
