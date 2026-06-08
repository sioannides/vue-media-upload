<template>
  <div class="glass-card rounded-xl overflow-hidden">
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-white font-bold text-sm">🏨 Book Your World Cup Stay</p>
          <p class="text-blue-200 text-xs mt-0.5">Best hotels in {{ cityLabel }} for the 2026 World Cup</p>
        </div>
        <a
          :href="bookingUrl"
          target="_blank"
          rel="noopener sponsored"
          class="flex-shrink-0 bg-white text-blue-700 font-bold text-xs px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors no-underline"
        >
          Search Hotels →
        </a>
      </div>
    </div>

    <div class="px-5 py-3 flex gap-2 overflow-x-auto">
      <a
        v-for="city in cities"
        :key="city.name"
        :href="getCityUrl(city.name)"
        target="_blank"
        rel="noopener sponsored"
        class="flex-shrink-0 bg-surface-600 hover:bg-surface-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors no-underline"
      >
        {{ city.flag }} {{ city.name }}
      </a>
    </div>
  </div>
</template>

<script>
const CITIES = {
  usa: [
    { name: 'New York', flag: '🗽' }, { name: 'Los Angeles', flag: '🌴' },
    { name: 'Dallas', flag: '⭐' }, { name: 'Miami', flag: '🌊' },
    { name: 'Houston', flag: '🚀' }, { name: 'Atlanta', flag: '🍑' },
    { name: 'Boston', flag: '🦞' }, { name: 'Philadelphia', flag: '🔔' },
    { name: 'Kansas City', flag: '🎸' }, { name: 'Seattle', flag: '🌧️' }
  ],
  canada: [
    { name: 'Toronto', flag: '🍁' }, { name: 'Vancouver', flag: '🏔️' }
  ],
  mexico: [
    { name: 'Mexico City', flag: '🌮' }, { name: 'Guadalajara', flag: '🎺' }, { name: 'Monterrey', flag: '🏭' }
  ]
}

export default {
  name: 'BookingBanner',
  props: { variant: { type: String, default: 'usa' } },
  computed: {
    cities() { return CITIES[this.variant] || CITIES.usa },
    cityLabel() {
      return { usa: 'USA', canada: 'Canada', mexico: 'Mexico' }[this.variant] || 'World Cup Hosts'
    },
    bookingUrl() {
      const affiliateId = import.meta.env.VITE_BOOKING_AFFILIATE_ID || ''
      const aid = affiliateId ? `&aid=${affiliateId}` : ''
      return `https://www.booking.com/searchresults.html?ss=USA${aid}&checkin=2026-06-10&checkout=2026-07-20`
    }
  },
  methods: {
    getCityUrl(cityName) {
      const affiliateId = import.meta.env.VITE_BOOKING_AFFILIATE_ID || ''
      const aid = affiliateId ? `&aid=${affiliateId}` : ''
      return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(cityName)}${aid}`
    }
  }
}
</script>
