import { defineStore } from 'pinia'
function load() { try { return JSON.parse(localStorage.getItem('wc2026_predictions') || '{}') } catch { return {} } }
function save(data) { localStorage.setItem('wc2026_predictions', JSON.stringify(data)) }
export const usePredictorStore = defineStore('predictor', {
  state: () => ({ predictions: load() }),
  getters: {
    getPrediction: (state) => (matchId) => state.predictions[matchId] || null,
    stats(state) {
      const all = Object.values(state.predictions)
      const withResult = all.filter(p => p.actualHome !== undefined)
      if (!withResult.length) return { total: all.length, correct: 0, exact: 0, points: 0, accuracy: 0 }
      let correct = 0, exact = 0, points = 0
      withResult.forEach(p => {
        const predWinner = p.predHome > p.predAway ? 'home' : p.predHome < p.predAway ? 'away' : 'draw'
        const actualWinner = p.actualHome > p.actualAway ? 'home' : p.actualHome < p.actualAway ? 'away' : 'draw'
        if (predWinner === actualWinner) { correct++; points++ }
        if (p.predHome === p.actualHome && p.predAway === p.actualAway) { exact++; points += 2 }
      })
      return { total: all.length, correct, exact, points, accuracy: withResult.length ? Math.round((correct / withResult.length) * 100) : 0 }
    }
  },
  actions: {
    predict(matchId, homeScore, awayScore) { this.predictions[matchId] = { ...(this.predictions[matchId] || {}), predHome: Number(homeScore), predAway: Number(awayScore), matchId }; save(this.predictions) },
    updateResult(matchId, actualHome, actualAway) { if (!this.predictions[matchId]) return; this.predictions[matchId].actualHome = Number(actualHome); this.predictions[matchId].actualAway = Number(actualAway); save(this.predictions) }
  }
})
