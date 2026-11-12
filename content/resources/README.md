# Resources

Each `.md` file in this folder becomes a page at `/resources/<slug>`. It is
listed on `/resources`, prerendered to static HTML and added to
`sitemap.xml` when the site builds. No component changes needed.

## File format

```md
---
title: How do Meta ads get seller leads for South African estate agents?
description: One or two sentences, 150 to 160 characters. Shown in Google and on /resources.
slug: how-meta-ads-get-seller-leads
publishedDate: 2026-11-12
updatedDate: 2026-11-12
shortAnswer: Two or three sentences that answer the title directly. Shown in the box at the top.
---

Intro paragraph.

## A question-style heading?

Body text. Links to other pages work as normal Markdown: [results](/results).

## Frequently asked questions

### First question?

Answer.

### Second question?

Answer.
```

## Rules the build checks

- All six frontmatter fields are required. Dates are `YYYY-MM-DD`.
- `slug` is lowercase words joined by hyphens. It is the URL, so don't change it once published.
- No `# ` headings in the body. The title is already the page's only H1. Use `## ` for sections.
- The last section must be `## Frequently asked questions`, with each question as a `### ` heading. These feed the FAQ schema.
- Bump `updatedDate` whenever you make a real change. It is shown on the page and in the sitemap.

If any rule is broken, `npm run build` stops and names the file and the problem.

Write without em dashes.
