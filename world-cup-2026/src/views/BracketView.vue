<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.bracket') }}</h1>
      </div>
      <p class="text-gray-400 mb-8">{{ $t('bracket.subtitle') }}</p>

      <div v-if="store.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <template v-else>
        <div class="flex flex-wrap gap-4 mb-6 text-xs text-gray-400">
          <div v-for="round in roundNames" :key="round.key" class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm" :class="round.color"></span>
            <span>{{ round.label }}</span>
          </div>
        </div>

        <div class="overflow-x-auto pb-4">
          <div class="flex gap-4 min-w-max">
            <div v-for="round in roundNames" :key="round.key" class="flex flex-col gap-2" :style="{ width: '180px' }">
              <h3 class="text-xs font-bold uppercase tracking-wider mb-2 text-center" :class="round.textColor">{{ round.label }}</h3>
              <div class="flex flex-col" :style="{ gap: round.gap }">
                <BracketMatch
                  v-for="(match, i) in getMatchesByRound(round.key)"
                  :key="match?.id || i"
                  :home-team="match ? { name: match.home_team, code: match.home_code, score: match.home_score } : { name: 'TBD', code: '', score: null }"
                  :away-team="match ? { name: match.away_team, code: match.away_code, score: match.away_score } : { name: 'TBD', code: '', score: null }"
                  :winner="match?.winner || null"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!hasKnockoutGames" class="glass-card p-8 text-center mt-6">
          <p class="text-4xl mb-3">🏆</p>
          <p class="text-white font-bold text-lg">{{ $t('bracket.knockoutNotStarted') }}</p>
          <p class="text-gray-400 text-sm mt-2">{{ $t('bracket.knockoutHint') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import BracketMatch from '@/components/BracketMatch.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const ROUND_CONFIG = [
  { key: 'Round of 32', label: 'Round of 32', matchCount: 16, color: 'bg-surface-600', textColor: 'text-gray-400', gap: '4px' },
  { key: 'Round of 16', label: 'Round of 16', matchCount: 8, color: 'bg-blue-900', textColor: 'text-blue-400', gap: '8px' },
  { key: 'Quarter-final', label: 'Quarterfinal', matchCount: 4, color: 'bg-purple-900', textColor: 'text-purple-400', gap: '16px' },
  { key: 'Semi-final', label: 'Semifinal', matchCount: 2, color: 'bg-wc-navy', textColor: 'text-blue-300', gap: '32px' },
  { key: 'Final', label: 'Final', matchCount: 1, color: 'bg-yellow-900', textColor: 'text-wc-gold', gap: '0px' }
]

export default {
  name: 'BracketView',
  components: { BracketMatch, LoadingSpinner },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  computed: {
    roundNames() { return ROUND_CONFIG },
    hasKnockoutGames() {
      return this.store.games.some(g => g.round && g.round !== 'Group Stage')
    }
  },
  methods: {
    getMatchesByRound(roundKey) {
      const matches = this.store.games.filter(g => {
        if (!g.round) return false
        const r = g.round.toLowerCase()
        return r.includes(roundKey.toLowerCase())
      })
      const config = ROUND_CONFIG.find(r => r.key === roundKey)
      const count = config?.matchCount || 1
      const result = [...matches]
      while (result.length < count) result.push(null)
      return result.slice(0, count)
    }
  }
}
</script>
