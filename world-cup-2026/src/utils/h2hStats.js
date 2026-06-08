import { H2H_HISTORY } from '../data/wcHistory.js'
export function getH2H(code1, code2) {
  const matches = H2H_HISTORY.filter(m => (m.home_code === code1 && m.away_code === code2) || (m.home_code === code2 && m.away_code === code1)).sort((a, b) => b.year - a.year)
  let wins1 = 0, wins2 = 0, draws = 0, goals1 = 0, goals2 = 0
  matches.forEach(m => {
    const t1IsHome = m.home_code === code1
    const t1Goals = t1IsHome ? m.homeScore : m.awayScore
    const t2Goals = t1IsHome ? m.awayScore : m.homeScore
    goals1 += t1Goals; goals2 += t2Goals
    if (t1Goals > t2Goals) wins1++
    else if (t2Goals > t1Goals) wins2++
    else draws++
  })
  return { matches, wins1, wins2, draws, goals1, goals2, played: matches.length }
}
