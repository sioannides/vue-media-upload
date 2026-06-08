export function generateDescription(match, groupStandings = []) {
  if (!match) return ''
  const { home_team, away_team, home_score, away_score, status, stadium, city, group, round, date } = match
  const venue = [stadium, city].filter(Boolean).join(', ')
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'
  if (status === 'live') return `LIVE NOW: ${home_team} ${home_score ?? 0}-${away_score ?? 0} ${away_team} at ${venue}.`
  if (status === 'scheduled' || home_score === null) {
    const homePos = getPosition(groupStandings, home_team)
    const awayPos = getPosition(groupStandings, away_team)
    const posText = homePos && awayPos ? ` ${home_team} sit ${homePos} in Group ${group}, while ${away_team} are ${awayPos}.` : ''
    return `${group ? `Group ${group} Preview` : round}: ${home_team} take on ${away_team} at ${venue} on ${formattedDate}.${posText}`
  }
  const hs = Number(home_score), as = Number(away_score)
  const isKnockout = round && round !== 'Group Stage'
  if (hs === as) return isKnockout ? `${home_team} and ${away_team} drew ${hs}-${as} after full time in the ${round} at ${venue}.` : `${home_team} and ${away_team} shared the spoils in a ${hs}-${as} draw at ${venue}.`
  const winner = hs > as ? home_team : away_team
  const loser = hs > as ? away_team : home_team
  const wScore = hs > as ? hs : as, lScore = hs > as ? as : hs
  const margin = wScore - lScore
  const adj = margin >= 4 ? 'emphatic' : margin >= 3 ? 'dominant' : margin >= 2 ? 'convincing' : 'hard-fought'
  return isKnockout ? `${winner} produced a ${adj} ${wScore}-${lScore} victory over ${loser} in the ${round} at ${venue}.` : `${winner} claimed all three points with a ${adj} ${wScore}-${lScore} victory over ${loser} at ${venue}.`
}
function getPosition(standings, teamName) {
  if (!standings?.length) return null
  const idx = standings.findIndex(s => s.team?.toLowerCase() === teamName?.toLowerCase() || s.code?.toLowerCase() === teamName?.toLowerCase())
  if (idx === -1) return null
  return ['1st','2nd','3rd','4th','5th','6th'][idx] || `${idx+1}th`
}
