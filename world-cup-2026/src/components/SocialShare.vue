<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      @click="share"
      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-wc-gold/10 hover:bg-wc-gold/20 text-wc-gold text-sm font-semibold transition-colors border border-wc-gold/30"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
      </svg>
      {{ $t('common.share') }}
    </button>

    <a v-if="!nativeShare" :href="twitterUrl" target="_blank" rel="noopener"
       class="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm transition-colors" title="Share on X">
      𝕏
    </a>
    <a v-if="!nativeShare" :href="whatsappUrl" target="_blank" rel="noopener"
       class="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm transition-colors" title="Share on WhatsApp">
      💬
    </a>

    <button @click="copyLink"
      class="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm transition-colors" :title="$t('common.copy_link')">
      <span v-if="copied">✅</span>
      <span v-else>🔗</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SocialShare',
  props: {
    title: { type: String, default: 'FIFA World Cup 2026' },
    text: { type: String, default: 'Check out the World Cup 2026 tracker!' },
    url: { type: String, default: '' }
  },
  data() { return { nativeShare: !!navigator.share, copied: false } },
  computed: {
    shareUrl() { return this.url || window.location.href },
    twitterUrl() { return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.text)}&url=${encodeURIComponent(this.shareUrl)}` },
    whatsappUrl() { return `https://wa.me/?text=${encodeURIComponent(this.text + ' ' + this.shareUrl)}` }
  },
  methods: {
    async share() {
      if (navigator.share) {
        try { await navigator.share({ title: this.title, text: this.text, url: this.shareUrl }) } catch {}
      } else {
        await this.copyLink()
      }
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.shareUrl)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
      } catch {}
    }
  }
}
</script>
