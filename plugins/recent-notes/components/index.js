import { RecentNotes as QuartzRecentNotes } from "@quartz-community/recent-notes/components"

const excludedSlugPrefixes = ["test-post/"]
const excludedSlugs = new Set([
  "404",
  "digital-garden",
  "graph-view",
  "index",
  "문서-연결-전략",
  "zz-index",
])

const parseDate = (value) => {
  if (!value) {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value)
  const time = date.getTime()
  return Number.isNaN(time) ? undefined : time
}

const frontmatterTime = (page) => {
  const frontmatter = page.frontmatter ?? {}
  return (
    parseDate(frontmatter.modified) ??
    parseDate(frontmatter.published) ??
    parseDate(frontmatter.created) ??
    parseDate(frontmatter.date)
  )
}

const quartzTime = (page) => {
  const type = page.defaultDateType
  return (
    (type ? parseDate(page.dates?.[type]) : undefined) ??
    parseDate(page.dates?.modified) ??
    parseDate(page.dates?.published) ??
    parseDate(page.dates?.created)
  )
}

const recentTime = (page) => {
  return frontmatterTime(page) ?? quartzTime(page) ?? 0
}

const hasFrontmatterDate = (page) => frontmatterTime(page) !== undefined

const isDraft = (page) => page.frontmatter?.draft === true

const isBlogPost = (page) => {
  const slug = page.slug ?? ""

  if (!slug || excludedSlugs.has(slug) || isDraft(page)) {
    return false
  }

  return !excludedSlugPrefixes.some((prefix) => slug.startsWith(prefix))
}

const sortByRecentDate = (a, b) => {
  const frontmatterRankDiff = Number(hasFrontmatterDate(b)) - Number(hasFrontmatterDate(a))
  if (frontmatterRankDiff !== 0) {
    return frontmatterRankDiff
  }

  const timeDiff = recentTime(b) - recentTime(a)
  if (timeDiff !== 0) {
    return timeDiff
  }

  const aTitle = (a.frontmatter?.title ?? "").toLowerCase()
  const bTitle = (b.frontmatter?.title ?? "").toLowerCase()
  return aTitle.localeCompare(bTitle)
}

export const RecentNotes = (options = {}) =>
  QuartzRecentNotes({
    ...options,
    filter: isBlogPost,
    sort: sortByRecentDate,
    hideTagPages: true,
    hideFolderPages: true,
  })
