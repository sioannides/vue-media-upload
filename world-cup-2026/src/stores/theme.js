import { defineStore } from 'pinia'
export const useThemeStore = defineStore('theme', {
  state: () => ({ isDark: localStorage.getItem('wc2026_theme') !== 'light' }),
  actions: {
    toggle() { this.isDark = !this.isDark; localStorage.setItem('wc2026_theme', this.isDark ? 'dark' : 'light'); this.apply() },
    apply() { if (this.isDark) { document.documentElement.classList.remove('light') } else { document.documentElement.classList.add('light') } }
  }
})
