/**
 * holuCms.js — Tacos Wey
 * Carga las entradas del blog desde la API pública de holu
 * y las renderiza usando las clases CSS existentes del proyecto.
 *
 * API: https://api.holu.es/public/cms/tacoswey/posts
 */

const API_URL = 'https://api.holu.es/public/cms/tacoswey/posts'

const EYE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
const CLOSE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function renderCard(post) {
  const tag = post.tags?.[0] ?? ''
  const date = formatDate(post.publishedAt)
  return `
    <article class="blog__card js-holu-card" data-post-id="${post.id}">
      <div class="blog__card-image-wrapper">
        ${post.coverImageUrl
          ? `<img class="blog__card-image" src="${post.coverImageUrl}" alt="${post.title}" loading="lazy">`
          : `<div class="blog__card-image blog__card-image--placeholder"></div>`}
        <div class="blog__card-image-overlay">
          ${EYE_SVG}
          <span>Leer artículo</span>
        </div>
      </div>
      <div class="blog__card-body">
        ${tag ? `<span class="blog__card-tag">${tag}</span>` : ''}
        <span class="blog__card-date">${date}</span>
        <h3 class="blog__card-title">${post.title}</h3>
        <p class="blog__card-text">${post.description ?? ''}</p>
        ${post.hasDetail ? `<span class="blog__card-link">Leer artículo completo →</span>` : ''}
      </div>
    </article>
  `
}

function renderModal(post) {
  const date = formatDate(post.publishedAt)
  return `
    <div class="modal-overlay js-holu-modal" data-post-id="${post.id}">
      <div class="modal">
        <button class="modal__close js-modal-close" aria-label="Cerrar">${CLOSE_SVG}</button>
        ${post.coverImageUrl
          ? `<img class="modal__image" src="${post.coverImageUrl}" alt="${post.title}" loading="lazy">`
          : ''}
        <div class="modal__body">
          <span class="modal__date">${date}</span>
          <h2 class="modal__title">${post.title}</h2>
          <div class="modal__content">${post.detailContent ?? `<p>${post.description ?? ''}</p>`}</div>
        </div>
      </div>
    </div>
  `
}

function renderEmpty(grid) {
  grid.innerHTML = `
    <p class="blog__empty">No hay entradas publicadas todavía. ¡Vuelve pronto!</p>
  `
}

function renderError(grid) {
  grid.innerHTML = `
    <p class="blog__empty">No se pudieron cargar las entradas. Inténtalo más tarde.</p>
  `
}

export async function initHoluCms() {
  const grid = document.querySelector('.js-blog-grid')
  if (!grid) return

  const container = grid.closest('.section__container')

  // Loading state
  grid.innerHTML = `<p class="blog__loading">Cargando entradas...</p>`

  let posts
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    posts = await res.json()
  } catch {
    renderError(grid)
    return
  }

  if (!posts.length) {
    renderEmpty(grid)
    return
  }

  // Render cards
  grid.innerHTML = posts.map(renderCard).join('')

  // Render modals (solo los que tienen detalle)
  posts.filter((p) => p.hasDetail).forEach((post) => {
    container.insertAdjacentHTML('beforeend', renderModal(post))
  })

  // Modal logic
  let openModal = null

  function closeModal() {
    if (!openModal) return
    openModal.classList.remove('modal-overlay--open')
    document.body.style.overflow = ''
    openModal = null
  }

  function openModalById(postId) {
    closeModal()
    const modal = document.querySelector(`.js-holu-modal[data-post-id="${postId}"]`)
    if (!modal) return
    openModal = modal
    modal.classList.add('modal-overlay--open')
    document.body.style.overflow = 'hidden'
    modal.querySelector('.js-modal-close').onclick = closeModal
    modal.onclick = (e) => { if (e.target === modal) closeModal() }
  }

  grid.querySelectorAll('.js-holu-card').forEach((card) => {
    const post = posts.find((p) => p.id === card.dataset.postId)
    if (post?.hasDetail) {
      card.addEventListener('click', () => openModalById(card.dataset.postId))
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
}
