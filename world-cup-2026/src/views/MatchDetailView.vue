<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <router-link to="/matches" class="inline-flex items-center gap-2 text-gray-400 hover:text-wc-gold transition-colors text-sm mb-6">
        ← {{ $t('common.back') }}
      </router-link>

      <div v-if="store.loading && !match" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!match" class="glass-card p-10 text-center">
        <p class="text-gray-400 text-xl">{{ $t('common.notFound') }}</p>
        <router-link to="/matches" class="mt-4 inline-block text-wc-gold hover:underline">← {{ $t('nav.matches') }}</router-link>
      </div>

      <template v-else>
        <div class="glass-card p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs text-gray-400 uppercase tracking-wider">{{ match.group ? `Group ${match.group}` : match.round }}</span>
            <span class="text-xs font-bold px-3 py-1 rounded-full" :class="statusClass">
              <span v-if="match.status === 'live'" class="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
              {{ statusLabel }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-6">
            <div class="flex-1 flex flex-col items-center gap-3">
              <TeamFlag :code="match.home_code" :size="72" />
              <h2 class="text-xl font-bold text-white text-center">{{ match.home_team }}</h2>
            </div>
            <div class="flex flex-col items-center gap-2">
              <div v-if="match.home_score !== null" class="text-5xl font-black text-wc-gold">
                {{ match.home_score }} – {{ match.away_score }}
              </div>
              <div v-else class="text-2xl font-bold text-gray-400">VS</div>
              <div v-if="match.date" class="text-sm text-gray-400">
                {{ formatDate(match.date) }}<span v-if="match.time"> · {{ match.time }}</span>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-center gap-3">
              <TeamFlag :code="match.away_code" :size="72" />
              <h2 class="text-xl font-bold text-white text-center">{{ match.away_team }}</h2>
            </div>
          </div>

          <div v-if="match.stadium || match.city" class="mt-4 text-center text-sm text-gray-400">
            📍 {{ [match.stadium, match.city, match.country].filter(Boolean).join(', ') }}
          </div>
        </div>

        <div class="glass-card p-5 mb-6">
          <h3 class="text-wc-gold font-bold mb-3 text-lg">{{ $t('match.description') }}</h3>
          <p class="text-gray-300 leading-relaxed">{{ description }}</p>
        </div>

        <div class="glass-card p-5 mb-6">
          <h3 class="text-wc-gold font-bold mb-4 text-lg">🎦 {{ $t('match.highlights') }}</h3>
          <div class="flex flex-wrap gap-3">
            <a :href="youtubeHighlights" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-lg transition-colors">
              ▶ {{ $t('match.watchHighlights') }}
            </a>
            <a :href="youtubeGoals" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-2 bg-surface-600 hover:bg-surface-500 border border-surface-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
              ⚽ {{ $t('match.watchGoals') }}
            </a>
          </div>
        </div>

        <div class="glass-card p-5 mb-6">
          <h3 class="text-wc-gold font-bold mb-4 text-lg">📡 {{ $t('watch.title') }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LiveStreamCard v-for="stream in featuredStreams" :key="stream.id" :stream="stream" />
          </div>
          <router-link to="/watch" class="mt-3 inline-block text-sm text-gray-400 hover:text-wc-gold transition-colors">
            {{ $t('watch.viewAll') }} →
          </router-link>
        </div>

        <div v-if="match.group" class="glass-card p-5 mb-6">
          <h3 class="text-wc-gold font-bold mb-4 text-lg">{{ $t('groups.group') }} {{ match.group }} {{ $t('groups.standings') }}</h3>
          <GroupTable :letter="match.group" />
        </div>

        <div class="glass-card p-5 mb-6">
          <h3 class="text-gray-300 font-semibold mb-3">{{ $t('common.share') }}</h3>
          <SocialShare
            :title="`${match.home_team} vs ${match.away_team} | FIFA World Cup 2026`"
            :text="`${description}`"
          />
        </div>

        <BookingBanner variant="usa" />
      </template>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { generateDescription } from '@/utils/matchDescription.js'
import { buildYoutubeUrl, buildGoalsUrl } from '@/utils/youtubeSearch.js'
import { STREAMS } from '@/data/liveStreams.js'
import TeamFlag from '@/components/TeamFlag.vue'
import GroupTable from '@/components/GroupTable.vue'
import LiveStreamCard from '@/components/LiveStreamCard.vue'
import SocialShare from '@/components/SocialShare.vue'
import BookingBanner from '@/components/BookingBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'MatchDetailView',
  components: { TeamFlag, GroupTable, LiveStreamCard, SocialShare, BookingBanner, LoadingSpinner },
  props: { id: { type: String, default: null } },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  computed: {
    match() {
      const id = this.id || this.$route.params.id
      return this.store.getMatchById(id)
    },
    statusClass() {
      if (!this.match) return ''
      if (this.match.status === 'live') return 'bg-wc-red text-white'
      if (this.match.status === 'completed') return 'bg-surface-600 text-gray-300'
      return 'bg-wc-navy text-gray-300'
    },
    statusLabel() {
      if (!this.match) return ''
      if (this.match.status === 'live') return 'LIVE'
      if (this.match.status === 'completed') return this.$t('match.fullTime')
      return this.$t('match.upcoming')
    },
    description() {
      if (!this.match) return ''
      const standings = this.match.group ? this.store.getGroupStandings(this.match.group) : []
      return generateDescription(this.match, standings)
    },
    youtubeHighlights() {
      if (!this.match) return '#'
      return buildYoutubeUrl(this.match.home_team, this.match.away_team)
    },
    youtubeGoals() {
      if (!this.match) return '#'
      return buildGoalsUrl(this.match.home_team, this.match.away_team)
    },
    featuredStreams() {
      return STREAMS.filter(s => s.free).slice(0, 4)
    }
  },
  methods: {
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }
}
</script>
