<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.predictor') }}</h1>
      </div>
      <p class="text-gray-400 mb-6">{{ $t('predictor.subtitle') }}</p>

      <div v-if="predictorStats.total > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-wc-gold">{{ predictorStats.total }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ $t('predictor.statPredictions') }}</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-green-400">{{ predictorStats.points }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ $t('predictor.statPoints') }}</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-blue-400">{{ predictorStats.accuracy }}%</div>
          <div class="text-xs text-gray-400 mt-1">{{ $t('predictor.statAccuracy') }}</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-yellow-400">{{ predictorStats.exact }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ $t('predictor.statExact') }}</div>
        </div>
      </div>

      <div class="glass-card p-4 mb-6 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-2"><span class="w-6 h-6 rounded bg-wc-gold text-black text-xs flex items-center justify-center font-black">3</span><span class="text-gray-300">{{ $t('predictor.exactScore') }}</span></div>
        <div class="flex items-center gap-2"><span class="w-6 h-6 rounded bg-green-600 text-white text-xs flex items-center justify-center font-black">1</span><span class="text-gray-300">{{ $t('predictor.correctResult') }}</span></div>
        <div class="flex items-center gap-2"><span class="w-6 h-6 rounded bg-surface-600 text-gray-400 text-xs flex items-center justify-center font-black">0</span><span class="text-gray-300">{{ $t('predictor.wrong') }}</span></div>
      </div>

      <div v-if="store.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!store.games.length" class="glass-card p-10 text-center">
        <p class="text-gray-400">{{ $t('common.noData') }}</p>
      </div>

      <div v-else>
        <div v-for="(group, label) in groupedMatches" :key="label" class="mb-8">
          <h2 class="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="w-4 h-px bg-surface-500 flex-1"></span>
            {{ label }}
            <span class="w-4 h-px bg-surface-500 flex-1"></span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PredictorCard
              v-for="match in group"
              :key="match.id"
              :match="match"
            />
          </div>
        </div>
      </div>

      <div v-if="predictorStats.total > 0" class="glass-card p-5 mt-6">
        <h3 class="text-gray-300 font-semibold mb-3">{{ $t('predictor.sharePredictions') }}</h3>
        <SocialShare
          :title="'My FIFA World Cup 2026 Predictions'"
          :text="`I've predicted ${predictorStats.total} matches with ${predictorStats.accuracy}% accuracy and ${predictorStats.points} points! 🏆 #WC2026`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { usePredictorStore } from '@/stores/predictor.js'
import PredictorCard from '@/components/PredictorCard.vue'
import SocialShare from '@/components/SocialShare.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'PredictorView',
  components: { PredictorCard, SocialShare, LoadingSpinner },
  setup() {
    const store = useWorldCupStore()
    const predictorStore = usePredictorStore()
    return { store, predictorStore }
  },
  computed: {
    predictorStats() { return this.predictorStore.stats },
    groupedMatches() {
      const groups = {}
      this.store.games.forEach(m => {
        const key = m.group ? `Group ${m.group}` : (m.round || 'Other')
        if (!groups[key]) groups[key] = []
        groups[key].push(m)
      })
      return groups
    }
  }
}
</script>
