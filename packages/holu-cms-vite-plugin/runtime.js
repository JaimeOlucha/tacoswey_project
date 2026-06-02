/**
 * @holu/cms-vite-plugin — runtime
 *
 * Mounts modal and carousel behaviour on pre-rendered HTML.
 * Import once in your main entry file:
 *   import '@holu/cms-vite-plugin/runtime'
 */

function mountCms() {
  // ── Modal ──────────────────────────────────────────────────────────────────

  // Open modal on [data-holu-open="postId"] click
  document.querySelectorAll('[data-holu-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.holuOpen
      const modal = document.getElementById(`holu-modal-${id}`)
      if (!modal) return
      modal.hidden = false
      document.body.style.overflow = 'hidden'
      modal.querySelector('.holu-modal__close')?.focus()
    })
  })

  // Close modal on backdrop or close button click
  document.querySelectorAll('.holu-modal').forEach((modal) => {
    modal.querySelectorAll('[data-holu-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal(modal))
    })
  })

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    document.querySelectorAll('.holu-modal:not([hidden])').forEach(closeModal)
  })

  function closeModal(modal) {
    modal.hidden = true
    document.body.style.overflow = ''
  }

  // ── Carousel ───────────────────────────────────────────────────────────────

  document.querySelectorAll('[data-holu-carousel]').forEach((carousel) => {
    const images = carousel.querySelectorAll('img')
    if (images.length < 2) return

    let current = 0

    const show = (idx) => {
      images[current].hidden = true
      current = (idx + images.length) % images.length
      images[current].hidden = false
    }

    carousel.querySelector('.holu-modal__prev')?.addEventListener('click', () => show(current - 1))
    carousel.querySelector('.holu-modal__next')?.addEventListener('click', () => show(current + 1))

    // Swipe touch support
    let startX = 0
    carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX }, { passive: true })
    carousel.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) show(diff > 0 ? current + 1 : current - 1)
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountCms)
} else {
  mountCms()
}
