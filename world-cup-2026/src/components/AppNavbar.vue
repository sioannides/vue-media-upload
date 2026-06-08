<template>
  <nav class="sticky top-0 z-50 bg-surface-800 border-b border-surface-600" style="backdrop-filter: blur(12px);">
    <!-- Top bar -->
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 no-underline">
        <span class="text-2xl">⚽</span>
        <span class="font-black text-lg tracking-tight" style="color:#F4A820;">WC<span class="text-white">2026</span></span>
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden lg:flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline"
          :class="isActive(item.to) ? 'text-wc-gold bg-wc-gold/10' : 'text-gray-300 hover:text-white hover:bg-surface-700'"
        >{{ $t(item.label) }}</router-link>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-2">
        <!-- Language selector -->
        <select
          v-model="currentLocale"
          class="bg-surface-700 border border-surface-500 text-white text-xs rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
          @change="changeLocale"
        >
          <option value="en">🇬🇧 EN</option>
          <option value="es">🇪🇸 ES</option>
          <option value="fr">🇫🇷 FR</option>
          <option value="pt">🇵🇹 PT</option>
        </select>

        <!-- Theme toggle -->
        <button
          @click="themeStore.toggle()"
          class="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-gray-300"
          :title="$t(themeStore.isDark ? 'common.light' : 'common.dark')"
        >
          <span>{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
        </button>

        <!-- Mobile menu toggle -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-up">
      <div v-if="mobileOpen" class="lg:hidden bg-surface-800 border-t border-surface-600 px-4 py-3">
        <div class="grid grid-cols-2 gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline text-center"
            :class="isActive(item.to) ? 'text-wc-gold bg-wc-gold/10' : 'text-gray-300 hover:text-white hover:bg-surface-700'"
            @click="mobileOpen = false"
          >{{ $t(item.label) }}</router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script>
import { useThemeStore } from '../stores/theme.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AppNavbar',
  setup() {
    const themeStore = useThemeStore()
    const { locale } = useI18n()
    return { themeStore, locale }
  },
  data() {
    return {
      mobileOpen: false,
      currentLocale: localStorage.getItem('wc2026_lang') || 'en',
      navItems: [
        { to: '/', label: 'nav.home' },
        { to: '/groups', label: 'nav.groups' },
        { to: '/matches', label: 'nav.matches' },
        { to: '/players', label: 'nav.players' },
        { to: '/bracket', label: 'nav.bracket' },
        { to: '/predictor', label: 'nav.predictor' },
        { to: '/h2h', label: 'nav.h2h' },
        { to: '/history', label: 'nav.history' },
        { to: '/fantasy', label: 'nav.fantasy' },
        { to: '/stadiums', label: 'nav.stadiums' },
        { to: '/simulator', label: 'nav.simulator' },
        { to: '/watch', label: 'nav.watch' }
      ]
    }
  },
  methods: {
    isActive(path) {
      if (path === '/') return this.$route.path === '/'
      return this.$route.path.startsWith(path)
    },
    changeLocale() {
      this.locale = this.currentLocale
      localStorage.setItem('wc2026_lang', this.currentLocale)
    }
  }
}
</script>
