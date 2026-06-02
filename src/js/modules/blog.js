import { blogPosts } from './blogData.js'

const EYE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`
const CLOSE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`

function renderCard(post) {
  return `
    <article class="blog__card js-blog-card" data-post-id="${post.id}">
      <div class="blog__card-image-wrapper">
        <img class="blog__card-image" src="${post.image}" alt="${post.title}" loading="lazy">
        <div class="blog__card-image-overlay">
          ${EYE_SVG}
          <span>Leer artículo</span>
        </div>
      </div>
      <div class="blog__card-body">
        <span class="blog__card-tag">${post.tag}</span>
        <span class="blog__card-date">${post.date}</span>
        <h3 class="blog__card-title">${post.title}</h3>
        <p class="blog__card-text">${post.excerpt}</p>
        <span class="blog__card-link">Leer artículo completo →</span>
      </div>
    </article>
  `
}

function renderModal(post) {
  return `
    <div class="modal-overlay js-modal" data-post-id="${post.id}">
      <div class="modal">
        <button class="modal__close js-modal-close" aria-label="Cerrar">${CLOSE_SVG}</button>
        <img class="modal__image" src="${post.image}" alt="${post.title}" loading="lazy">
        <div class="modal__body">
          <span class="modal__date">${post.date}</span>
          <h2 class="modal__title">${post.title}</h2>
          <div class="modal__content">${post.content}</div>
        </div>
      </div>
    </div>
  `
}

export function initBlog() {
  const grid = document.querySelector('.js-blog-grid')
  if (!grid) return

  const container = grid.closest('.section__container')

  // Render cards
  grid.innerHTML = blogPosts.map(renderCard).join('')

  // Render modals after the grid
  blogPosts.forEach((post) => {
    container.insertAdjacentHTML('beforeend', renderModal(post))
  })

  // Wire up click → open modal
  let openModal = null

  function closeModal() {
    if (!openModal) return
    openModal.classList.remove('modal-overlay--open')
    document.body.style.overflow = ''
    openModal = null
  }

  function openModalById(postId) {
    closeModal()
    const modal = document.querySelector(`.js-modal[data-post-id="${postId}"]`)
    if (!modal) return
    openModal = modal
    modal.classList.add('modal-overlay--open')
    document.body.style.overflow = 'hidden'

    modal.querySelector('.js-modal-close').onclick = closeModal
    modal.onclick = (e) => { if (e.target === modal) closeModal() }
  }

  grid.querySelectorAll('.js-blog-card').forEach((card) => {
    card.addEventListener('click', () => openModalById(card.dataset.postId))
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
}
