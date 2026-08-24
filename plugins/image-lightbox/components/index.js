import { jsx } from "preact/jsx-runtime"

const lightboxScript = `
function setupImageLightbox() {
  const images = [...document.querySelectorAll("article img")]

  if (images.length === 0) return

  let overlay = document.querySelector(".image-lightbox-overlay")
  if (!overlay) {
    overlay = document.createElement("div")
    overlay.className = "image-lightbox-overlay"
    overlay.setAttribute("aria-hidden", "true")
    overlay.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="Close image preview">×</button><img alt="" />'
    document.body.appendChild(overlay)
  }

  const preview = overlay.querySelector("img")
  const closeButton = overlay.querySelector(".image-lightbox-close")

  const close = () => {
    overlay.classList.remove("active")
    overlay.setAttribute("aria-hidden", "true")
    document.body.classList.remove("image-lightbox-open")
    preview.removeAttribute("src")
    preview.alt = ""
  }

  const open = (image) => {
    const src = image.currentSrc || image.src
    if (!src) return

    preview.src = src
    preview.alt = image.alt || ""
    overlay.classList.add("active")
    overlay.setAttribute("aria-hidden", "false")
    document.body.classList.add("image-lightbox-open")
  }

  const onKeydown = (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      event.preventDefault()
      close()
    }
  }

  closeButton?.addEventListener("click", close)
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === preview) {
      close()
    }
  })
  document.addEventListener("keydown", onKeydown)

  window.addCleanup?.(() => {
    closeButton?.removeEventListener("click", close)
    document.removeEventListener("keydown", onKeydown)
    overlay.remove()
    document.body.classList.remove("image-lightbox-open")
  })

  for (const image of images) {
    if (image.dataset.lightboxBound === "true") continue
    image.dataset.lightboxBound = "true"
    image.setAttribute("tabindex", "0")
    image.setAttribute("role", "button")
    image.setAttribute("aria-label", image.alt ? image.alt + " 확대" : "이미지 확대")

    const onClick = () => open(image)
    const onImageKeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        open(image)
      }
    }

    image.addEventListener("click", onClick)
    image.addEventListener("keydown", onImageKeydown)

    window.addCleanup?.(() => {
      image.removeEventListener("click", onClick)
      image.removeEventListener("keydown", onImageKeydown)
      delete image.dataset.lightboxBound
      image.removeAttribute("tabindex")
      image.removeAttribute("role")
      image.removeAttribute("aria-label")
    })
  }
}

document.addEventListener("nav", setupImageLightbox)
document.addEventListener("render", setupImageLightbox)
`

export const ImageLightbox = () => {
  const Component = () => jsx("div", { class: "image-lightbox-root", "aria-hidden": "true" })

  Component.afterDOMLoaded = lightboxScript
  Component.css = `
article img {
  cursor: zoom-in;
}

.image-lightbox-root {
  display: none;
}

.image-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(15, 15, 18, 0.82);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease;
}

.image-lightbox-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.image-lightbox-overlay > img {
  max-width: min(100%, 1200px);
  max-height: calc(100vh - 4rem);
  margin: 0;
  border-radius: 5px;
  object-fit: contain;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.35);
  cursor: zoom-out;
}

.image-lightbox-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  color: white;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.image-lightbox-close:hover {
  background: rgba(0, 0, 0, 0.55);
}

body.image-lightbox-open {
  overflow: hidden;
}

@media all and (max-width: 800px) {
  .image-lightbox-overlay {
    padding: 1rem;
  }

  .image-lightbox-overlay > img {
    max-height: calc(100vh - 2rem);
  }
}
`

  return Component
}
