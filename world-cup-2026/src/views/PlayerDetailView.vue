<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <router-link to="/players" class="inline-flex items-center gap-2 text-gray-400 hover:text-wc-gold transition-colors text-sm mb-6">
        ← {{ $t('nav.players') }}
      </router-link>

      <div v-if="store.loading && !player" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!player" class="glass-card p-10 text-center">
        <p class="text-gray-400 text-xl">{{ $t('common.notFound') }}</p>
        <router-link to="/players" class="mt-4 inline-block text-wc-gold hover:underline">← {{ $t('nav.players') }}</router-link>
      </div>

      <template v-else>
        <div class="glass-card p-6 mb-6">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-surface-600 flex items-center justify-center text-4xl font-black text-wc-gold border-2 border-surface-500 flex-shrink-0">
              {{ initials }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-black text-white mb-1">{{ player.name }}</h1>
              <div class="flex items-center gap-2 mb-2">
                <TeamFlag :code="player.team_code || player.country_code" :size="20" />
                <span class="text-gray-300 text-sm">{{ player.team }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs font-bold bg-surface-600 text-wc-gold px-3 py-1 rounded-full">{{ position }}</span>
                <span v-if="player.jersey_number" class="text-xs font-bold bg-surface-600 text-white px-3 py-1 rounded-full">#{{ player.jersey_number }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="stats" class="glass-card p-6 mb-6">
          <h2 class="text-wc-gold font-bold text-lg mb-4">{{ $t('players.tournamentStats') }}</h2>
          <div class="grid grid-cols-4 gap-3">
            <div v-for="stat in statItems" :key="stat.key" class="bg-surface-700 rounded-xl p-3 text-center">
              <div class="text-2xl font-black" :class="stat.color">{{ stat.value }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div v-else class="glass-card p-6 mb-6 text-center">
          <p class="text-gray-400">{{ $t('players.noStats') }}</p>
        </div>

        <div v-if="player.team_code" class="glass-card p-5 mb-6">
          <h3 class="text-wc-gold font-bold mb-3">{{ $t('players.teamContext') }}</h3>
          <div class="flex items-center gap-3">
            <TeamFlag :code="player.team_code" :size="40" />
            <div>
              <div class="text-white font-semibold">{{ player.team }}</div>
              <router-link :to="{ name: 'matches', query: { group: playerGroup } }" class="text-xs text-wc-gold hover:underline" v-if="playerGroup">
                {{ $t('groups.group') }} {{ playerGroup }} {{ $t('matches.title') }}
              </router-link>
            </div>
          </div>
        </div>

        <div class="glass-card p-5">
          <SocialShare
            :title="`${player.name} | FIFA World Cup 2026`"
            :text="`Check out ${player.name}'s stats at the 2026 FIFA World Cup!`"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import TeamFlag from '@/components/TeamFlag.vue'
import SocialShare from '@/components/SocialShare.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const POSITION_LABELS = { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward', ATT: 'Attacker' }

export default {
  name: 'PlayerDetailView',
  components: { TeamFlag, SocialShare, LoadingSpinner },
  props: { id: { type: String, default: null } },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  computed: {
    player() {
      const id = this.id || this.$route.params.id
      return this.store.getPlayerById(id)
    },
    stats() {
      if (!this.player) return null
      return this.store.playerStats.find(s => String(s.player_id) === String(this.player.id) || String(s.id) === String(this.player.id)) || null
    },
    initials() {
      if (!this.player?.name) return '?'
      return this.player.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    },
    position() {
      if (!this.player?.position) return 'Player'
      const p = this.player.position.toUpperCase()
      return POSITION_LABELS[p] || p
    },
    playerGroup() {
      const team = this.store.teams.find(t => t.code === this.player?.team_code)
      return team?.group || null
    },
    statItems() {
      if (!this.stats) return []
      return [
        { key: 'goals', label: this.$t('players.goals'), value: this.stats.goals ?? 0, color: 'text-wc-gold' },
        { key: 'assists', label: this.$t('players.assists'), value: this.stats.assists ?? 0, color: 'text-blue-400' },
        { key: 'games', label: this.$t('players.games'), value: this.stats.games_played ?? this.stats.appearances ?? 0, color: 'text-white' },
        { key: 'minutes', label: this.$t('players.minutes'), value: this.stats.minutes_played ?? 0, color: 'text-gray-300' },
        { key: 'shots', label: this.$t('players.shots'), value: this.stats.shots ?? 0, color: 'text-green-400' },
        { key: 'yellow', label: this.$t('players.yellow'), value: this.stats.yellow_cards ?? 0, color: 'text-yellow-400' },
        { key: 'red', label: this.$t('players.red'), value: this.stats.red_cards ?? 0, color: 'text-red-400' },
        { key: 'rating', label: this.$t('players.rating'), value: this.stats.rating ? Number(this.stats.rating).toFixed(1) : '–', color: 'text-wc-gold' }
      ]
    }
  }
}
</script>
