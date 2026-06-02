import { Navigation } from './modules/navigation.js'
import { MenuTabs } from './modules/menu.js'
import { initHoluCms } from './modules/holuCms.js'
import '@holu/cms-vite-plugin/runtime'
import '@holu/cms-vite-plugin/holu-cms.css'

document.addEventListener('DOMContentLoaded', () => {
  const nav = new Navigation()
  nav.init()

  if (document.querySelector('.js-menu-tab')) {
    new MenuTabs().init()
  }
})
