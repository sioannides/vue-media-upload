import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router/index.js'
import { useWorldCupStore } from './stores/worldcup.js'
import { useThemeStore } from './stores/theme.js'
import en from './i18n/locales/en.json'
import es from './i18n/locales/es.json'
import fr from './i18n/locales/fr.json'
import pt from './i18n/locales/pt.json'
import './assets/main.css'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('wc2026_lang') || 'en',
  fallbackLocale: 'en',
  messages: { en, es, fr, pt }
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}

const themeStore = useThemeStore()
themeStore.apply()

const wcStore = useWorldCupStore()
wcStore.init()

app.mount('#app')
