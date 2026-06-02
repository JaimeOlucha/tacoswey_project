/**
 * @holu/cms-vite-plugin
 *
 * Fetches published CMS posts at build time and injects pre-rendered HTML
 * into any [data-holu-cms] container in index.html.
 *
 * Usage in vite.config.js:
 *   import { holuCms } from '@holu/cms-vite-plugin'
 *   export default { plugins: [holuCms({ slug: 'mi-cliente' })] }
 */

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── HTML generators ────────────────────────────────────────────────────────────

function generateCards(posts) {
  if (!posts.length) {
    return `<div class="holu-empty"><p>Próximamente nuevos proyectos.</p></div>`
  }

  return `<div class="holu-grid">${posts
    .map(
      (p, i) => `
    <article
      class="holu-card"
      style="--holu-delay:${i * 90}ms"
      aria-label="${escHtml(p.title)}"
      ${p.hasDetail ? `data-holu-detail="${escHtml(p.id)}"` : ''}
    >
      ${p.coverImageUrl
        ? `<div class="holu-card__cover">
            <img src="${escHtml(p.coverImageUrl)}" alt="${escHtml(p.title)}" loading="lazy" width="400" height="220">
           </div>`
        : ''}
      <div class="holu-card__body">
        <span class="holu-card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        ${p.tags?.length
          ? `<div class="holu-card__tags">${p.tags
              .slice(0, 3)
              .map((t) => `<span class="holu-card__tag">${escHtml(t)}</span>`)
              .join('')}</div>`
          : ''}
        <h3 class="holu-card__title">${escHtml(p.title)}</h3>
        ${p.description ? `<p class="holu-card__desc">${escHtml(p.description)}</p>` : ''}
        ${p.hasDetail
          ? `<button class="holu-card__cta" type="button" data-holu-open="${escHtml(p.id)}">
               Ver proyecto
               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                 <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
               </svg>
             </button>`
          : ''}
      </div>
    </article>`
    )
    .join('')}</div>`
}

function generateModals(posts) {
  return posts
    .filter((p) => p.hasDetail)
    .map((p) => {
      const images = p.detailImages?.length
        ? p.detailImages
        : p.coverImageUrl
          ? [p.coverImageUrl]
          : []

      const carousel = images.length
        ? `<div class="holu-modal__carousel" data-holu-carousel>
            ${images.map((src, i) => `<img src="${escHtml(src)}" alt="${escHtml(p.title)} imagen ${i + 1}" loading="lazy" ${i > 0 ? 'hidden' : ''}>`).join('')}
            ${images.length > 1
              ? `<button class="holu-modal__prev" aria-label="Anterior">&#8249;</button>
                 <button class="holu-modal__next" aria-label="Siguiente">&#8250;</button>`
              : ''}
           </div>`
        : ''

      return `
    <div
      class="holu-modal"
      id="holu-modal-${escHtml(p.id)}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="holu-modal-title-${escHtml(p.id)}"
      hidden
    >
      <div class="holu-modal__backdrop" data-holu-close></div>
      <div class="holu-modal__panel">
        <button class="holu-modal__close" aria-label="Cerrar" data-holu-close>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        ${carousel}
        <div class="holu-modal__body">
          ${p.tags?.length
            ? `<div class="holu-modal__tags">${p.tags.map((t) => `<span class="holu-card__tag">${escHtml(t)}</span>`).join('')}</div>`
            : ''}
          <h2 class="holu-modal__title" id="holu-modal-title-${escHtml(p.id)}">${escHtml(p.title)}</h2>
          ${p.detailContent ? `<p class="holu-modal__content">${escHtml(p.detailContent)}</p>` : ''}
        </div>
      </div>
    </div>`
    })
    .join('')
}

// ── Plugin ─────────────────────────────────────────────────────────────────────

/**
 * @param {{ slug: string, apiUrl?: string, limit?: number }} options
 */
export function holuCms({ slug, apiUrl = 'https://api.holu.es', limit = 9 } = {}) {
  if (!slug) throw new Error('[holu-cms] slug is required')

  let posts = []

  return {
    name: 'holu-cms',
    enforce: 'pre',

    // Fetch posts once at build start
    async buildStart() {
      const url = `${apiUrl}/public/cms/${encodeURIComponent(slug)}/posts?limit=${limit}`
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        posts = await res.json()
        console.log(`[holu-cms] ✓ ${posts.length} post(s) fetched for slug "${slug}"`)
      } catch (err) {
        console.warn(`[holu-cms] ⚠ Could not fetch posts (${err.message}). Building with empty content.`)
        posts = []
      }
    },

    // Inject pre-rendered HTML into index.html
    transformIndexHtml(html) {
      const cardsHtml = generateCards(posts)
      const modalsHtml = generateModals(posts)

      // Replace content inside [data-holu-cms] container
      // Supports any tag: <section data-holu-cms ...>, <div data-holu-cms ...>, etc.
      const result = html.replace(
        /(<[a-z][^>]*\sdata-holu-cms(?:\s[^>]*)?>)([\s\S]*?)(<\/[a-z]+>)/i,
        (_, open, _inner, close) => `${open}\n${cardsHtml}\n${modalsHtml}\n${close}`
      )

      if (result === html) {
        console.warn('[holu-cms] ⚠ No [data-holu-cms] element found in index.html')
      }

      return result
    },
  }
}
