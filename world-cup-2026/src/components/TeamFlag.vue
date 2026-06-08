<template>
  <div class="inline-flex items-center gap-2" :class="wrapperClass">
    <img
      v-if="flagUrl"
      :src="flagUrl"
      :alt="code"
      :width="size"
      :height="Math.round(size * 0.67)"
      class="rounded-sm object-cover flex-shrink-0"
      style="display:inline-block;"
      @error="onError"
    />
    <div
      v-else
      class="rounded-sm bg-surface-500 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0"
      :style="{ width: size + 'px', height: Math.round(size * 0.67) + 'px' }"
    >{{ code?.slice(0,3) }}</div>
    <span v-if="showName" class="truncate font-medium" :class="nameClass">{{ name || code }}</span>
  </div>
</template>

<script>
import { getFlag } from '../data/flagCodes.js'
export default {
  name: 'TeamFlag',
  props: {
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: Number, default: 32 },
    showName: { type: Boolean, default: false },
    nameClass: { type: String, default: 'text-white text-sm' },
    wrapperClass: { type: String, default: '' }
  },
  data() { return { errored: false } },
  computed: {
    flagUrl() {
      if (this.errored || !this.code) return null
      return getFlag(this.code, this.size <= 24 ? 40 : 80)
    }
  },
  methods: { onError() { this.errored = true } }
}
</script>
