<template>
  <div class="glass-card rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-surface-600/50 border-b border-surface-500">
      <h3 class="font-bold text-white">Group {{ letter }}</h3>
      <span class="text-xs text-gray-400">{{ $t('groups.qualify_note') }}</span>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs uppercase tracking-wider text-gray-500 border-b border-surface-600">
            <th class="text-left pl-4 py-2 w-8">{{ $t('groups.pos') }}</th>
            <th class="text-left py-2">{{ $t('groups.team') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.played') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.won') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.drawn') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.lost') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.gf') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.ga') }}</th>
            <th class="text-center py-2 w-8">{{ $t('groups.gd') }}</th>
            <th class="text-center py-2 pr-4 w-10 font-bold text-wc-gold">{{ $t('groups.pts') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, idx) in standings"
            :key="entry.team || idx"
            class="border-b border-surface-600/50 last:border-0 transition-colors hover:bg-surface-600/30"
            :class="{
              'border-l-2 border-l-wc-green': idx < 2,
              'border-l-2 border-l-yellow-500': idx === 2
            }"
          >
            <td class="pl-4 py-2.5 text-gray-400 font-mono">{{ idx + 1 }}</td>
            <td class="py-2.5">
              <div class="flex items-center gap-2">
                <TeamFlag :code="entry.code" :size="20" />
                <span class="font-medium text-white text-xs md:text-sm">{{ entry.team }}</span>
              </div>
            </td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.played }}</td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.won }}</td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.drawn }}</td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.lost }}</td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.goals_for }}</td>
            <td class="text-center py-2.5 text-gray-300">{{ entry.goals_against }}</td>
            <td class="text-center py-2.5" :class="entry.goal_difference > 0 ? 'text-wc-green' : entry.goal_difference < 0 ? 'text-red-400' : 'text-gray-400'">
              {{ entry.goal_difference > 0 ? '+' : '' }}{{ entry.goal_difference }}
            </td>
            <td class="text-center pr-4 py-2.5 font-black text-white text-base">{{ entry.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!standings.length" class="py-6 text-center text-gray-500 text-sm">
      {{ $t('common.no_data') }}
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '../stores/worldcup.js'
import TeamFlag from './TeamFlag.vue'

export default {
  name: 'GroupTable',
  components: { TeamFlag },
  props: { letter: { type: String, required: true } },
  setup() {
    return { store: useWorldCupStore() }
  },
  computed: {
    standings() {
      return this.store.getGroupStandings(this.letter)
    }
  }
}
</script>
