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
 */
import { basename } from "node:path";
import { marked } from "marked";

const REQUIRED = ["title", "description", "slug", "publishedDate", "updatedDate", "shortAnswer"];
const FAQ_HEADING = /^##\s+(FAQ|FAQs|Frequently asked questions)\s*$/im;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CTAS = ["call", "training", "tool"];
const TOOL_FIELDS = ["ctaHref", "ctaTitle", "ctaButton"];

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

/** Markdown to HTML, with tables wrapped so wide ones scroll on a phone. */
const toHtml = (md) =>
  marked
    .parse(md.trim())
    .replace(/<table>/g, '<div class="ek-table"><table>')
    .replace(/<\/table>/g, "</table></div>");

/**
 * Splits the body into HTML parts and video parts, and turns :::boxes into
 * HTML along the way.
 *
 *   :::mistakes            a "Common mistakes" box, closed by a line of :::
 *   :::proof Juani         a proof box; anything after the name is its label
 *   :::video abc123 Text   a Wistia video by media id, optional caption
 */
function parseBody(md, file, firstLine) {
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
function parseFaq(md, file) {
  if (/^:::/m.test(md)) throw new Error(`${file}: boxes and videos can't go in the FAQ. Keep answers to plain text.`);
  const items = md.split(/^###\s+/m).slice(1);
  if (!items.length) throw new Error(`${file}: the FAQ section needs at least one "### Question" heading`);
  return items.map((chunk) => {
    const [first, ...rest] = chunk.split(/\r?\n/);
    const answerHtml = toHtml(rest.join("\n"));
    return { question: first.trim(), answerHtml, answerText: toText(answerHtml) };
  });
}

function checkFrontmatter(data, file) {
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
  return data;
}

export function parseArticle(src, file) {
  const { data, body } = parseFrontmatter(src, file);
  checkFrontmatter(data, file);

  // The page title is the only H1; a second one in the body would compete.
  if (/^#\s/m.test(body)) {
    throw new Error(`${file}: don't use "# " headings in the body, the title is already the page's H1. Start sections with "## ".`);
  }

  const split = body.search(FAQ_HEADING);
  if (split === -1) throw new Error(`${file}: add a "## Frequently asked questions" section at the end`);

  return {
    meta: data,
    // Line numbers in errors count from the top of the file, frontmatter included.
    body: parseBody(body.slice(0, split), file, src.slice(0, src.length - body.length).split("\n").length),
    faq: parseFaq(body.slice(split).replace(FAQ_HEADING, ""), file),
  };
}

export default function markdownResources() {
  return {
    name: "estatekit-markdown-resources",
    transform(src, id) {
      const [path, query = ""] = id.split("?");
      if (!path.endsWith(".md") || !path.replace(/\\/g, "/").includes("/content/resources/")) return null;
      if (basename(path).toLowerCase() === "readme.md") return "export default null;";

      const { meta, body, faq } = parseArticle(src, basename(path));
      const out = new URLSearchParams(query).has("meta") ? meta : { ...meta, body, faq };
      return { code: `export default ${JSON.stringify(out)};`, map: null };
    },
  };
}
