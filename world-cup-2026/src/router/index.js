import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/groups', name: 'groups', component: () => import('../views/GroupsView.vue') },
  { path: '/matches', name: 'matches', component: () => import('../views/MatchesView.vue') },
  { path: '/match/:id', name: 'match-detail', component: () => import('../views/MatchDetailView.vue'), props: true },
  { path: '/players', name: 'players', component: () => import('../views/PlayersView.vue') },
  { path: '/player/:id', name: 'player-detail', component: () => import('../views/PlayerDetailView.vue'), props: true },
  { path: '/watch', name: 'watch', component: () => import('../views/WatchView.vue') },
  { path: '/bracket', name: 'bracket', component: () => import('../views/BracketView.vue') },
  { path: '/predictor', name: 'predictor', component: () => import('../views/PredictorView.vue') },
  { path: '/h2h', name: 'h2h', component: () => import('../views/H2HView.vue') },
  { path: '/history', name: 'history', component: () => import('../views/HistoryView.vue') },
  { path: '/fantasy', name: 'fantasy', component: () => import('../views/FantasyView.vue') },
  { path: '/stadiums', name: 'stadiums', component: () => import('../views/StadiumsView.vue') },
  { path: '/simulator', name: 'simulator', component: () => import('../views/SimulatorView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
