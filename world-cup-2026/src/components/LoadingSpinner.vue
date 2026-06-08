<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="rounded-full border-4 animate-spin"
      :class="[sizeClass, colorClass]"
    />
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: { type: String, default: 'md' },
    color: { type: String, default: 'gold' },
    fullscreen: { type: Boolean, default: false }
  },
  computed: {
    containerClass() {
      return this.fullscreen ? 'min-h-screen' : 'py-12'
    },
    sizeClass() {
      return { sm: 'w-6 h-6 border-2', md: 'w-10 h-10', lg: 'w-16 h-16 border-8' }[this.size] || 'w-10 h-10'
    },
    colorClass() {
      if (this.color === 'gold') return 'border-surface-600 border-t-wc-gold'
      if (this.color === 'white') return 'border-surface-600 border-t-white'
      return 'border-surface-600 border-t-wc-gold'
    }
  }
}
</script>
