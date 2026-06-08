import { defineStore } from 'pinia'
import { fetchGames, fetchGroups, fetchTeams, fetchPlayers, fetchPlayerStats } from '../api/balldontlie.js'

export const useWorldCupStore = defineStore('worldcup', {
  state: () => ({
    games: [],
    groups: {},
    teams: [],
    players: [],
    playerStats: [],
    loading: false,
    error: null,
    initialized: false,
    _liveInterval: null
  }),
  getters: {
    getMatchById: (state) => (id) => state.games.find(g => String(g.id) === String(id)),
    getMatchesByGroup: (state) => (group) => state.games.filter(g => g.group === group),
    getGroupStandings: (state) => (letter) => state.groups[letter] ?? [],
    groupLetters: (state) => [...new Set(state.games.map(g => g.group).filter(Boolean))].sort(),
    featuredMatches: (state) => {
      const live = state.games.filter(g => g.status === 'live')
      if (live.length) return live.slice(0, 6)
      return state.games.filter(g => g.status === 'scheduled').slice(0, 6)
    },
    hasLiveMatches: (state) => state.games.some(g => g.status === 'live'),
    getTeamByCode: (state) => (code) => state.teams.find(t => t.code === code),
    getPlayerById: (state) => (id) => state.players.find(p => String(p.id) === String(id)),
    topScorers: (state) => [...state.playerStats.filter(s => s.goals > 0)].sort((a, b) => b.goals - a.goals).slice(0, 20)
  },
  actions: {
    async init() {
      if (this.initialized) return
      this.loading = true
      this.error = null
      try {
        const [games, groups, teams] = await Promise.all([fetchGames(), fetchGroups(), fetchTeams()])
        this.games = normalizeGames(games)
        this.groups = normalizeGroups(groups)
        this.teams = normalizeTeams(teams)
        this.initialized = true
        fetchPlayers().then(p => { this.players = normalizePlayers(p) }).catch(() => {})
        fetchPlayerStats().then(s => { this.playerStats = Array.isArray(s) ? s : [] }).catch(() => {})
        if (this.hasLiveMatches) this._startPolling()
      } catch (e) {
        this.error = e.message || 'Failed to load data'
        this.games = SEED_GAMES
        this.groups = SEED_GROUPS
        this.teams = SEED_TEAMS
        this.initialized = true
      } finally {
        this.loading = false
      }
    },
    async refresh() {
      try {
        const games = await fetchGames()
        this.games = normalizeGames(games)
        if (!this.hasLiveMatches) this._stopPolling()
      } catch {}
    },
    _startPolling() {
      if (this._liveInterval) return
      this._liveInterval = setInterval(() => this.refresh(), 60000)
    },
    _stopPolling() {
      if (this._liveInterval) { clearInterval(this._liveInterval); this._liveInterval = null }
    }
  }
})

function normalizeGames(raw) {
  if (!Array.isArray(raw)) return SEED_GAMES
  return raw.map((g, i) => ({
    id: g.id ?? i + 1,
    home_team: extractName(g.home_team),
    away_team: extractName(g.away_team),
    home_code: extractCode(g.home_team),
    away_code: extractCode(g.away_team),
    home_score: g.home_team_score ?? g.home_score ?? null,
    away_score: g.away_team_score ?? g.away_score ?? null,
    date: g.date ?? g.datetime ?? null,
    time: g.time ?? null,
    stadium: g.location ?? g.stadium ?? g.venue ?? null,
    city: g.city ?? null,
    country: g.country ?? null,
    group: g.stage?.startsWith('Group') ? g.stage.replace('Group ', '') : (g.group ?? null),
    round: g.stage ?? g.round ?? 'Group Stage',
    status: g.status ?? 'scheduled',
    winner: g.winner ?? null,
    matchday: g.matchday ?? null
  }))
}

function normalizeGroups(raw) {
  if (!raw) return SEED_GROUPS
  if (Array.isArray(raw)) {
    return raw.reduce((acc, entry) => {
      const key = entry.group ?? entry.group_name ?? entry.name
      if (!key) return acc
      if (!acc[key]) acc[key] = []
      acc[key].push({
        team: extractName(entry.team),
        code: extractCode(entry.team),
        played: entry.games_played ?? entry.played ?? 0,
        won: entry.wins ?? entry.won ?? 0,
        drawn: entry.draws ?? entry.drawn ?? 0,
        lost: entry.losses ?? entry.lost ?? 0,
        goals_for: entry.goals_for ?? 0,
        goals_against: entry.goals_against ?? 0,
        goal_difference: entry.goal_difference ?? 0,
        points: entry.points ?? 0
      })
      return acc
    }, {})
  }
  return raw
}

function normalizeTeams(raw) {
  if (!Array.isArray(raw)) return SEED_TEAMS
  return raw.map(t => ({ id: t.id, name: t.name ?? t.team_name, code: t.abbreviation ?? t.code ?? '', group: t.group ?? null }))
}

function normalizePlayers(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(p => ({
    id: p.id,
    name: p.first_name ? `${p.first_name} ${p.last_name}` : (p.name ?? ''),
    first_name: p.first_name ?? '',
    last_name: p.last_name ?? '',
    position: p.position ?? 'MF',
    team: extractName(p.team),
    team_code: extractCode(p.team),
    jersey_number: p.jersey_number ?? null,
    country_code: p.country_code ?? extractCode(p.team)
  }))
}

function extractName(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val.name ?? val.team_name ?? val.country ?? ''
}

function extractCode(val) {
  if (!val) return ''
  if (typeof val === 'string') return val.slice(0, 3).toUpperCase()
  return val.abbreviation ?? val.code ?? val.iso_code ?? (val.name ?? '').slice(0, 3).toUpperCase()
}

const SEED_TEAMS = [
  { id: 1, name: 'United States', code: 'USA', group: 'A' },
  { id: 2, name: 'Mexico', code: 'MEX', group: 'A' },
  { id: 3, name: 'Canada', code: 'CAN', group: 'A' },
  { id: 4, name: 'Ecuador', code: 'ECU', group: 'A' },
  { id: 5, name: 'Argentina', code: 'ARG', group: 'B' },
  { id: 6, name: 'Chile', code: 'CHI', group: 'B' },
  { id: 7, name: 'Peru', code: 'PER', group: 'B' },
  { id: 8, name: 'Australia', code: 'AUS', group: 'B' },
  { id: 9, name: 'France', code: 'FRA', group: 'C' },
  { id: 10, name: 'Germany', code: 'GER', group: 'C' },
  { id: 11, name: 'Belgium', code: 'BEL', group: 'C' },
  { id: 12, name: 'Croatia', code: 'CRO', group: 'C' },
  { id: 13, name: 'Brazil', code: 'BRA', group: 'D' },
  { id: 14, name: 'Uruguay', code: 'URU', group: 'D' },
  { id: 15, name: 'Colombia', code: 'COL', group: 'D' },
  { id: 16, name: 'Paraguay', code: 'PAR', group: 'D' },
  { id: 17, name: 'England', code: 'ENG', group: 'E' },
  { id: 18, name: 'Nigeria', code: 'NGA', group: 'E' },
  { id: 19, name: 'Senegal', code: 'SEN', group: 'E' },
  { id: 20, name: 'South Korea', code: 'KOR', group: 'E' },
  { id: 21, name: 'Spain', code: 'ESP', group: 'F' },
  { id: 22, name: 'Morocco', code: 'MAR', group: 'F' },
  { id: 23, name: 'Saudi Arabia', code: 'KSA', group: 'F' },
  { id: 24, name: 'Ivory Coast', code: 'CIV', group: 'F' },
  { id: 25, name: 'Portugal', code: 'POR', group: 'G' },
  { id: 26, name: 'Iran', code: 'IRN', group: 'G' },
  { id: 27, name: 'Turkey', code: 'TUR', group: 'G' },
  { id: 28, name: 'Venezuela', code: 'VEN', group: 'G' },
  { id: 29, name: 'Netherlands', code: 'NED', group: 'H' },
  { id: 30, name: 'Japan', code: 'JPN', group: 'H' },
  { id: 31, name: 'Denmark', code: 'DEN', group: 'H' },
  { id: 32, name: 'Serbia', code: 'SRB', group: 'H' }
]

const SEED_GAMES = [
  { id: 1, home_team: 'Mexico', away_team: 'Ecuador', home_code: 'MEX', away_code: 'ECU', home_score: null, away_score: null, date: '2026-06-11', time: '19:00', stadium: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', group: 'A', round: 'Group Stage', status: 'scheduled' },
  { id: 2, home_team: 'United States', away_team: 'Bolivia', home_code: 'USA', away_code: 'BOL', home_score: null, away_score: null, date: '2026-06-12', time: '19:00', stadium: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', group: 'A', round: 'Group Stage', status: 'scheduled' },
  { id: 3, home_team: 'Argentina', away_team: 'Chile', home_code: 'ARG', away_code: 'CHI', home_score: null, away_score: null, date: '2026-06-12', time: '22:00', stadium: 'MetLife Stadium', city: 'New York', country: 'USA', group: 'B', round: 'Group Stage', status: 'scheduled' },
  { id: 4, home_team: 'France', away_team: 'Germany', home_code: 'FRA', away_code: 'GER', home_score: null, away_score: null, date: '2026-06-13', time: '20:00', stadium: 'AT&T Stadium', city: 'Dallas', country: 'USA', group: 'C', round: 'Group Stage', status: 'scheduled' },
  { id: 5, home_team: 'Brazil', away_team: 'Uruguay', home_code: 'BRA', away_code: 'URU', home_score: null, away_score: null, date: '2026-06-13', time: '20:00', stadium: "Levi's Stadium", city: 'San Francisco', country: 'USA', group: 'D', round: 'Group Stage', status: 'scheduled' },
  { id: 6, home_team: 'England', away_team: 'Nigeria', home_code: 'ENG', away_code: 'NGA', home_score: null, away_score: null, date: '2026-06-14', time: '20:00', stadium: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', group: 'E', round: 'Group Stage', status: 'scheduled' },
  { id: 7, home_team: 'Spain', away_team: 'Morocco', home_code: 'ESP', away_code: 'MAR', home_score: null, away_score: null, date: '2026-06-14', time: '20:00', stadium: 'BC Place', city: 'Vancouver', country: 'Canada', group: 'F', round: 'Group Stage', status: 'scheduled' },
  { id: 8, home_team: 'Portugal', away_team: 'Iran', home_code: 'POR', away_code: 'IRN', home_score: null, away_score: null, date: '2026-06-15', time: '20:00', stadium: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', group: 'G', round: 'Group Stage', status: 'scheduled' },
  { id: 9, home_team: 'Netherlands', away_team: 'Denmark', home_code: 'NED', away_code: 'DEN', home_score: null, away_score: null, date: '2026-06-15', time: '20:00', stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', group: 'H', round: 'Group Stage', status: 'scheduled' },
  { id: 10, home_team: 'Canada', away_team: 'Venezuela', home_code: 'CAN', away_code: 'VEN', home_score: null, away_score: null, date: '2026-06-16', time: '19:00', stadium: 'BMO Field', city: 'Toronto', country: 'Canada', group: 'G', round: 'Group Stage', status: 'scheduled' }
]

const SEED_GROUPS = {
  A: [
    { team: 'United States', code: 'USA', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Mexico', code: 'MEX', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Canada', code: 'CAN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Ecuador', code: 'ECU', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  B: [
    { team: 'Argentina', code: 'ARG', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Chile', code: 'CHI', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Peru', code: 'PER', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Australia', code: 'AUS', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  C: [
    { team: 'France', code: 'FRA', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Germany', code: 'GER', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Belgium', code: 'BEL', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Croatia', code: 'CRO', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  D: [
    { team: 'Brazil', code: 'BRA', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Uruguay', code: 'URU', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Colombia', code: 'COL', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Paraguay', code: 'PAR', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  E: [
    { team: 'England', code: 'ENG', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Nigeria', code: 'NGA', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Senegal', code: 'SEN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'South Korea', code: 'KOR', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  F: [
    { team: 'Spain', code: 'ESP', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Morocco', code: 'MAR', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Saudi Arabia', code: 'KSA', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Ivory Coast', code: 'CIV', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  G: [
    { team: 'Portugal', code: 'POR', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Iran', code: 'IRN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Turkey', code: 'TUR', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Venezuela', code: 'VEN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ],
  H: [
    { team: 'Netherlands', code: 'NED', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Japan', code: 'JPN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Denmark', code: 'DEN', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 },
    { team: 'Serbia', code: 'SRB', played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_difference: 0, points: 0 }
  ]
}
