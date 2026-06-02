import { Navigation } from './modules/navigation.js'
import { MenuTabs } from './modules/menu.js'
import { initHoluCms } from './modules/holuCms.js'

document.addEventListener('DOMContentLoaded', () => {
  const nav = new Navigation()
  nav.init()

  if (document.querySelector('.js-menu-tab')) {
    new MenuTabs().init()
  }

  if (document.querySelector('.js-blog-grid')) {
    initHoluCms()
  }
})
