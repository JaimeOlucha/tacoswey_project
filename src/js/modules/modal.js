export class BlogModal {
  constructor() {
    this.openModal = null;
    this._bindEscape();
  }

  open(postId) {
    this.close();
    const modal = document.querySelector(`.js-modal[data-post-id="${postId}"]`);
    if (!modal) return;
    this.openModal = modal;
    modal.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
    this._bindClose(modal);
  }

  close() {
    if (!this.openModal) return;
    this.openModal.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
    this.openModal = null;
  }

  _bindClose(modal) {
    const closeBtn = modal.querySelector('.js-modal-close');
    closeBtn.onclick = () => this.close();
    modal.onclick = (e) => {
      if (e.target === modal) this.close();
    };
  }

  _bindEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
}
