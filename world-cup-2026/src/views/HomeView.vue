<template>
  <div>
    <!-- Live Score Ticker -->
    <div v-if="store.games.some(g => g.status === 'live')" class="bg-wc-red text-white text-xs py-1.5 overflow-hidden relative">
      <div class="ticker-scroll whitespace-nowrap px-4">
        <span v-for="match in liveMatches" :key="match.id" class="mr-8">
          ⚡ LIVE: {{ match.home_team }} {{ match.home_score }} – {{ match.away_score }} {{ match.away_team }}
        </span>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #0a0f1a 0%, #00205B 50%, #0a0f1a 100%); min-height: 500px;">
      <div class="absolute inset-0 pitch-pattern opacity-20"></div>
      <div class="absolute top-10 right-10 w-64 h-64 rounded-full opacity-5" style="background: #F4A820; filter: blur(60px);"></div>
      <div class="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-5" style="background: #F4A820; filter: blur(40px);"></div>

      <div class="relative max-w-5xl mx-auto px-4 py-20 text-center">
        <div class="inline-flex items-center gap-2 bg-wc-gold/10 border border-wc-gold/30 rounded-full px-4 py-1.5 text-wc-gold text-sm font-semibold mb-6">
          ⚽ {{ $t('home.hero_dates') }}
        </div>
        <h1 class="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          FIFA<br><span style="color:#F4A820;">World Cup</span><br>2026
        </h1>
        <p class="text-lg text-gray-400 mb-8">{{ $t('home.hero_subtitle') }}</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="glass-card rounded-xl py-4 px-3 text-center">
            <div class="text-3xl font-black text-wc-gold">{{ stat.value }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ $t(stat.label) }}</div>
          </div>
        </div>

        <div class="mt-8">
          <button
            v-if="canNotify"
            @click="enableNotifications"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-wc-gold/30 text-wc-gold text-sm hover:bg-wc-gold/10 transition-colors"
          >
            🔔 {{ $t('home.enable_alerts') }}
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="store.error" class="glass-card rounded-xl p-4 mb-6 border border-yellow-500/30">
        <p class="text-sm text-yellow-400">⚠️ {{ $t('common.api_notice') }}</p>
      </div>

      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">{{ store.hasLiveMatches ? $t('home.live_now') : $t('home.upcoming') }}</h2>
          <router-link to="/matches" class="text-sm text-wc-gold hover:underline no-underline">View all →</router-link>
        </div>
        <div v-if="store.loading" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MatchCard v-for="match in store.featuredMatches" :key="match.id" :match="match" />
        </div>
      </section>

      <div class="mb-10">
        <AdBanner type="booking" variant="usa" />
      </div>

      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white">{{ $t('groups.title') }}</h2>
          <router-link to="/groups" class="text-sm text-wc-gold hover:underline no-underline">View all groups →</router-link>
        </div>
        <div v-if="store.loading" class="flex justify-center py-12"><LoadingSpinner /></div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <GroupTable v-for="letter in previewGroups" :key="letter" :letter="letter" />
        </div>
      </section>

      <div class="mb-6">
        <AdBanner type="adsense" size="leaderboard" />
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '../stores/worldcup.js'
import MatchCard from '../components/MatchCard.vue'
import GroupTable from '../components/GroupTable.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AdBanner from '../components/AdBanner.vue'

export default {
  name: 'HomeView',
  components: { MatchCard, GroupTable, LoadingSpinner, AdBanner },
  setup() { return { store: useWorldCupStore() } },
  data() {
    return {
      canNotify: 'Notification' in window && Notification.permission === 'default',
      stats: [
        { value: 104, label: 'home.total_matches' },
        { value: 12, label: 'home.total_groups' },
        { value: 48, label: 'home.total_teams' },
        { value: 16, label: 'home.total_stadiums' }
      ]
    }
  },
  computed: {
    liveMatches() { return this.store.games.filter(g => g.status === 'live') },
    previewGroups() { return this.store.groupLetters.slice(0, 4) }
  },
  methods: {
    async enableNotifications() {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        this.canNotify = false
        this.scheduleMatchNotifications()
        new Notification('World Cup 2026 Alerts Enabled!', {
          body: 'You will be notified 15 minutes before each match.',
          icon: '/icon-192.png'
        })
      }
    },
    scheduleMatchNotifications() {
      this.store.games.filter(g => g.status === 'scheduled' && g.date).forEach(match => {
        const matchTime = new Date(match.date + (match.time ? 'T' + match.time : 'T00:00'))
        const alertTime = matchTime.getTime() - 15 * 60 * 1000
        const delay = alertTime - Date.now()
        if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification(`⚽ ${match.home_team} vs ${match.away_team}`, {
                body: `Kick-off in 15 minutes at ${match.stadium || 'TBD'}`,
                icon: '/icon-192.png'
              })
            }
          }, delay)
        }
      })
    }
  }
}
</script>
