<template>
  <div class="bg-surface-700 rounded-lg overflow-hidden border border-surface-500 text-xs w-40">
    <div
      v-for="(team, idx) in [homeTeam, awayTeam]"
      :key="idx"
      class="flex items-center gap-2 px-2 py-1.5"
      :class="[
        idx === 0 ? 'border-b border-surface-600' : '',
        isWinner(team) ? 'bg-wc-gold/10' : ''
      ]"
    >
      <TeamFlag v-if="team.code" :code="team.code" :size="16" />
      <span class="flex-1 truncate font-medium" :class="isWinner(team) ? 'text-wc-gold' : 'text-gray-300'">
        {{ team.name || 'TBD' }}
      </span>
      <span v-if="team.score !== null" class="font-bold" :class="isWinner(team) ? 'text-wc-gold' : 'text-gray-400'">
        {{ team.score }}
      </span>
    </div>
  </div>
</template>

<script>
import TeamFlag from './TeamFlag.vue'
export default {
  name: 'BracketMatch',
  components: { TeamFlag },
  props: {
    homeTeam: { type: Object, default: () => ({ name: 'TBD', code: '', score: null }) },
    awayTeam: { type: Object, default: () => ({ name: 'TBD', code: '', score: null }) },
    winner: { type: String, default: null }
  },
  methods: {
    isWinner(team) {
      return this.winner && team.name === this.winner
    }
  }
}
</script>
