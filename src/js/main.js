import { Navigation } from './modules/navigation.js'
import { MenuTabs } from './modules/menu.js'
import { initBlog } from './modules/blog.js'

document.addEventListener('DOMContentLoaded', () => {
  const nav = new Navigation()
  nav.init()

  if (document.querySelector('.js-menu-tab')) {
    new MenuTabs().init()
  }

  if (document.querySelector('.js-blog-grid')) {
    initBlog()
  }
})
