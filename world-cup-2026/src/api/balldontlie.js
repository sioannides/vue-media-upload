import axios from 'axios'

const BASE = 'https://api.balldontlie.io/fifa/worldcup/v1'
const KEY = import.meta.env.VITE_BALLDONTLIE_KEY

const client = axios.create({
  baseURL: BASE,
  timeout: 12000,
  headers: KEY ? { Authorization: KEY } : {}
})

const get = (url, params = {}) => client.get(url, { params }).then(r => r.data?.data ?? r.data)

export const fetchGames = () => get('/games', { per_page: 200 })
export const fetchGroups = () => get('/group_standings')
export const fetchTeams = () => get('/teams', { per_page: 100 })
export const fetchPlayers = () => get('/players', { per_page: 500 })
export const fetchPlayerStats = () => get('/player_stats', { per_page: 500 })
export const fetchGame = (id) => get(`/games/${id}`)
export const fetchPlayer = (id) => get(`/players/${id}`)
