export class Navigation {
  constructor() {
    this.toggle = document.querySelector('.js-nav-toggle');
    this.menu = document.querySelector('.js-nav-menu');
    this.links = document.querySelectorAll('.js-nav-link');
    this.sections = document.querySelectorAll('.js-scroll-section');
    this.isOpen = false;
  }

  init() {
    this._bindToggle();
    this._bindLinks();
    this._bindClickOutside();
    if (this.sections.length) this._bindScrollSpy();
  }

  _bindToggle() {
    if (!this.toggle || !this.menu) return;
    this.toggle.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });
  }

  _bindLinks() {
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        this._setActive(link);
        if (this.isOpen) this.close();
      });
    });
  }

  _bindClickOutside() {
    document.addEventListener('click', (e) => {
      if (!this.isOpen) return;
      if (!e.target.closest('.js-nav-menu') && !e.target.closest('.js-nav-toggle')) {
        this.close();
      }
    });
  }

  _bindScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.links.forEach((link) => {
            link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    this.sections.forEach((section) => observer.observe(section));
  }

  _setActive(activeLink) {
    this.links.forEach((link) => link.classList.remove('nav__link--active'));
    activeLink.classList.add('nav__link--active');
  }

  open() {
    this.menu.classList.add('nav__menu--open');
    this.toggle.classList.add('nav__toggle--open');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.menu.classList.remove('nav__menu--open');
    this.toggle.classList.remove('nav__toggle--open');
    this.isOpen = false;
    document.body.style.overflow = '';
  }
}
