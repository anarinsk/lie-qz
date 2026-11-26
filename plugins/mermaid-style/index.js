import { visit } from "unist-util-visit"

const DEFAULT_OPTIONS = {
  curve: "stepAfter",
  fontFamily: '"SUIT Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

export const MermaidStyle = (userOpts) => {
  const opts = { ...DEFAULT_OPTIONS, ...userOpts }
  const initDirective = `%%{init: ${JSON.stringify({
    flowchart: { curve: opts.curve },
    themeVariables: { fontFamily: opts.fontFamily },
  })}}%%`

  return {
    name: "MermaidStyle",
    markdownPlugins() {
      return [
        () => {
          return (tree) => {
            visit(tree, "code", (node) => {
              if (node.lang !== "mermaid" || typeof node.value !== "string") return

              const trimmed = node.value.trimStart()
              if (trimmed.startsWith("%%{init:") || trimmed.startsWith("---")) return

              node.value = `${initDirective}\n${node.value}`
            })
          }
        },
      ]
    },
  }
}
