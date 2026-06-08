<template>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" :class="colorClass">
    <span>{{ icon }}</span>
    <span>{{ value }}</span>
  </span>
</template>

<script>
export default {
  name: 'StatBadge',
  props: {
    type: { type: String, default: 'goals' },
    value: { type: [Number, String], default: 0 }
  },
  computed: {
    icon() {
      const icons = { goals: '⚽', assists: '🎯', yellow_cards: '🟡', red_cards: '🔴', minutes: '⏱', appearances: '👕', points: '🏆' }
      return icons[this.type] || '📊'
    },
    colorClass() {
      const classes = {
        goals: 'bg-wc-green/20 text-wc-green',
        assists: 'bg-blue-500/20 text-blue-400',
        yellow_cards: 'bg-yellow-500/20 text-yellow-400',
        red_cards: 'bg-wc-red/20 text-red-400',
        minutes: 'bg-surface-500 text-gray-300',
        appearances: 'bg-surface-500 text-gray-300',
        points: 'bg-wc-gold/20 text-wc-gold'
      }
      return classes[this.type] || 'bg-surface-500 text-gray-300'
    }
  }
}
</script>
