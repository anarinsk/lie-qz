import { visit } from "unist-util-visit"

const DEFAULT_OPTIONS = {
  curve: "step",
  fontFamily: "",
  mermaidUrl: "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.17.2/mermaid.esm.min.mjs",
}

const FALLBACK_SANS_FONT =
  '"SUIT Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const isElement = (node) => typeof node === "object" && node !== null && node.type === "element"

const isParent = (node) => typeof node === "object" && node !== null && Array.isArray(node.children)

const hasClassName = (node, className) => {
  const classes = node.properties?.className
  return Array.isArray(classes) && classes.includes(className)
}

const expandButton = () => ({
  type: "element",
  tagName: "button",
  properties: {
    className: ["expand-button"],
    "aria-label": "Expand mermaid diagram",
    "data-view-component": true,
  },
  children: [
    {
      type: "element",
      tagName: "svg",
      properties: {
        width: 16,
        height: 16,
        viewBox: "0 0 16 16",
        fill: "currentColor",
      },
      children: [
        {
          type: "element",
          tagName: "path",
          properties: {
            d: "M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z",
          },
          children: [],
        },
      ],
    },
  ],
})

const mermaidContainer = () => ({
  type: "element",
  tagName: "div",
  properties: { id: "mermaid-container", role: "dialog" },
  children: [
    {
      type: "element",
      tagName: "div",
      properties: { id: "mermaid-space" },
      children: [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["mermaid-content"] },
          children: [],
        },
      ],
    },
  ],
})

const MERMAID_STYLE_CSS = `
.expand-button {
  position: absolute;
  display: flex;
  float: right;
  padding: 0.4rem;
  margin: 0.3rem;
  right: 0;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.expand-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.expand-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.expand-button:focus {
  outline: 0;
}
pre:hover > .expand-button {
  opacity: 1;
  transition: 0.2s;
}
#mermaid-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.5);
}
#mermaid-container.active {
  display: inline-block;
}
#mermaid-container > #mermaid-space {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80vh;
  width: 80vw;
  overflow: hidden;
}
#mermaid-container > #mermaid-space > .mermaid-content {
  position: relative;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  overflow: visible;
  min-height: 200px;
  min-width: 200px;
}
#mermaid-container > #mermaid-space > .mermaid-content pre {
  margin: 0;
  border: none;
}
#mermaid-container > #mermaid-space > .mermaid-content svg {
  max-width: none;
  height: auto;
}
#mermaid-container > #mermaid-space > .mermaid-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: var(--bodyFont);
  transition: all 0.2s ease;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:hover {
  background: var(--lightgray);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:active {
  transform: translateY(1px);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:nth-child(2) {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
`

const createMermaidClientScript = (opts) => {
  const curveJson = JSON.stringify(opts.curve)
  const fontFamilyJson = JSON.stringify(opts.fontFamily)
  const fallbackFontJson = JSON.stringify(FALLBACK_SANS_FONT)
  const mermaidUrlJson = JSON.stringify(opts.mermaidUrl)

  return `
const MERMAID_CURVE = ${curveJson};
const MERMAID_FONT_OVERRIDE = ${fontFamilyJson};
const MERMAID_FALLBACK_FONT = ${fallbackFontJson};
const MERMAID_URL = ${mermaidUrlJson};
const CSS_VARS = [
  "--secondary",
  "--tertiary",
  "--gray",
  "--light",
  "--lightgray",
  "--highlight",
  "--dark",
  "--darkgray",
  "--bodyFont",
];

function registerEscapeHandler(container, cb) {
  if (!container) return;
  function clickHandler(e) {
    if (e.target !== this) return;
    e.preventDefault();
    e.stopPropagation();
    cb();
  }
  function keydownHandler(e) {
    if (!e.key.startsWith("Esc")) return;
    e.preventDefault();
    cb();
  }
  container.addEventListener("click", clickHandler);
  window.addCleanup(() => container.removeEventListener("click", clickHandler));
  document.addEventListener("keydown", keydownHandler);
  window.addCleanup(() => document.removeEventListener("keydown", keydownHandler));
}

function removeAllChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

class DiagramPanZoom {
  constructor(container, content) {
    this.container = container;
    this.content = content;
    this.isDragging = false;
    this.startPan = { x: 0, y: 0 };
    this.currentPan = { x: 0, y: 0 };
    this.scale = 1;
    this.MIN_SCALE = 0.5;
    this.MAX_SCALE = 3;
    this.cleanups = [];
    this.setupEventListeners();
    this.setupNavigationControls();
    this.resetTransform();
  }

  setupEventListeners() {
    const onMouseDown = this.onMouseDown.bind(this);
    const onMouseMove = this.onMouseMove.bind(this);
    const onMouseUp = this.onMouseUp.bind(this);
    const onTouchStart = this.onTouchStart.bind(this);
    const onTouchMove = this.onTouchMove.bind(this);
    const onTouchEnd = this.onTouchEnd.bind(this);
    const onResize = this.resetTransform.bind(this);

    this.container.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    this.container.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    this.cleanups.push(
      () => this.container.removeEventListener("mousedown", onMouseDown),
      () => document.removeEventListener("mousemove", onMouseMove),
      () => document.removeEventListener("mouseup", onMouseUp),
      () => this.container.removeEventListener("touchstart", onTouchStart),
      () => document.removeEventListener("touchmove", onTouchMove),
      () => document.removeEventListener("touchend", onTouchEnd),
      () => window.removeEventListener("resize", onResize),
    );
  }

  cleanup() {
    for (const fn of this.cleanups) fn();
    this.controlsEl?.remove();
  }

  setupNavigationControls() {
    const existing = this.container.querySelector(".mermaid-controls");
    existing?.remove();
    const controls = document.createElement("div");
    controls.className = "mermaid-controls";
    const zoomIn = this.createButton("+", () => this.zoom(0.1));
    const zoomOut = this.createButton("-", () => this.zoom(-0.1));
    const reset = this.createButton("Reset", () => this.resetTransform());
    controls.appendChild(zoomOut);
    controls.appendChild(reset);
    controls.appendChild(zoomIn);
    this.container.appendChild(controls);
    this.controlsEl = controls;
  }

  createButton(label, handler) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "mermaid-control-button";
    btn.addEventListener("click", handler);
    window.addCleanup(() => btn.removeEventListener("click", handler));
    return btn;
  }

  onMouseDown(e) {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.startPan = { x: e.clientX - this.currentPan.x, y: e.clientY - this.currentPan.y };
    this.container.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.currentPan = { x: e.clientX - this.startPan.x, y: e.clientY - this.startPan.y };
    this.updateTransform();
  }

  onMouseUp() {
    this.isDragging = false;
    this.container.style.cursor = "grab";
  }

  onTouchStart(e) {
    if (e.touches.length !== 1) return;
    this.isDragging = true;
    const touch = e.touches[0];
    this.startPan = { x: touch.clientX - this.currentPan.x, y: touch.clientY - this.currentPan.y };
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.currentPan = { x: touch.clientX - this.startPan.x, y: touch.clientY - this.startPan.y };
    this.updateTransform();
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  zoom(delta) {
    const nextScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE);
    const rect = this.content.getBoundingClientRect();
    const dx = rect.width / 2;
    const dy = rect.height / 2;
    const diff = nextScale - this.scale;
    this.currentPan.x -= dx * diff;
    this.currentPan.y -= dy * diff;
    this.scale = nextScale;
    this.updateTransform();
  }

  updateTransform() {
    this.content.style.transform =
      "translate(" + this.currentPan.x + "px, " + this.currentPan.y + "px) scale(" + this.scale + ")";
  }

  resetTransform() {
    const svg = this.content.querySelector("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const width = rect.width / this.scale;
    const height = rect.height / this.scale;
    this.scale = 1;
    this.currentPan = {
      x: (this.container.clientWidth - width) / 2,
      y: (this.container.clientHeight - height) / 2,
    };
    this.updateTransform();
  }
}

let mermaidModule = null;

async function renderMermaidDiagrams() {
  const center = document.querySelector(".center");
  if (!center) return;
  const nodes = center.querySelectorAll("code.mermaid");
  if (nodes.length === 0) return;

  if (!mermaidModule) {
    mermaidModule = await import(MERMAID_URL);
  }
  const mermaid = mermaidModule.default;

  const textMapping = new WeakMap();
  for (const node of nodes) {
    textMapping.set(node, node.textContent ?? "");
  }

  async function renderAll() {
    for (const node of nodes) {
      node.removeAttribute("data-processed");
      const source = textMapping.get(node);
      if (source !== undefined) {
        node.textContent = source;
      }
    }

    const rootStyle = window.getComputedStyle(document.documentElement);
    const vars = CSS_VARS.reduce((acc, key) => {
      acc[key] = rootStyle.getPropertyValue(key).trim();
      return acc;
    }, {});

    const darkMode = document.documentElement.getAttribute("saved-theme") === "dark";
    const fontFamily = MERMAID_FONT_OVERRIDE || vars["--bodyFont"] || MERMAID_FALLBACK_FONT;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: darkMode ? "dark" : "base",
      fontFamily,
      flowchart: {
        curve: MERMAID_CURVE,
      },
      themeVariables: {
        fontFamily,
        primaryColor: vars["--light"],
        primaryTextColor: vars["--darkgray"],
        primaryBorderColor: vars["--tertiary"],
        lineColor: vars["--darkgray"],
        secondaryColor: vars["--secondary"],
        tertiaryColor: vars["--tertiary"],
        clusterBkg: vars["--light"],
        edgeLabelBackground: vars["--highlight"],
      },
    });

    await mermaid.run({ nodes });
  }

  await renderAll();
  document.addEventListener("themechange", renderAll);
  window.addCleanup(() => document.removeEventListener("themechange", renderAll));

  for (let i = 0; i < nodes.length; i++) {
    const codeEl = nodes[i];
    const preEl = codeEl.parentElement;
    if (!preEl) continue;

    const clipboardBtn = preEl.querySelector(".clipboard-button");
    const expandBtn = preEl.querySelector(".expand-button");
    if (expandBtn) {
      if (clipboardBtn) {
        const clipboardStyle = window.getComputedStyle(clipboardBtn);
        const width =
          clipboardBtn.offsetWidth +
          parseFloat(clipboardStyle.marginLeft || "0") +
          parseFloat(clipboardStyle.marginRight || "0");
        expandBtn.style.right = "calc(" + width + "px + 0.3rem)";
      }
      preEl.prepend(expandBtn);
    }

    const popupContainer = preEl.querySelector("#mermaid-container");
    if (!popupContainer || !expandBtn) continue;

    let panZoom = null;
    const showPopup = () => {
      const space = popupContainer.querySelector("#mermaid-space");
      const content = popupContainer.querySelector(".mermaid-content");
      const svg = codeEl.querySelector("svg");
      if (!space || !content || !svg) return;
      removeAllChildren(content);
      content.appendChild(svg.cloneNode(true));
      popupContainer.classList.add("active");
      space.style.cursor = "grab";
      panZoom = new DiagramPanZoom(space, content);
    };
    const hidePopup = () => {
      popupContainer.classList.remove("active");
      panZoom?.cleanup();
      panZoom = null;
    };

    expandBtn.addEventListener("click", showPopup);
    registerEscapeHandler(popupContainer, hidePopup);
    window.addCleanup(() => {
      panZoom?.cleanup();
      expandBtn.removeEventListener("click", showPopup);
    });
  }
}

document.addEventListener("nav", renderMermaidDiagrams);
document.addEventListener("render", renderMermaidDiagrams);
`
}

export const MermaidStyle = (userOpts) => {
  const opts = { ...DEFAULT_OPTIONS, ...userOpts }
  const clientScript = createMermaidClientScript(opts)

  return {
    name: "MermaidStyle",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            visit(tree, "code", (node) => {
              if (node.lang !== "mermaid" || typeof node.value !== "string") return

              file.data.hasMermaidDiagram = true
              node.data = {
                ...node.data,
                hProperties: {
                  ...(node.data?.hProperties ?? {}),
                  className: ["mermaid"],
                  "data-clipboard": JSON.stringify(node.value),
                },
              }
            })
          }
        },
      ]
    },
    htmlPlugins() {
      return [
        () => {
          return (tree) => {
            visit(tree, "element", (node, _index, parent) => {
              if (!isElement(node) || node.tagName !== "code") return
              if (!hasClassName(node, "mermaid")) return
              if (!isParent(parent)) return

              parent.children = [expandButton(), node, mermaidContainer()]
            })
          }
        },
      ]
    },
    externalResources() {
      return {
        js: [
          {
            script: clientScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
            moduleType: "module",
          },
        ],
        css: [
          {
            content: MERMAID_STYLE_CSS,
            inline: true,
          },
        ],
      }
    },
  }
}
