<template>
  <div class="glass-card rounded-xl overflow-hidden">
    <!-- Match header -->
    <div class="p-4 border-b border-surface-600">
      <div class="flex items-center justify-between gap-2">
        <div class="flex-1 flex flex-col items-center gap-1">
          <TeamFlag :code="match.home_code" :size="36" />
          <span class="text-xs font-semibold text-white text-center">{{ match.home_team }}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-gray-500 uppercase tracking-wider">{{ match.group ? 'Group ' + match.group : match.round }}</span>
          <span class="text-lg font-bold text-gray-400">vs</span>
          <span v-if="match.date" class="text-xs text-gray-500">{{ formatDate(match.date) }}</span>
        </div>
        <div class="flex-1 flex flex-col items-center gap-1">
          <TeamFlag :code="match.away_code" :size="36" />
          <span class="text-xs font-semibold text-white text-center">{{ match.away_team }}</span>
        </div>
      </div>
    </div>

    <!-- Prediction input -->
    <div class="p-4">
      <div v-if="!prediction" class="flex items-center gap-3 justify-center">
        <input v-model.number="homeInput" type="number" min="0" max="20" class="w-14 h-12 text-center text-xl font-black bg-surface-600 border border-surface-500 rounded-lg text-white focus:outline-none focus:border-wc-gold" />
        <span class="text-gray-400 font-bold">–</span>
        <input v-model.number="awayInput" type="number" min="0" max="20" class="w-14 h-12 text-center text-xl font-black bg-surface-600 border border-surface-500 rounded-lg text-white focus:outline-none focus:border-wc-gold" />
        <button
          @click="submit"
          :disabled="homeInput === null || awayInput === null"
          class="px-4 py-2 rounded-lg text-sm font-semibold bg-wc-gold text-surface-900 hover:bg-wc-gold-light transition-colors disabled:opacity-40"
        >{{ $t('predictor.submit') }}</button>
      </div>
      <div v-else class="text-center">
        <div class="text-sm text-gray-400 mb-1">{{ $t('predictor.your_prediction') }}</div>
        <div class="text-2xl font-black text-wc-gold">{{ prediction.predHome }} – {{ prediction.predAway }}</div>
        <div v-if="prediction.actualHome !== undefined" class="mt-2">
          <div class="text-xs text-gray-500">{{ $t('predictor.actual') }}: <span class="text-white font-bold">{{ prediction.actualHome }} – {{ prediction.actualAway }}</span></div>
          <div class="mt-1">
            <span v-if="isExact" class="text-xs bg-wc-green/20 text-wc-green px-2 py-0.5 rounded-full font-semibold">✅ Exact! +3 pts</span>
            <span v-else-if="isCorrect" class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">✓ Correct winner +1 pt</span>
            <span v-else class="text-xs bg-surface-500 text-gray-400 px-2 py-0.5 rounded-full">✗ Wrong</span>
          </div>
        </div>
        <button @click="clearPrediction" class="mt-2 text-xs text-gray-500 hover:text-gray-300 underline">Change</button>
      </div>
    </div>
  </div>
</template>

<script>
import TeamFlag from './TeamFlag.vue'
import { usePredictorStore } from '../stores/predictor.js'

export default {
  name: 'PredictorCard',
  components: { TeamFlag },
  props: { match: { type: Object, required: true } },
  setup() { return { store: usePredictorStore() } },
  data() { return { homeInput: 0, awayInput: 0 } },
  computed: {
    prediction() { return this.store.getPrediction(this.match.id) },
    isExact() {
      if (!this.prediction?.actualHome !== undefined) return false
      return this.prediction.predHome === this.prediction.actualHome && this.prediction.predAway === this.prediction.actualAway
    },
    isCorrect() {
      if (this.prediction?.actualHome === undefined) return false
      const predW = this.prediction.predHome > this.prediction.predAway ? 'h' : this.prediction.predHome < this.prediction.predAway ? 'a' : 'd'
      const actW = this.prediction.actualHome > this.prediction.actualAway ? 'h' : this.prediction.actualHome < this.prediction.actualAway ? 'a' : 'd'
      return predW === actW
    }
  },
  methods: {
    submit() {
      if (this.homeInput === null || this.awayInput === null) return
      this.store.predict(this.match.id, this.homeInput, this.awayInput)
    },
    clearPrediction() {
      delete this.store.predictions[this.match.id]
      this.store.predictions = { ...this.store.predictions }
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }
}
</script>
