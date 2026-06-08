<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.fantasy') }}</h1>
      </div>
      <p class="text-gray-400 mb-6">{{ $t('fantasy.subtitle') }}</p>

      <div class="glass-card p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[180px]">
          <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{{ $t('fantasy.teamName') }}</label>
          <input
            :value="fantasy.teamName"
            @input="fantasy.setTeamName($event.target.value)"
            type="text"
            maxlength="30"
            class="w-full bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-wc-gold"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wider">{{ $t('fantasy.formation') }}</label>
          <div class="flex gap-2">
            <button
              v-for="f in formations"
              :key="f"
              @click="fantasy.setFormation(f)"
              :class="fantasy.formation === f ? 'bg-wc-gold text-black' : 'bg-surface-600 text-gray-300 hover:bg-surface-500'"
              class="px-3 py-2 rounded-lg text-sm font-bold transition-colors"
            >{{ f }}</button>
          </div>
        </div>
        <div v-if="fantasy.isFull" class="flex items-end">
          <span class="text-green-400 text-sm font-semibold">✓ {{ $t('fantasy.teamComplete') }}</span>
        </div>
      </div>

      <div class="glass-card p-4 mb-6 relative overflow-hidden pitch-bg">
        <div class="absolute inset-0 pitch-pattern opacity-10"></div>
        <div class="relative z-10">
          <div v-for="(row, rowKey) in pitchRows" :key="rowKey" class="mb-4">
            <div class="flex justify-center gap-3 flex-wrap">
              <div
                v-for="slot in row"
                :key="slot.key"
                @click="openModal(slot)"
                class="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div
                  class="w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all"
                  :class="slot.player ? 'border-wc-gold bg-surface-700' : 'border-surface-500 bg-surface-800/60 group-hover:border-wc-gold/70'"
                >
                  <div v-if="slot.player" class="text-center">
                    <TeamFlag :code="slot.player.team_code || slot.player.country_code" :size="28" />
                  </div>
                  <div v-else class="text-center">
                    <span class="text-2xl text-gray-500 group-hover:text-gray-300">+</span>
                  </div>
                </div>
                <div class="text-center max-w-[72px]">
                  <div v-if="slot.player" class="text-white text-xs font-semibold leading-tight truncate max-w-[72px]">{{ shortName(slot.player.name) }}</div>
                  <div v-else class="text-gray-500 text-xs">{{ slot.pos }}</div>
                </div>
                <button
                  v-if="slot.player"
                  @click.stop="fantasy.removePlayer(slot.key)"
                  class="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="fantasy.isFull" class="glass-card p-5 mb-6">
        <h3 class="text-wc-gold font-bold mb-3">{{ $t('fantasy.shareTeam') }}</h3>
        <SocialShare
          :title="`${fantasy.teamName} | My #WC2026 Fantasy XI`"
          :text="shareText"
        />
      </div>

      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative z-10 glass-card p-5 w-full max-w-lg max-h-[80vh] flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-wc-gold font-bold">{{ $t('fantasy.selectPlayer') }} ({{ selectedSlot?.pos }})</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-white text-xl">✕</button>
          </div>
          <input
            v-model="playerSearch"
            type="text"
            :placeholder="$t('players.searchPlaceholder')"
            class="w-full bg-surface-600 border border-surface-500 text-white text-sm rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-wc-gold placeholder-gray-500"
          />
          <div class="overflow-y-auto flex-1">
            <div v-if="!modalPlayers.length" class="text-center py-8 text-gray-400">
              <p>{{ $t('players.noPlayers') }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ $t('fantasy.noPlayersHint') }}</p>
            </div>
            <div v-else class="space-y-1">
              <button
                v-for="p in modalPlayers"
                :key="p.id"
                @click="assignPlayer(p)"
                class="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-600 transition-colors text-left"
              >
                <TeamFlag :code="p.team_code || p.country_code" :size="24" />
                <div class="flex-1 min-w-0">
                  <div class="text-white text-sm font-semibold truncate">{{ p.name }}</div>
                  <div class="text-gray-400 text-xs">{{ p.team }} · {{ p.position }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import { useFantasyStore } from '@/stores/fantasy.js'
import TeamFlag from '@/components/TeamFlag.vue'
import SocialShare from '@/components/SocialShare.vue'

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1']

export default {
  name: 'FantasyView',
  components: { TeamFlag, SocialShare },
  setup() {
    const store = useWorldCupStore()
    const fantasy = useFantasyStore()
    return { store, fantasy }
  },
  data() {
    return { formations: FORMATIONS, modalOpen: false, selectedSlot: null, playerSearch: '' }
  },
  computed: {
    pitchRows() {
      const rows = { FWD: [], MID: [], DEF: [], GK: [] }
      this.fantasy.slots.forEach(slot => {
        if (rows[slot.pos]) rows[slot.pos].push(slot)
      })
      return rows
    },
    modalPlayers() {
      let list = this.store.players
      if (!list.length) {
        list = this.store.teams.map(t => ({
          id: 'seed_' + t.code,
          name: `${t.name} Player`,
          team: t.name,
          team_code: t.code,
          position: this.selectedSlot?.pos || 'MID',
          country_code: t.code
        }))
      }
      if (this.selectedSlot?.pos) {
        list = list.filter(p => {
          const pos = (p.position || 'MID').toUpperCase()
          if (this.selectedSlot.pos === 'GK') return pos === 'GK'
          if (this.selectedSlot.pos === 'DEF') return pos === 'DEF' || pos === 'CB' || pos === 'LB' || pos === 'RB'
          if (this.selectedSlot.pos === 'MID') return pos === 'MID' || pos === 'CM' || pos === 'CAM' || pos === 'CDM'
          if (this.selectedSlot.pos === 'FWD') return pos === 'FWD' || pos === 'ST' || pos === 'CF' || pos === 'LW' || pos === 'RW' || pos === 'ATT'
          return true
        })
      }
      if (this.playerSearch) {
        const q = this.playerSearch.toLowerCase()
        list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.team || '').toLowerCase().includes(q))
      }
      return list.slice(0, 50)
    },
    shareText() {
      const players = this.fantasy.slots.map(s => s.player?.name || '?').join(', ')
      return `My ${this.fantasy.teamName} (${this.fantasy.formation}): ${players} 🏆 #WC2026 #FantasyXI`
    }
  },
  methods: {
    shortName(name) {
      if (!name) return ''
      const parts = name.split(' ')
      if (parts.length <= 1) return name
      return parts[parts.length - 1]
    },
    openModal(slot) { this.selectedSlot = slot; this.playerSearch = ''; this.modalOpen = true },
    closeModal() { this.modalOpen = false; this.selectedSlot = null },
    assignPlayer(player) { this.fantasy.assignPlayer(this.selectedSlot.key, player); this.closeModal() }
  }
}
</script>
