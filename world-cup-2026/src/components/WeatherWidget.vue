<template>
  <div class="glass-card rounded-xl p-4">
    <h4 class="text-xs uppercase tracking-wider text-gray-400 mb-3">{{ $t('stadiums.weather') }}</h4>

    <div v-if="loading" class="flex items-center gap-2 text-gray-400 text-sm">
      <div class="w-4 h-4 border-2 border-gray-600 border-t-wc-gold rounded-full animate-spin"></div>
      Loading weather...
    </div>

    <div v-else-if="weather" class="flex items-center gap-4">
      <img :src="weather.icon" :alt="weather.description" class="w-14 h-14" />
      <div>
        <div class="text-3xl font-black text-white">{{ weather.temp }}°C</div>
        <div class="text-sm text-gray-300 capitalize">{{ weather.description }}</div>
        <div class="flex gap-3 mt-1 text-xs text-gray-400">
          <span>💧 {{ weather.humidity }}%</span>
          <span>💨 {{ weather.wind }} m/s</span>
          <span>🌡️ Feels {{ weather.feels_like }}°C</span>
        </div>
      </div>
    </div>

    <div v-else-if="!hasKey" class="text-xs text-gray-500 flex items-center gap-2">
      <span>🔑</span>
      <span>Add <code class="text-wc-gold">VITE_OPENWEATHER_KEY</code> to .env for live weather</span>
    </div>

    <div v-else class="text-sm text-gray-400">Weather unavailable</div>
  </div>
</template>

<script>
import { fetchWeather, hasWeatherKey } from '../api/weather.js'

export default {
  name: 'WeatherWidget',
  props: {
    city: { type: String, required: true },
    countryCode: { type: String, default: 'us' }
  },
  data() { return { weather: null, loading: false, hasKey: hasWeatherKey() } },
  async mounted() {
    if (!this.hasKey) return
    this.loading = true
    try { this.weather = await fetchWeather(this.city, this.countryCode) }
    catch {}
    finally { this.loading = false }
  }
}
</script>
