export function buildYoutubeUrl(homeTeam, awayTeam) {
  const query = `${homeTeam} vs ${awayTeam} FIFA World Cup 2026 goals highlights`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
export function buildGoalsUrl(homeTeam, awayTeam) {
  const query = `${homeTeam} ${awayTeam} 2026 World Cup all goals`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
