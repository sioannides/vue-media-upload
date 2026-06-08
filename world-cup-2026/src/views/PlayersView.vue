<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.players') }}</h1>
      </div>

      <div v-if="store.topScorers.length" class="glass-card p-4 mb-6">
        <h2 class="text-wc-gold font-bold text-sm uppercase tracking-wider mb-3">⚽ {{ $t('players.topScorers') }}</h2>
        <div class="flex gap-4 overflow-x-auto pb-1">
          <div v-for="(scorer, i) in store.topScorers.slice(0, 8)" :key="scorer.id || i" class="flex-shrink-0 flex flex-col items-center gap-1 min-w-[72px]">
            <div class="relative">
              <div class="w-12 h-12 rounded-full bg-surface-600 flex items-center justify-center text-lg font-black text-wc-gold">
                {{ i + 1 }}
              </div>
              <span class="absolute -bottom-1 -right-1 text-xs bg-wc-gold text-black font-black px-1 rounded">{{ scorer.goals }}⚽</span>
            </div>
            <span class="text-xs text-white text-center leading-tight max-w-[72px] truncate">{{ scorer.player_name || scorer.name }}</span>
            <TeamFlag v-if="scorer.team_code" :code="scorer.team_code" :size="16" />
          </div>
        </div>
      </div>

      <div class="glass-card p-4 mb-6 flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          :placeholder="$t('players.searchPlaceholder')"
          class="flex-1 min-w-[200px] bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold placeholder-gray-500"
        />
        <select v-model="filterTeam" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="">{{ $t('players.allTeams') }}</option>
          <option v-for="t in teams" :key="t.code" :value="t.code">{{ t.name }}</option>
        </select>
        <select v-model="filterPosition" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="">{{ $t('players.allPositions') }}</option>
          <option value="GK">GK</option>
          <option value="DEF">DEF</option>
          <option value="MID">MID</option>
          <option value="FWD">FWD</option>
        </select>
        <select v-model="sortBy" class="bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-wc-gold">
          <option value="name">{{ $t('players.sortName') }}</option>
          <option value="goals">{{ $t('players.sortGoals') }}</option>
          <option value="team">{{ $t('players.sortTeam') }}</option>
        </select>
      </div>

      <div v-if="store.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!filteredPlayers.length" class="glass-card p-10 text-center">
        <p class="text-5xl mb-4">👤</p>
        <p class="text-gray-400 text-lg">{{ $t('players.noPlayers') }}</p>
        <p class="text-gray-500 text-sm mt-2">{{ $t('players.noPlayersHint') }}</p>
      </div>

      <div v-else>
        <p class="text-gray-500 text-sm mb-4">{{ filteredPlayers.length }} {{ $t('players.found') }}</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <PlayerCard
            v-for="player in filteredPlayers"
            :key="player.id"
            :player="player"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import PlayerCard from '@/components/PlayerCard.vue'
import TeamFlag from '@/components/TeamFlag.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'PlayersView',
  components: { PlayerCard, TeamFlag, LoadingSpinner },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  data() {
    return { search: '', filterTeam: '', filterPosition: '', sortBy: 'name' }
  },
  computed: {
    teams() {
      return [...new Map(this.store.players.map(p => [p.team_code, { name: p.team, code: p.team_code }])).values()].sort((a, b) => a.name.localeCompare(b.name))
    },
    filteredPlayers() {
      let list = [...this.store.players]
      if (this.search) {
        const q = this.search.toLowerCase()
        list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.team || '').toLowerCase().includes(q))
      }
      if (this.filterTeam) list = list.filter(p => p.team_code === this.filterTeam)
      if (this.filterPosition) list = list.filter(p => (p.position || '').toUpperCase().startsWith(this.filterPosition))
      if (this.sortBy === 'goals') {
        list.sort((a, b) => (this.getStats(b.id)?.goals || 0) - (this.getStats(a.id)?.goals || 0))
      } else if (this.sortBy === 'team') {
        list.sort((a, b) => (a.team || '').localeCompare(b.team || ''))
      } else {
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }
      return list
    }
  },
  methods: {
    getStats(playerId) {
      return this.store.playerStats.find(s => String(s.player_id) === String(playerId) || String(s.id) === String(playerId)) || null
    }
  }
}
</script>
