import fs from "fs/promises"
import path from "path"

const defaultOptions = {
  enableSiteMap: true,
  enableRSS: true,
  rssLimit: 10,
  rssSlug: "rss",
  includeEmptyFiles: true,
}

const getDate = (data) => {
  const defaultDateType = data.defaultDateType ?? "modified"
  const dates = data.dates
  return dates?.[defaultDateType] ?? dates?.published ?? dates?.modified ?? dates?.created
}

const normalizeDate = (date) => {
  if (date instanceof Date) return date
  const normalized = new Date(date)
  return Number.isFinite(normalized.getTime()) ? normalized : new Date()
}

const escapeHTML = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

const joinSegments = (...segments) =>
  segments
    .filter((segment) => segment && segment.length > 0)
    .join("/")
    .replace(/\/+/g, "/")

const simplifySlug = (slug) => slug.replace(/\/index$/, "")

const write = async (ctx, slug, ext, content) => {
  const outputPath = path.join(ctx.argv.output, `${slug}${ext}`)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, content)
  return outputPath
}

const buildIndex = (content, options) => {
  const index = new Map()

  for (const [_tree, file] of content) {
    const data = file.data ?? {}
    if (data.unlisted === true) continue

    const slug = data.slug
    if (!slug) continue

    const frontmatter = data.frontmatter ?? {}
    const text = data.text ?? ""
    if (!options.includeEmptyFiles && text === "") continue

    const date = normalizeDate(getDate(data))
    index.set(slug, {
      slug,
      filePath: data.relativePath,
      title: frontmatter.title ?? "",
      links: data.links ?? [],
      tags: frontmatter.tags ?? [],
      content: text,
      date,
      description: data.description ?? "",
    })
  }

  return index
}

const generateSiteMap = (cfg, index) => {
  const base = cfg.baseUrl ?? ""
  const urls = Array.from(index).map(([slug, content]) => {
    const pageSlug = simplifySlug(slug)
    return `<url>
    <loc>https://${joinSegments(base, encodeURI(pageSlug))}</loc>
    <lastmod>${content.date.toISOString()}</lastmod>
  </url>`
  })

  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`
}

const generateRSSFeed = (cfg, index, options) => {
  const base = cfg.baseUrl ?? ""
  const pageTitle = cfg.pageTitle ?? ""
  const items = Array.from(index)
    .sort(([_aSlug, a], [_bSlug, b]) => b.date.getTime() - a.date.getTime())
    .slice(0, options.rssLimit ?? index.size)
    .map(([slug, content]) => {
      const pageSlug = simplifySlug(slug)
      const url = `https://${joinSegments(base, encodeURI(pageSlug))}`
      return `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description><![CDATA[ ${content.description} ]]></description>
    <pubDate>${content.date.toUTCString()}</pubDate>
  </item>`
    })

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeHTML(pageTitle)}</title>
    <link>https://${base}</link>
    <description>Recent notes on ${escapeHTML(pageTitle)}</description>
    <generator>Quartz -- quartz.jzhao.xyz</generator>
    ${items.join("")}
  </channel>
</rss>`
}

const writeAll = async (ctx, content, options) => {
  const cfg = ctx.cfg.configuration
  const index = buildIndex(content, options)
  const outputs = []

  if (options.enableSiteMap) {
    outputs.push(await write(ctx, "sitemap", ".xml", generateSiteMap(cfg, index)))
  }

  if (options.enableRSS) {
    outputs.push(
      await write(ctx, options.rssSlug ?? "rss", ".xml", generateRSSFeed(cfg, index, options)),
    )
  }

  const contentIndex = Object.fromEntries(
    Array.from(index).map(([slug, content]) => [
      slug,
      {
        slug: content.slug,
        filePath: content.filePath,
        title: content.title,
        links: content.links,
        tags: content.tags,
        content: content.content,
        date: content.date.toISOString(),
      },
    ]),
  )
  outputs.push(await write(ctx, "static/contentIndex", ".json", JSON.stringify(contentIndex)))

  return outputs
}

export const ContentIndexDates = (opts) => {
  const options = { ...defaultOptions, ...opts }

  return {
    name: "ContentIndexDates",
    async *emit(ctx, content) {
      for (const output of await writeAll(ctx, content, options)) {
        yield output
      }
    },
    async *partialEmit(ctx, content) {
      for (const output of await writeAll(ctx, content, options)) {
        yield output
      }
    },
  }
}
