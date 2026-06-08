<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.history') }}</h1>
      </div>
      <p class="text-gray-400 mb-8">{{ $t('history.subtitle') }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div v-for="record in quickRecords" :key="record.label" class="glass-card p-4 text-center">
          <div class="text-3xl mb-2">{{ record.icon }}</div>
          <div class="text-xl font-black text-wc-gold">{{ record.value }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ record.label }}</div>
        </div>
      </div>

      <div class="flex gap-2 mb-6 border-b border-surface-600">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'border-b-2 border-wc-gold text-wc-gold' : 'text-gray-400 hover:text-gray-200'"
          class="px-4 py-3 text-sm font-semibold transition-colors -mb-px"
        >{{ tab.label }}</button>
      </div>

      <div v-if="activeTab === 'timeline'" class="overflow-x-auto">
        <div class="flex gap-4 pb-4 min-w-max">
          <div
            v-for="t in reversedTournaments"
            :key="t.year"
            @click="selectedYear = selectedYear === t.year ? null : t.year"
            class="glass-card p-4 cursor-pointer hover:border-wc-gold/50 transition-colors flex-shrink-0 w-48"
            :class="selectedYear === t.year ? 'border border-wc-gold/60' : 'border border-surface-600'"
          >
            <div class="text-wc-gold font-black text-xl">{{ t.year }}</div>
            <div class="text-gray-300 text-xs mt-1">{{ t.host }}</div>
            <div class="flex items-center gap-1.5 mt-2">
              <TeamFlag :code="t.champion_code" :size="20" />
              <span class="text-white text-sm font-bold">{{ t.champion }}</span>
            </div>
            <div class="text-gray-500 text-xs mt-1">🥈 {{ t.runnerUp }}</div>
            <div class="text-gray-500 text-xs mt-0.5">⚽ {{ t.goldenBoot }}</div>
          </div>
        </div>

        <div v-if="selectedTournament" class="glass-card p-6 mt-4 border border-wc-gold/20">
          <div class="flex items-start gap-6 flex-wrap">
            <div>
              <h2 class="text-wc-gold font-black text-2xl">{{ selectedTournament.year }} FIFA World Cup</h2>
              <p class="text-gray-400">Host: {{ selectedTournament.host }}</p>
            </div>
            <div class="flex-1">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div>
                  <div class="text-xs text-gray-500 uppercase">Champion</div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <TeamFlag :code="selectedTournament.champion_code" :size="20" />
                    <span class="text-white font-bold text-sm">{{ selectedTournament.champion }}</span>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Runner-up</div>
                  <div class="text-white text-sm mt-1">{{ selectedTournament.runnerUp }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Goals</div>
                  <div class="text-wc-gold font-bold text-sm mt-1">{{ selectedTournament.goals }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Attendance</div>
                  <div class="text-white text-sm mt-1">{{ Number(selectedTournament.attendance).toLocaleString() }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Golden Boot</div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <TeamFlag :code="selectedTournament.goldenBootCode" :size="16" />
                    <span class="text-white text-sm">{{ selectedTournament.goldenBoot }} ({{ selectedTournament.goldenBootGoals }})</span>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Teams</div>
                  <div class="text-white text-sm mt-1">{{ selectedTournament.teams }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">Matches</div>
                  <div class="text-white text-sm mt-1">{{ selectedTournament.matches }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 uppercase">3rd Place</div>
                  <div class="text-white text-sm mt-1">{{ selectedTournament.thirdPlace }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'scorers'">
        <div class="glass-card overflow-hidden">
          <table class="w-full">
            <thead class="bg-surface-700">
              <tr>
                <th class="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wider">#</th>
                <th class="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wider">{{ $t('history.player') }}</th>
                <th class="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wider">{{ $t('history.nation') }}</th>
                <th class="text-right px-4 py-3 text-xs text-gray-400 uppercase tracking-wider">{{ $t('history.goals') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(scorer, i) in RECORDS.topScorers"
                :key="scorer.player"
                class="border-b border-surface-700 hover:bg-surface-700/30"
              >
                <td class="px-4 py-3 text-gray-400 font-bold">{{ i + 1 }}</td>
                <td class="px-4 py-3 text-white font-semibold">{{ scorer.player }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <TeamFlag :code="scorer.code" :size="20" />
                    <span class="text-gray-300 text-sm">{{ scorer.country }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="text-wc-gold font-black text-lg">{{ scorer.goals }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'records'">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="glass-card p-5">
            <h3 class="text-wc-gold font-bold mb-4">🏆 {{ $t('history.mostTitles') }}</h3>
            <div class="space-y-2">
              <div v-for="t in RECORDS.mostTitles" :key="t.country" class="flex items-center gap-3">
                <span class="text-gray-500 text-xs w-4">{{ t.titles }}x</span>
                <TeamFlag :code="t.code" :size="24" />
                <span class="text-white text-sm flex-1">{{ t.country }}</span>
                <span class="text-gray-500 text-xs">{{ t.years.join(', ') }}</span>
              </div>
            </div>
          </div>

          <div class="glass-card p-5">
            <h3 class="text-wc-gold font-bold mb-4">📊 {{ $t('history.records') }}</h3>
            <div class="space-y-4">
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ $t('history.biggestWin') }}</div>
                <div class="text-white font-bold">{{ RECORDS.biggestWin.match }}</div>
                <div class="text-wc-gold text-sm">{{ RECORDS.biggestWin.score }} ({{ RECORDS.biggestWin.year }})</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ $t('history.mostGoalsMatch') }}</div>
                <div class="text-white font-bold">{{ RECORDS.mostGoalsMatch.match }}</div>
                <div class="text-wc-gold text-sm">{{ RECORDS.mostGoalsMatch.score }} · {{ RECORDS.mostGoalsMatch.totalGoals }} goals ({{ RECORDS.mostGoalsMatch.year }})</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ $t('history.fastestGoal') }}</div>
                <div class="flex items-center gap-2">
                  <TeamFlag :code="RECORDS.fastestGoal.code" :size="20" />
                  <div>
                    <div class="text-white font-bold text-sm">{{ RECORDS.fastestGoal.player }}</div>
                    <div class="text-wc-gold text-xs">{{ RECORDS.fastestGoal.seconds }}s ({{ RECORDS.fastestGoal.year }})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { WC_TOURNAMENTS, ALL_TIME_RECORDS } from '@/data/wcHistory.js'
import TeamFlag from '@/components/TeamFlag.vue'

export default {
  name: 'HistoryView',
  components: { TeamFlag },
  data() {
    return {
      activeTab: 'timeline',
      selectedYear: null,
      RECORDS: ALL_TIME_RECORDS,
      tabs: [
        { key: 'timeline', label: this.$t ? this.$t('history.timeline') : 'Timeline' },
        { key: 'scorers', label: this.$t ? this.$t('history.topScorers') : 'Top Scorers' },
        { key: 'records', label: this.$t ? this.$t('history.records') : 'Records' }
      ]
    }
  },
  computed: {
    reversedTournaments() {
      return [...WC_TOURNAMENTS].reverse()
    },
    selectedTournament() {
      if (!this.selectedYear) return null
      return WC_TOURNAMENTS.find(t => t.year === this.selectedYear) || null
    },
    quickRecords() {
      const total = WC_TOURNAMENTS.reduce((sum, t) => sum + t.goals, 0)
      const totalAtt = WC_TOURNAMENTS.reduce((sum, t) => sum + t.attendance, 0)
      return [
        { icon: '🏆', value: `${WC_TOURNAMENTS.length}`, label: this.$t ? this.$t('history.editions') : 'Editions' },
        { icon: '⚽', value: total.toLocaleString(), label: this.$t ? this.$t('history.totalGoals') : 'Total Goals' },
        { icon: '👥', value: (totalAtt / 1e6).toFixed(0) + 'M', label: this.$t ? this.$t('history.totalAttendance') : 'Total Attendance' },
        { icon: '🥇', value: 'Brazil 5x', label: this.$t ? this.$t('history.mostTitles') : 'Most Titles' }
      ]
    }
  }
}
</script>
