<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-1 h-8 bg-wc-gold rounded-full"></div>
        <h1 class="text-3xl font-bold text-white">{{ $t('nav.groups') }}</h1>
      </div>

      <div v-if="store.loading" class="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!groupLetters.length" class="glass-card p-10 text-center">
        <p class="text-gray-400 text-lg">{{ $t('common.noData') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="letter in groupLetters" :key="letter" class="glass-card p-4">
          <h2 class="text-wc-gold font-bold text-lg mb-3">{{ $t('groups.group') }} {{ letter }}</h2>
          <GroupTable :letter="letter" />
          <div class="mt-3 flex gap-2">
            <router-link
              :to="{ name: 'matches', query: { group: letter } }"
              class="text-xs text-gray-400 hover:text-wc-gold transition-colors"
            >{{ $t('groups.viewMatches') }} →</router-link>
          </div>
        </div>
      </div>

      <div class="mt-8 glass-card p-4">
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-green-500"></span><span class="text-gray-300">{{ $t('groups.advances') }}</span></div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-yellow-500"></span><span class="text-gray-300">{{ $t('groups.playoff') }}</span></div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-surface-500"></span><span class="text-gray-300">{{ $t('groups.eliminated') }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWorldCupStore } from '@/stores/worldcup.js'
import GroupTable from '@/components/GroupTable.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'GroupsView',
  components: { GroupTable, LoadingSpinner },
  setup() {
    const store = useWorldCupStore()
    return { store }
  },
  computed: {
    groupLetters() {
      return this.store.groupLetters
    }
  }
}
</script>
