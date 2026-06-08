<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.matches') }}</h1>
      </div>

      <div class="glass-card p-4 mb-6 flex flex-wrap gap-3">
        <select v-model="filterGroup" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="">{{ $t('matches.allGroups') }}</option>
          <option v-for="g in store.groupLetters" :key="g" :value="g">{{ $t('groups.group') }} {{ g }}</option>
        </select>

        <select v-model="filterStatus" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="">{{ $t('matches.allStatuses') }}</option>
          <option value="scheduled">{{ $t('match.scheduled') }}</option>
          <option value="live">{{ $t('match.live') }}</option>
          <option value="completed">{{ $t('match.completed') }}</option>
        </select>

        <select v-model="filterRound" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="">{{ $t('matches.allRounds') }}</option>
          <option v-for="r in rounds" :key="r" :value="r">{{ r }}</option>
        </select>

        <button v-if="filterGroup || filterStatus || filterRound" @click="clearFilters" class="text-sm text-gray-400 hover:text-wc-gold transition-colors px-3 py-2">
          ✕ {{ $t('common.clear') }}
        </button>

        <div class="ml-auto text-sm text-gray-400 flex items-center">{{ filteredMatches.length }} {{ $t('matches.matchesFound') }}</div>
      </div>

      <div v-if="store.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!filteredMatches.length" class="glass-card p-10 text-center">
        <p class="text-gray-400 text-lg">{{ $t('common.noData') }}</p>
        <button @click="clearFilters" class="mt-4 text-wc-gold hover:underline text-sm">{{ $t('common.clear') }}</button>
      </div>

      <div v-else>
        <div v-for="(group, label) in groupedMatches" :key="label" class="mb-8">
          <h2 class="text-gray-400 uppercase tracking-wider text-sm font-semibold mb-3 flex items-center gap-2">
            <span class="w-4 h-px bg-surface-500 flex-1"></span>
            {{ label }}
            <span class="w-4 h-px bg-surface-500 flex-1"></span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MatchCard v-for="match in group" :key="match.id" :match="match" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import MatchCard from '@/components/MatchCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'MatchesView',
  components: { MatchCard, LoadingSpinner },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  data() {
    return {
      filterGroup: this.$route.query.group || '',
      filterStatus: this.$route.query.status || '',
      filterRound: ''
    }
  },
  computed: {
    rounds() {
      return [...new Set(this.store.games.map(g => g.round).filter(Boolean))].sort()
    },
    filteredMatches() {
      return this.store.games.filter(m => {
        if (this.filterGroup && m.group !== this.filterGroup) return false
        if (this.filterStatus && m.status !== this.filterStatus) return false
        if (this.filterRound && m.round !== this.filterRound) return false
        return true
      })
    },
    groupedMatches() {
      const groups = {}
      this.filteredMatches.forEach(m => {
        const key = m.group ? `Group ${m.group}` : (m.round || 'Other')
        if (!groups[key]) groups[key] = []
        groups[key].push(m)
      })
      return groups
    }
  },
  methods: {
    clearFilters() {
      this.filterGroup = ''
      this.filterStatus = ''
      this.filterRound = ''
    }
  }
}
</script>
