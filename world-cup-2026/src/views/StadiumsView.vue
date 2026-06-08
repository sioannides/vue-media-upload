<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.stadiums') }}</h1>
      </div>
      <p class="text-gray-400 mb-6">{{ $t('stadiums.subtitle') }}</p>

      <div class="flex gap-2 mb-6 flex-wrap">
        <button
          v-for="country in countries"
          :key="country"
          @click="filterCountry = filterCountry === country ? '' : country"
          :class="filterCountry === country ? 'bg-wc-gold text-black' : 'bg-surface-700 text-gray-300 hover:bg-surface-600'"
          class="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >{{ country }}</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stadium in filteredStadiums"
          :key="stadium.id"
          @click="selectStadium(stadium)"
          class="glass-card card-hover cursor-pointer p-4"
          :class="selectedStadium?.id === stadium.id ? 'ring-2 ring-wc-gold' : ''"
        >
          <div class="w-full h-32 bg-surface-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
            <div class="absolute inset-0 bg-gradient-to-br from-wc-navy/50 to-surface-800"></div>
            <span class="text-4xl relative z-10">🏟️</span>
          </div>
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-white font-bold text-sm leading-tight truncate">{{ stadium.name }}</h3>
              <p class="text-gray-400 text-xs mt-1">{{ stadium.city }}</p>
            </div>
            <TeamFlag :code="stadium.country_code" :size="20" class="flex-shrink-0 mt-0.5" />
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-gray-500">{{ Number(stadium.capacity).toLocaleString() }} cap.</span>
            <span class="text-xs text-wc-gold font-semibold">{{ matchCount(stadium) }} matches</span>
          </div>
        </div>
      </div>

      <div v-if="selectedStadium" class="glass-card p-6">
        <div class="flex items-center gap-3 mb-6">
          <TeamFlag :code="selectedStadium.country_code" :size="32" />
          <div>
            <h2 class="text-wc-gold font-black text-xl">{{ selectedStadium.name }}</h2>
            <p class="text-gray-400 text-sm">{{ selectedStadium.city }}, {{ selectedStadium.country }}</p>
          </div>
          <button @click="selectedStadium = null" class="ml-auto text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wider">📍 Location</h3>
            <div class="rounded-xl overflow-hidden" style="height: 250px;">
              <iframe
                :src="mapUrl"
                width="100%"
                height="250"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="w-full"
              ></iframe>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-surface-700 rounded-xl p-3 text-center">
                <div class="text-2xl font-black text-wc-gold">{{ Number(selectedStadium.capacity).toLocaleString() }}</div>
                <div class="text-xs text-gray-400 mt-1">Capacity</div>
              </div>
              <div class="bg-surface-700 rounded-xl p-3 text-center">
                <div class="text-2xl font-black text-white">{{ matchCount(selectedStadium) }}</div>
                <div class="text-xs text-gray-400 mt-1">WC Matches</div>
              </div>
            </div>

            <div>
              <h3 class="text-gray-300 font-semibold mb-2 text-sm uppercase tracking-wider">🌤️ {{ $t('stadiums.weather') }}</h3>
              <WeatherWidget :city="selectedStadium.city" :country="selectedStadium.country_code" />
            </div>

            <div v-if="stadiumMatches(selectedStadium).length">
              <h3 class="text-gray-300 font-semibold mb-2 text-sm uppercase tracking-wider">🗓️ {{ $t('stadiums.upcomingMatches') }}</h3>
              <div class="space-y-2">
                <router-link
                  v-for="m in stadiumMatches(selectedStadium).slice(0, 3)"
                  :key="m.id"
                  :to="`/match/${m.id}`"
                  class="flex items-center gap-2 bg-surface-700 rounded-lg p-2.5 hover:bg-surface-600 transition-colors"
                >
                  <TeamFlag :code="m.home_code" :size="20" />
                  <span class="text-white text-xs font-semibold flex-1">{{ m.home_team }} vs {{ m.away_team }}</span>
                  <TeamFlag :code="m.away_code" :size="20" />
                  <span class="text-gray-400 text-xs ml-1">{{ m.date }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { STADIUMS } from '@/data/stadiums.js'
import TeamFlag from '@/components/TeamFlag.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'

export default {
  name: 'StadiumsView',
  components: { TeamFlag, WeatherWidget },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  data() {
    return { STADIUMS, selectedStadium: null, filterCountry: '' }
  },
  computed: {
    countries() {
      return [...new Set(STADIUMS.map(s => s.country))].sort()
    },
    filteredStadiums() {
      if (!this.filterCountry) return STADIUMS
      return STADIUMS.filter(s => s.country === this.filterCountry)
    },
    mapUrl() {
      if (!this.selectedStadium) return ''
      const { lat, lng, name } = this.selectedStadium
      return `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(name)}&center=${lat},${lng}&zoom=15&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY`
    }
  },
  methods: {
    selectStadium(s) {
      this.selectedStadium = this.selectedStadium?.id === s.id ? null : s
    },
    matchCount(stadium) {
      return this.store.games.filter(m =>
        m.stadium === stadium.name ||
        m.city === stadium.city
      ).length
    },
    stadiumMatches(stadium) {
      return this.store.games.filter(m =>
        m.stadium === stadium.name || m.city === stadium.city
      )
    }
  }
}
</script>
