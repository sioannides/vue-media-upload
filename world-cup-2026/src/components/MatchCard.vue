<template>
  <router-link
    :to="`/match/${match.id}`"
    class="block glass-card card-hover rounded-xl overflow-hidden no-underline"
    :class="{ 'ring-2 ring-wc-red': match.status === 'live' }"
  >
    <!-- Status bar -->
    <div class="px-4 pt-3 pb-1 flex items-center justify-between">
      <span class="text-xs text-gray-400 uppercase tracking-wider">
        {{ match.group ? `Group ${match.group}` : match.round }}
      </span>
      <span
        class="text-xs font-bold px-2 py-0.5 rounded-full"
        :class="statusClass"
      >
        <span v-if="match.status === 'live'" class="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
        {{ statusLabel }}
      </span>
    </div>

    <!-- Teams & Score -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <!-- Home team -->
        <div class="flex-1 flex flex-col items-center gap-2 min-w-0">
          <TeamFlag :code="match.home_code" :size="40" />
          <span class="text-sm font-semibold text-white text-center truncate w-full">{{ match.home_team }}</span>
        </div>

        <!-- Score / VS -->
        <div class="flex flex-col items-center flex-shrink-0 min-w-[70px]">
          <div v-if="hasScore" class="text-2xl font-black font-mono" style="color:#F4A820;">
            {{ match.home_score }} – {{ match.away_score }}
          </div>
          <div v-else class="text-xl font-bold text-gray-400">vs</div>
          <div v-if="!hasScore && match.date" class="text-xs text-gray-400 mt-1 text-center">
            {{ formatDate(match.date) }}<br v-if="match.time"/>
            <span v-if="match.time" class="text-wc-gold">{{ match.time }}</span>
          </div>
        </div>

        <!-- Away team -->
        <div class="flex-1 flex flex-col items-center gap-2 min-w-0">
          <TeamFlag :code="match.away_code" :size="40" />
          <span class="text-sm font-semibold text-white text-center truncate w-full">{{ match.away_team }}</span>
        </div>
      </div>
    </div>

    <!-- Venue -->
    <div v-if="match.stadium || match.city" class="px-4 pb-3 text-xs text-gray-500 text-center truncate">
      📍 {{ [match.stadium, match.city].filter(Boolean).join(', ') }}
    </div>
  </router-link>
</template>

<script>
import TeamFlag from './TeamFlag.vue'

export default {
  name: 'MatchCard',
  components: { TeamFlag },
  props: { match: { type: Object, required: true } },
  computed: {
    hasScore() {
      return this.match.home_score !== null && this.match.away_score !== null
    },
    statusLabel() {
      if (this.match.status === 'live') return 'LIVE'
      if (this.match.status === 'completed' || this.hasScore) return 'FT'
      return 'Upcoming'
    },
    statusClass() {
      if (this.match.status === 'live') return 'bg-wc-red/20 text-wc-red'
      if (this.match.status === 'completed' || this.hasScore) return 'bg-surface-500 text-gray-400'
      return 'bg-wc-gold/10 text-wc-gold'
    }
  },
  methods: {
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }
}
</script>
