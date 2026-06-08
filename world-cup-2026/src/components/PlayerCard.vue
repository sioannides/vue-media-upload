<template>
  <router-link
    :to="`/player/${player.id}`"
    class="glass-card card-hover rounded-xl p-4 flex items-center gap-3 no-underline"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <div class="w-12 h-12 rounded-full bg-surface-500 flex items-center justify-center text-2xl">
        👤
      </div>
      <div class="absolute -bottom-1 -right-1">
        <TeamFlag :code="player.team_code || player.country_code" :size="18" />
      </div>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-white text-sm truncate">{{ player.name }}</p>
      <p class="text-xs text-gray-400 truncate">{{ player.team }} · {{ posLabel }}</p>
      <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
        <StatBadge v-if="stats.goals" type="goals" :value="stats.goals" />
        <StatBadge v-if="stats.assists" type="assists" :value="stats.assists" />
        <StatBadge v-if="stats.yellow_cards" type="yellow_cards" :value="stats.yellow_cards" />
        <StatBadge v-if="stats.red_cards" type="red_cards" :value="stats.red_cards" />
      </div>
    </div>

    <!-- Jersey number -->
    <div v-if="player.jersey_number" class="flex-shrink-0 w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center text-xs font-bold text-gray-300">
      {{ player.jersey_number }}
    </div>
  </router-link>
</template>

<script>
import TeamFlag from './TeamFlag.vue'
import StatBadge from './StatBadge.vue'
import { useWorldCupStore } from '../stores/worldcup.js'

export default {
  name: 'PlayerCard',
  components: { TeamFlag, StatBadge },
  props: { player: { type: Object, required: true } },
  setup() { return { store: useWorldCupStore() } },
  computed: {
    stats() {
      const s = this.store.playerStats.find(s => String(s.player_id) === String(this.player.id) || String(s.id) === String(this.player.id))
      return s || {}
    },
    posLabel() {
      const map = { GK: 'Goalkeeper', CB: 'Defender', LB: 'Defender', RB: 'Defender', DF: 'Defender', DEF: 'Defender', MF: 'Midfielder', MID: 'Midfielder', CM: 'Midfielder', FW: 'Forward', FWD: 'Forward', ST: 'Forward', CF: 'Forward' }
      return map[this.player.position] || this.player.position || 'Player'
    }
  }
}
</script>
