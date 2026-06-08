export function simulateGroup(baseStandings, games, hypotheticals) {
  const standings = baseStandings.map(s => ({ ...s, played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, points: 0 }))
  games.forEach(game => {
    const h = hypotheticals[game.id]
    if (!h || h.home === '' || h.away === '' || h.home === null || h.away === null) return
    const homeGoals = Number(h.home), awayGoals = Number(h.away)
    const homeEntry = standings.find(s => s.team === game.home_team || s.code === game.home_code)
    const awayEntry = standings.find(s => s.team === game.away_team || s.code === game.away_code)
    if (!homeEntry || !awayEntry) return
    homeEntry.played++; awayEntry.played++
    homeEntry.goals_for += homeGoals; homeEntry.goals_against += awayGoals
    awayEntry.goals_for += awayGoals; awayEntry.goals_against += homeGoals
    if (homeGoals > awayGoals) { homeEntry.won++; homeEntry.points += 3; awayEntry.lost++ }
    else if (homeGoals < awayGoals) { awayEntry.won++; awayEntry.points += 3; homeEntry.lost++ }
    else { homeEntry.drawn++; homeEntry.points++; awayEntry.drawn++; awayEntry.points++ }
  })
  return standings.map(s => ({ ...s, goal_difference: s.goals_for - s.goals_against })).sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for)
}
