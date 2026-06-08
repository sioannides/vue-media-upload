export const STREAMS = [
  { id: 1, name: 'FIFA+', description: 'Official FIFA platform - selected matches free', url: 'https://www.fifa.com/fifaplus', regions: ['Global'], languages: ['EN','ES','FR','PT','DE'], free: true, requiresAccount: true, logo: '⚽', color: '#1a56db' },
  { id: 2, name: 'Telemundo Deportes', description: 'Spanish-language USA coverage', url: 'https://www.telemundodeportes.com', regions: ['USA'], languages: ['ES'], free: true, requiresAccount: false, logo: '📺', color: '#7e3af2' },
  { id: 3, name: 'Peacock / NBC Sports', description: 'English & Spanish, some matches free', url: 'https://www.peacocktv.com/sports/soccer', regions: ['USA'], languages: ['EN','ES'], free: false, requiresAccount: true, logo: '🦚', color: '#0e9f6e' },
  { id: 4, name: 'CBC Sports', description: 'Free Canadian public broadcaster', url: 'https://www.cbc.ca/sports', regions: ['Canada'], languages: ['EN'], free: true, requiresAccount: false, logo: '🍁', color: '#e02424' },
  { id: 5, name: 'Radio-Canada Sport', description: 'French-language coverage in Canada', url: 'https://ici.radio-canada.ca/sports', regions: ['Canada'], languages: ['FR'], free: true, requiresAccount: false, logo: '🇨🇦', color: '#e02424' },
  { id: 6, name: 'TV Azteca / Azteca Deportes', description: 'Free Mexican public broadcaster', url: 'https://www.aztecadeportes.com', regions: ['Mexico'], languages: ['ES'], free: true, requiresAccount: false, logo: '🦅', color: '#ff5a1f' },
  { id: 7, name: 'TUDN', description: 'Univision/Televisa sports network', url: 'https://www.tudn.com', regions: ['USA','Mexico'], languages: ['ES'], free: true, requiresAccount: false, logo: '🎙️', color: '#0e9f6e' },
  { id: 8, name: 'ITV', description: 'UK free-to-air, registration required', url: 'https://www.itv.com/watch/sport', regions: ['UK'], languages: ['EN'], free: true, requiresAccount: true, logo: '🇬🇧', color: '#1a56db' },
  { id: 9, name: 'ARD Mediathek', description: 'German public broadcaster', url: 'https://www.ardmediathek.de/sport', regions: ['Germany'], languages: ['DE'], free: true, requiresAccount: false, logo: '🇩🇪', color: '#e02424' },
  { id: 10, name: 'ZDF Sport', description: 'German public broadcaster', url: 'https://www.zdf.de/sport', regions: ['Germany'], languages: ['DE'], free: true, requiresAccount: false, logo: '🎬', color: '#1a56db' },
  { id: 11, name: 'France TV Sport', description: 'French public broadcaster', url: 'https://www.francetvsport.fr', regions: ['France'], languages: ['FR'], free: true, requiresAccount: false, logo: '🇫🇷', color: '#1a56db' },
  { id: 12, name: 'RTVE Deportes', description: 'Spanish public broadcaster', url: 'https://www.rtve.es/deportes', regions: ['Spain'], languages: ['ES'], free: true, requiresAccount: false, logo: '🇪🇸', color: '#e02424' },
  { id: 13, name: 'RAI Sport', description: 'Italian public broadcaster', url: 'https://www.raisport.rai.it', regions: ['Italy'], languages: ['IT'], free: true, requiresAccount: false, logo: '🇮🇹', color: '#0e9f6e' },
  { id: 14, name: 'TyC Sports', description: 'Argentine sports channel', url: 'https://www.tycsports.com', regions: ['Argentina'], languages: ['ES'], free: true, requiresAccount: false, logo: '🇦🇷', color: '#1a56db' },
  { id: 15, name: 'SporTV / Globo', description: 'Brazilian sports coverage', url: 'https://www.globo.com/esportes', regions: ['Brazil'], languages: ['PT'], free: false, requiresAccount: true, logo: '🇧🇷', color: '#0e9f6e' }
]
export const ALL_REGIONS = ['Global','USA','Canada','Mexico','UK','Germany','France','Spain','Italy','Argentina','Brazil']
