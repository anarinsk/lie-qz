import { Graph as QuartzGraph } from "@quartz-community/graph/components"

const PATCH_TARGET = "let u=window.location.pathname;return"
const PATCH_REPLACEMENT = "let u=decodeURIComponent(window.location.pathname);return"

function decodeCurrentPath(script) {
  return script.replace(PATCH_TARGET, PATCH_REPLACEMENT)
}

export const Graph = (options) => {
  const Component = QuartzGraph(options)
  Component.afterDOMLoaded = decodeCurrentPath(Component.afterDOMLoaded)
  return Component
}
