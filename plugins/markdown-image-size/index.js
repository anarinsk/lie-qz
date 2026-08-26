import { visit } from "unist-util-visit"

const imageSizeRegex = /^(?<alt>.*?)(?:\|\s*(?<width>[1-9]\d*)(?:x(?<height>[1-9]\d*))?\s*)$/

export const MarkdownImageSize = () => {
  return {
    name: "MarkdownImageSize",
    markdownPlugins() {
      return [
        () => {
          return (tree) => {
            visit(tree, "image", (node) => {
              if (typeof node.alt !== "string") return

              const match = imageSizeRegex.exec(node.alt)
              if (!match?.groups?.width) return

              const alt = match.groups.alt.trim()
              const width = match.groups.width
              const height = match.groups.height

              node.alt = alt
              node.data = {
                ...node.data,
                hProperties: {
                  ...(node.data?.hProperties ?? {}),
                  width,
                  ...(height ? { height } : {}),
                },
              }
            })
          }
        },
      ]
    },
  }
}
