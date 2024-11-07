/**
 * router/index.ts
 *
 * Custom routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'  // for auto-layouts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Pages
import LogIn from '@/pages/accounts/Login.vue'
import AccountCreation from '@/pages/accounts/AccountCreation.vue'
import Index from '@/pages/index.vue'
import Dashboard from '@/pages/dashboard.vue'
import Resources from '@/pages/resources.vue'
import Settings from '@/pages/settings.vue'
import Help from '@/pages/help.vue'
import PasswordPrompt from '@/components/PasswordPrompt.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/Login',
    name: 'Login',
    component: LogIn,
  },
  {
    path: '/CreateAccount',
    name: 'AccountCreation',
    component: AccountCreation,
  },
  {
    path: '/Dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/Help',
    name: 'help',
    component: Help,
  },
  {
    path: '/Resources',
    name: 'resources',
    component: Resources,
  },
  {
    path: '/Settings',
    name: 'settings',
    component: Settings,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (localStorage.getItem('passwordVerified') === 'true') {
        next(); // Proceed
      } else {
        next('/password-prompt'); // Redirect to password verification
      }
    }
  },
  {
    path: '/password-prompt',
    name: 'password-prompt',
    component: PasswordPrompt,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),  // Automatically handles layouts for pages
})

// Handle dynamic import error workaround
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
