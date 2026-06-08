<template>
  <div class="min-h-screen bg-surface-900" style="font-family: 'Inter', system-ui, sans-serif;">
    <AppNavbar />
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
export default {
  name: 'App',
  components: { AppNavbar }
}
</script>
