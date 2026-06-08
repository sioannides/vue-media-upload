<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.h2h') }}</h1>
      </div>
      <p class="text-gray-400 mb-8">{{ $t('h2h.subtitle') }}</p>

      <div class="glass-card p-6 mb-6">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex-1 min-w-[140px]">
            <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{{ $t('h2h.teamOne') }}</label>
            <select v-model="team1" class="w-full bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-wc-gold">
              <option value="">-- {{ $t('h2h.selectTeam') }} --</option>
              <option v-for="t in teams" :key="t.code" :value="t.code">{{ t.name }}</option>
            </select>
          </div>
          <div class="text-gray-500 font-bold text-lg pt-5">VS</div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{{ $t('h2h.teamTwo') }}</label>
            <select v-model="team2" class="w-full bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-wc-gold">
              <option value="">-- {{ $t('h2h.selectTeam') }} --</option>
              <option v-for="t in teams" :key="t.code" :value="t.code" :disabled="t.code === team1">{{ t.name }}</option>
            </select>
          </div>
        </div>

        <div v-if="team1 || team2" class="mt-4 flex items-center gap-6 justify-center">
          <div class="flex flex-col items-center gap-1">
            <TeamFlag v-if="team1" :code="team1" :size="48" />
            <span class="text-xs text-gray-400">{{ getTeamName(team1) }}</span>
          </div>
          <span class="text-gray-500 font-bold">VS</span>
          <div class="flex flex-col items-center gap-1">
            <TeamFlag v-if="team2" :code="team2" :size="48" />
            <span class="text-xs text-gray-400">{{ getTeamName(team2) }}</span>
          </div>
        </div>
      </div>

      <div v-if="team1 && team2">
        <div class="glass-card p-6 mb-6">
          <h2 class="text-wc-gold font-bold text-lg mb-4">{{ $t('h2h.worldCupHistory') }}</h2>

          <div v-if="!h2h.played" class="text-center py-4">
            <p class="text-gray-400">{{ $t('h2h.noHistory') }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ $t('h2h.noHistoryHint') }}</p>
          </div>

          <template v-else>
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <div class="text-3xl font-black text-wc-gold">{{ h2h.wins1 }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ getTeamName(team1) }} {{ $t('h2h.wins') }}</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-black text-gray-400">{{ h2h.draws }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ $t('h2h.draws') }}</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-black text-wc-gold">{{ h2h.wins2 }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ getTeamName(team2) }} {{ $t('h2h.wins') }}</div>
              </div>
            </div>

            <div class="flex rounded-full overflow-hidden h-3 mb-4">
              <div :style="{ width: pct1 + '%' }" class="bg-wc-gold transition-all"></div>
              <div :style="{ width: drawPct + '%' }" class="bg-surface-500 transition-all"></div>
              <div :style="{ width: pct2 + '%' }" class="bg-blue-400 transition-all"></div>
            </div>

            <div class="flex justify-between text-xs text-gray-400 mb-4">
              <span>{{ h2h.goals1 }} {{ $t('h2h.goals') }}</span>
              <span class="text-gray-500">{{ h2h.played }} {{ $t('h2h.meetings') }}</span>
              <span>{{ h2h.goals2 }} {{ $t('h2h.goals') }}</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-surface-600">
                    <th class="text-left py-2 text-gray-400 font-semibold text-xs">{{ $t('h2h.year') }}</th>
                    <th class="text-left py-2 text-gray-400 font-semibold text-xs">{{ $t('h2h.stage') }}</th>
                    <th class="text-center py-2 text-gray-400 font-semibold text-xs">{{ $t('h2h.result') }}</th>
                    <th class="text-left py-2 text-gray-400 font-semibold text-xs">{{ $t('h2h.notes') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in h2h.matches" :key="m.year + m.stage" class="border-b border-surface-700 hover:bg-surface-700/30">
                    <td class="py-2.5 text-wc-gold font-bold">{{ m.year }}</td>
                    <td class="py-2.5 text-gray-300">{{ m.stage }}</td>
                    <td class="py-2.5 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <TeamFlag :code="m.home_code" :size="16" />
                        <span class="font-black text-white">{{ m.homeScore }}–{{ m.awayScore }}</span>
                        <TeamFlag :code="m.away_code" :size="16" />
                      </div>
                    </td>
                    <td class="py-2.5 text-gray-500 text-xs">{{ m.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>

        <div v-if="sameGroup" class="glass-card p-5 border border-wc-gold/20">
          <h3 class="text-wc-gold font-bold mb-2">⚠️ {{ $t('h2h.sameGroup') }}</h3>
          <p class="text-gray-300 text-sm">{{ getTeamName(team1) }} {{ $t('h2h.and') }} {{ getTeamName(team2) }} {{ $t('h2h.sameGroupText') }}</p>
        </div>
      </div>

      <div v-else class="glass-card p-10 text-center">
        <p class="text-4xl mb-4">⚔️</p>
        <p class="text-gray-400">{{ $t('h2h.selectBoth') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { getH2H } from '@/utils/h2hStats.js'
import TeamFlag from '@/components/TeamFlag.vue'

export default {
  name: 'H2HView',
  components: { TeamFlag },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  data() {
    return { team1: '', team2: '' }
  },
  computed: {
    teams() {
      const fromStore = this.store.teams.map(t => ({ name: t.name, code: t.code }))
      if (fromStore.length) return fromStore.sort((a, b) => a.name.localeCompare(b.name))
      return []
    },
    h2h() {
      if (!this.team1 || !this.team2) return { played: 0, wins1: 0, wins2: 0, draws: 0, goals1: 0, goals2: 0, matches: [] }
      return getH2H(this.team1, this.team2)
    },
    pct1() {
      if (!this.h2h.played) return 0
      return Math.round((this.h2h.wins1 / this.h2h.played) * 100)
    },
    pct2() {
      if (!this.h2h.played) return 0
      return Math.round((this.h2h.wins2 / this.h2h.played) * 100)
    },
    drawPct() {
      if (!this.h2h.played) return 0
      return 100 - this.pct1 - this.pct2
    },
    sameGroup() {
      if (!this.team1 || !this.team2) return false
      const t1 = this.store.teams.find(t => t.code === this.team1)
      const t2 = this.store.teams.find(t => t.code === this.team2)
      return t1 && t2 && t1.group && t1.group === t2.group
    }
  },
  methods: {
    getTeamName(code) {
      if (!code) return ''
      const t = this.store.teams.find(t => t.code === code)
      return t?.name || code
    }
  }
}
</script>
