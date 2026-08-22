import { jsx } from "preact/jsx-runtime"

const SHOW_URL = "https://show.lostineconomics.com/"

const classes = (...values) => values.filter(Boolean).join(" ")

export const ShowLink = () => {
  const Component = ({ displayClass }) =>
    jsx("nav", {
      class: classes(displayClass, "show-link"),
      "aria-label": "External links",
      children: jsx("a", {
        href: SHOW_URL,
        target: "_blank",
        rel: "noopener noreferrer",
        children: "SHOW of anari",
      }),
    })

  Component.css = `
.show-link {
  margin-top: auto;
  padding-top: 1.2rem;
  border-top: 1px solid var(--lightgray);
}

.show-link a {
  display: inline-flex;
  align-items: center;
  color: var(--secondary);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
}

.show-link a:hover {
  color: var(--tertiary);
}

@media all and (max-width: 800px) {
  .show-link {
    display: none;
  }
}
`

  return Component
}
