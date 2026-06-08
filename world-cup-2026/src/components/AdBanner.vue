<template>
  <div class="w-full overflow-hidden rounded-xl" :class="containerClass">
    <!-- Google AdSense slot -->
    <div v-if="type === 'adsense' && pubId" :key="slotKey">
      <ins
        class="adsbygoogle"
        style="display:block;"
        :data-ad-client="pubId"
        :data-ad-slot="slotId"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>

    <!-- Booking.com affiliate banner -->
    <BookingBanner v-else-if="type === 'booking'" :variant="variant" />

    <!-- Placeholder when no keys configured -->
    <div v-else class="bg-surface-700 border border-surface-500 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6" :class="sizeClass">
      <p class="text-xs text-gray-500 mb-1">📣 Advertisement Space</p>
      <p class="text-xs text-gray-600">Configure <code class="text-wc-gold">VITE_ADSENSE_PUB_ID</code> or use <code class="text-wc-gold">type="booking"</code></p>
    </div>
  </div>
</template>

<script>
import BookingBanner from './BookingBanner.vue'

export default {
  name: 'AdBanner',
  components: { BookingBanner },
  props: {
    type: { type: String, default: 'adsense' },
    slotId: { type: String, default: '' },
    size: { type: String, default: 'leaderboard' },
    variant: { type: String, default: 'usa' }
  },
  data() {
    return { pubId: import.meta.env.VITE_ADSENSE_PUB_ID || '', slotKey: Date.now() }
  },
  computed: {
    containerClass() { return '' },
    sizeClass() {
      return { leaderboard: 'h-24', rectangle: 'h-32', banner: 'h-16' }[this.size] || 'h-24'
    }
  },
  mounted() {
    if (this.type === 'adsense' && this.pubId && typeof window !== 'undefined') {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
    }
  }
}
</script>
