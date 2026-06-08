import { defineStore } from 'pinia'
const FORMATIONS = { '4-4-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 }, '4-3-3': { GK: 1, DEF: 4, MID: 3, FWD: 3 }, '3-5-2': { GK: 1, DEF: 3, MID: 5, FWD: 2 }, '4-2-3-1': { GK: 1, DEF: 4, MID: 5, FWD: 1 } }
function load() { try { return JSON.parse(localStorage.getItem('wc2026_fantasy') || 'null') } catch { return null } }
function save(data) { localStorage.setItem('wc2026_fantasy', JSON.stringify(data)) }
export const useFantasyStore = defineStore('fantasy', {
  state: () => { const saved = load(); return { teamName: saved?.teamName || 'My World Cup XI', formation: saved?.formation || '4-3-3', squad: saved?.squad || {} } },
  getters: {
    formationShape: (state) => FORMATIONS[state.formation],
    slots(state) {
      const shape = FORMATIONS[state.formation]; const result = []
      ;[['GK', shape.GK], ['DEF', shape.DEF], ['MID', shape.MID], ['FWD', shape.FWD]].forEach(([pos, count]) => {
        for (let i = 0; i < count; i++) { const key = `${pos}_${i}`; result.push({ key, pos, player: state.squad[key] || null }) }
      })
      return result
    },
    isFull(state) { const shape = FORMATIONS[state.formation]; return Object.keys(state.squad).length === (shape.GK + shape.DEF + shape.MID + shape.FWD) }
  },
  actions: {
    setFormation(f) { this.formation = f; this.squad = {}; save({ teamName: this.teamName, formation: f, squad: {} }) },
    assignPlayer(slotKey, player) { this.squad[slotKey] = player; save({ teamName: this.teamName, formation: this.formation, squad: this.squad }) },
    removePlayer(slotKey) { delete this.squad[slotKey]; save({ teamName: this.teamName, formation: this.formation, squad: this.squad }) },
    setTeamName(name) { this.teamName = name; save({ teamName: name, formation: this.formation, squad: this.squad }) }
  }
})
