/**
 * Vite plugin: turns content/resources/*.md into plain data at build time.
 *
 * Each article is Markdown with a small frontmatter block. Parsing happens
 * here, in Node, so the visitor's bundle carries finished HTML and no
 * Markdown parser. See content/resources/README.md for the file format.
 */
import { basename } from "node:path";
import { marked } from "marked";

const REQUIRED = ["title", "description", "slug", "publishedDate", "updatedDate", "shortAnswer"];
const FAQ_HEADING = /^##\s+(FAQ|FAQs|Frequently asked questions)\s*$/im;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

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

/** "### Question" blocks under the FAQ heading become question/answer pairs. */
function parseFaq(md, file) {
  const items = md.split(/^###\s+/m).slice(1);
  if (!items.length) throw new Error(`${file}: the FAQ section needs at least one "### Question" heading`);
  return items.map((chunk) => {
    const [first, ...rest] = chunk.split(/\r?\n/);
    const answerHtml = marked.parse(rest.join("\n").trim());
    return { question: first.trim(), answerHtml, answerText: toText(answerHtml) };
  });
}

export function parseArticle(src, file) {
  const { data, body } = parseFrontmatter(src, file);

  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`${file}: frontmatter is missing "${key}"`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`${file}: slug "${data.slug}" should be lowercase words joined by hyphens`);
  }
  for (const key of ["publishedDate", "updatedDate"]) {
    if (!DATE.test(data[key])) throw new Error(`${file}: ${key} should look like 2026-11-12`);
  }
  // The page title is the only H1; a second one in the body would compete.
  if (/^#\s/m.test(body)) {
    throw new Error(`${file}: don't use "# " headings in the body, the title is already the page's H1. Start sections with "## ".`);
  }

  const split = body.search(FAQ_HEADING);
  if (split === -1) throw new Error(`${file}: add a "## Frequently asked questions" section at the end`);

  const main = body.slice(0, split);
  const faqMd = body.slice(split).replace(FAQ_HEADING, "");

  return {
    ...data,
    html: marked.parse(main.trim()),
    faq: parseFaq(faqMd, file),
  };
}

export default function markdownResources() {
  return {
    name: "estatekit-markdown-resources",
    transform(src, id) {
      if (!id.endsWith(".md") || !id.replace(/\\/g, "/").includes("/content/resources/")) return null;
      if (basename(id).toLowerCase() === "readme.md") return "export default null;";
      return { code: `export default ${JSON.stringify(parseArticle(src, basename(id)))};`, map: null };
    },
  };
}
