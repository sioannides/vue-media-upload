export const iso3to2 = {
  USA: 'us', MEX: 'mx', CAN: 'ca',
  ARG: 'ar', BRA: 'br', URU: 'uy', COL: 'co', CHI: 'cl',
  ECU: 'ec', PAR: 'py', PER: 'pe', VEN: 've', BOL: 'bo',
  FRA: 'fr', GER: 'de', ENG: 'gb-eng', ESP: 'es',
  POR: 'pt', NED: 'nl', BEL: 'be', CRO: 'hr', DEN: 'dk',
  SRB: 'rs', SUI: 'ch', AUT: 'at', SWE: 'se', POL: 'pl',
  TUR: 'tr', UKR: 'ua',
  MAR: 'ma', NGA: 'ng', SEN: 'sn', EGY: 'eg', TUN: 'tn',
  CMR: 'cm', GHA: 'gh', CIV: 'ci',
  JPN: 'jp', KOR: 'kr', IRN: 'ir', AUS: 'au',
  KSA: 'sa', QAT: 'qa', UAE: 'ae',
  PAN: 'pa', CRC: 'cr', JAM: 'jm',
  SCO: 'gb-sct', WAL: 'gb-wls',
  SWI: 'ch', CZE: 'cz', HUN: 'hu', GRE: 'gr', ROM: 'ro',
  SVK: 'sk', SVN: 'si', ALB: 'al', BIH: 'ba', MNE: 'me', MKD: 'mk',
  FIN: 'fi', NOR: 'no', ISL: 'is', IRL: 'ie',
  NZL: 'nz', PHI: 'ph', THA: 'th', GBR: 'gb'
}

export function getFlag(code, width = 80) {
  if (!code) return ''
  const iso2 = iso3to2[code.toUpperCase()] || code.toLowerCase()
  return `https://flagcdn.com/w${width}/${iso2}.png`
}
