<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.simulator') }}</h1>
      </div>
      <p class="text-gray-400 mb-8">{{ $t('simulator.subtitle') }}</p>

      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="g in store.groupLetters"
          :key="g"
          @click="selectedGroup = g"
          :class="selectedGroup === g ? 'bg-wc-gold text-black' : 'bg-surface-700 text-gray-300 hover:bg-surface-600'"
          class="font-bold px-4 py-2 rounded-lg transition-colors"
        >{{ $t('groups.group') }} {{ g }}</button>
      </div>

      <div v-if="!selectedGroup" class="glass-card p-10 text-center">
        <p class="text-4xl mb-3">📊</p>
        <p class="text-gray-400">{{ $t('simulator.selectGroup') }}</p>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-wc-gold font-bold">{{ $t('simulator.setScores') }}</h2>
              <button @click="resetHypotheticals" class="text-xs text-gray-400 hover:text-wc-gold transition-colors px-3 py-1.5 bg-surface-700 rounded-lg">
                ↺ {{ $t('common.reset') }}
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="match in groupMatches"
                :key="match.id"
                class="glass-card p-3"
              >
                <div class="flex items-center gap-3">
                  <div class="flex-1 flex flex-col items-end gap-1 min-w-0">
                    <TeamFlag :code="match.home_code" :size="20" />
                    <span class="text-xs text-white text-right leading-tight truncate max-w-full">{{ match.home_team }}</span>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number" min="0" max="20"
                      :value="getScore(match.id, 'home')"
                      @input="setScore(match.id, 'home', $event.target.value)"
                      class="w-10 h-10 text-center text-lg font-black bg-surface-600 border border-surface-500 rounded-lg text-white focus:outline-none focus:border-wc-gold"
                    />
                    <span class="text-gray-500">–</span>
                    <input
                      type="number" min="0" max="20"
                      :value="getScore(match.id, 'away')"
                      @input="setScore(match.id, 'away', $event.target.value)"
                      class="w-10 h-10 text-center text-lg font-black bg-surface-600 border border-surface-500 rounded-lg text-white focus:outline-none focus:border-wc-gold"
                    />
                  </div>
                  <div class="flex-1 flex flex-col items-start gap-1 min-w-0">
                    <TeamFlag :code="match.away_code" :size="20" />
                    <span class="text-xs text-white text-left leading-tight truncate max-w-full">{{ match.away_team }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!groupMatches.length" class="glass-card p-6 text-center">
                <p class="text-gray-400 text-sm">{{ $t('simulator.noMatches') }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-wc-gold font-bold mb-4">{{ $t('simulator.projectedStandings') }}</h2>
            <div class="glass-card overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface-700">
                  <tr>
                    <th class="text-left px-3 py-2.5 text-xs text-gray-400 uppercase">#</th>
                    <th class="text-left px-3 py-2.5 text-xs text-gray-400 uppercase">Team</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase">P</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase">W</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase">D</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase">L</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase">GD</th>
                    <th class="text-center px-2 py-2.5 text-xs text-gray-400 uppercase font-black text-wc-gold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in simulatedStandings"
                    :key="row.code || row.team"
                    class="border-b border-surface-700 hover:bg-surface-700/30"
                  >
                    <td class="px-3 py-2.5">
                      <span class="w-5 h-5 rounded text-xs flex items-center justify-center font-bold"
                        :class="i < 2 ? 'bg-green-600 text-white' : 'bg-surface-600 text-gray-400'">
                        {{ i + 1 }}
                      </span>
                    </td>
                    <td class="px-3 py-2.5">
                      <div class="flex items-center gap-2">
                        <TeamFlag :code="row.code" :size="20" />
                        <span class="text-white text-xs font-semibold truncate max-w-[80px]">{{ row.team }}</span>
                      </div>
                    </td>
                    <td class="px-2 py-2.5 text-center text-gray-300 text-xs">{{ row.played }}</td>
                    <td class="px-2 py-2.5 text-center text-gray-300 text-xs">{{ row.won }}</td>
                    <td class="px-2 py-2.5 text-center text-gray-300 text-xs">{{ row.drawn }}</td>
                    <td class="px-2 py-2.5 text-center text-gray-300 text-xs">{{ row.lost }}</td>
                    <td class="px-2 py-2.5 text-center text-xs" :class="row.goal_difference > 0 ? 'text-green-400' : row.goal_difference < 0 ? 'text-red-400' : 'text-gray-300'">
                      {{ row.goal_difference > 0 ? '+' : '' }}{{ row.goal_difference }}
                    </td>
                    <td class="px-2 py-2.5 text-center text-wc-gold font-black">{{ row.points }}</td>
                  </tr>
                  <tr v-if="!simulatedStandings.length">
                    <td colspan="8" class="text-center py-6 text-gray-400 text-sm">{{ $t('common.noData') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-3 flex gap-3 text-xs text-gray-500">
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-green-600"></span> {{ $t('groups.advances') }}</div>
            </div>

            <div v-if="hasHypotheticals" class="mt-4 glass-card p-3 text-center border border-wc-gold/20">
              <p class="text-wc-gold text-xs font-semibold">⚡ {{ $t('simulator.hypotheticalActive') }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { simulateGroup } from '@/utils/groupSimulator.js'
import TeamFlag from '@/components/TeamFlag.vue'

export default {
  name: 'SimulatorView',
  components: { TeamFlag },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  data() {
    return { selectedGroup: '', hypotheticals: {} }
  },
  computed: {
    groupMatches() {
      if (!this.selectedGroup) return []
      return this.store.getMatchesByGroup(this.selectedGroup)
    },
    baseStandings() {
      if (!this.selectedGroup) return []
      return this.store.getGroupStandings(this.selectedGroup)
    },
    simulatedStandings() {
      if (!this.baseStandings.length && !this.groupMatches.length) return []
      return simulateGroup(this.baseStandings, this.groupMatches, this.hypotheticals)
    },
    hasHypotheticals() {
      return Object.keys(this.hypotheticals).length > 0
    }
  },
  methods: {
    getScore(matchId, side) {
      const h = this.hypotheticals[matchId]
      if (!h) return ''
      return side === 'home' ? h.home : h.away
    },
    setScore(matchId, side, val) {
      const num = val === '' ? null : Number(val)
      if (!this.hypotheticals[matchId]) {
        this.hypotheticals[matchId] = { home: null, away: null }
      }
      this.hypotheticals[matchId][side] = num
      this.hypotheticals = { ...this.hypotheticals }
    },
    resetHypotheticals() {
      this.hypotheticals = {}
    }
  }
}
</script>
