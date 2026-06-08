<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('watch.title') }}</h1>
      </div>
      <p class="text-gray-400 mb-8">{{ $t('watch.subtitle') }}</p>

      <div class="flex flex-wrap gap-3 mb-6">
        <button
          @click="filterRegion = ''"
          :class="filterRegion === '' ? 'bg-wc-gold text-black' : 'bg-surface-700 text-gray-300 hover:bg-surface-600'"
          class="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >All Regions</button>
        <button
          v-for="region in ALL_REGIONS"
          :key="region"
          @click="filterRegion = region"
          :class="filterRegion === region ? 'bg-wc-gold text-black' : 'bg-surface-700 text-gray-300 hover:bg-surface-600'"
          class="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >{{ region }}</button>
      </div>

      <div class="flex items-center gap-3 mb-6">
        <button
          @click="freeOnly = !freeOnly"
          :class="freeOnly ? 'bg-green-600' : 'bg-surface-600'"
          class="relative w-10 h-5 rounded-full transition-colors"
        >
          <span :class="freeOnly ? 'translate-x-5' : 'translate-x-0.5'" class="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform"></span>
        </button>
        <span class="text-sm text-gray-300">{{ $t('watch.freeOnly') }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <LiveStreamCard v-for="stream in filteredStreams" :key="stream.id" :stream="stream" />
      </div>

      <div v-if="!filteredStreams.length" class="glass-card p-10 text-center">
        <p class="text-gray-400">{{ $t('watch.noStreams') }}</p>
      </div>

      <div class="glass-card p-6 bg-gradient-to-r from-blue-900/40 to-surface-700 border border-blue-700/30">
        <div class="flex items-center gap-4">
          <span class="text-4xl">⚽</span>
          <div class="flex-1">
            <h3 class="text-white font-bold text-lg">FIFA+</h3>
            <p class="text-gray-400 text-sm">{{ $t('watch.fifaPlusDesc') }}</p>
          </div>
          <a href="https://www.fifa.com/fifaplus" target="_blank" rel="noopener noreferrer"
             class="bg-wc-gold hover:bg-wc-gold-light text-black font-bold px-5 py-2.5 rounded-lg transition-colors flex-shrink-0">
            {{ $t('watch.watchNow') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { STREAMS, ALL_REGIONS } from '@/data/liveStreams.js'
import LiveStreamCard from '@/components/LiveStreamCard.vue'

export default {
  name: 'WatchView',
  components: { LiveStreamCard },
  data() {
    return { filterRegion: '', freeOnly: false, ALL_REGIONS }
  },
  computed: {
    filteredStreams() {
      return STREAMS.filter(s => {
        if (this.freeOnly && !s.free) return false
        if (this.filterRegion && !s.regions.includes(this.filterRegion)) return false
        return true
      })
    }
  }
}
</script>
