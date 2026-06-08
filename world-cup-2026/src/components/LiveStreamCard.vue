<template>
  <a
    :href="stream.url"
    target="_blank"
    rel="noopener noreferrer"
    class="glass-card card-hover rounded-xl p-4 flex flex-col gap-3 no-underline"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{{ stream.logo }}</span>
        <div>
          <h3 class="font-bold text-white text-sm">{{ stream.name }}</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ stream.languages.join(' · ') }}</p>
        </div>
      </div>
      <span
        class="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
        :class="stream.free ? 'bg-wc-green/20 text-wc-green' : 'bg-yellow-500/20 text-yellow-400'"
      >{{ stream.free ? $t('watch.free') : $t('watch.subscription') }}</span>
    </div>

    <!-- Description -->
    <p class="text-xs text-gray-400 leading-relaxed">{{ stream.description }}</p>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <div class="flex gap-1 flex-wrap">
        <span v-for="region in stream.regions" :key="region" class="text-xs bg-surface-600 text-gray-300 px-2 py-0.5 rounded">
          {{ region }}
        </span>
      </div>
      <span class="text-xs font-semibold text-wc-gold">{{ $t('watch.watch_now') }}</span>
    </div>

    <div v-if="stream.requiresAccount" class="text-xs text-gray-500">
      ⚠️ {{ $t('watch.requires_account') }}
    </div>
  </a>
</template>

<script>
export default {
  name: 'LiveStreamCard',
  props: { stream: { type: Object, required: true } }
}
</script>
