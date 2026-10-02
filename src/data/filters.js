export const FILTER_OPTIONS = [
  { key: 'stitch', label: 'Stitch', values: ['Stitched', 'Semi-stitched', 'Unstitched'] },
  { key: 'season', label: 'Season', values: ['Summer', 'Winter', 'Festive', 'Casual', 'Party'] },
  { key: 'fabric', label: 'Fabric', values: ['Cotton', 'Lawn', 'Silk', 'Jersey', 'Cotton Blend'] },
  { key: 'pieces', label: 'Pieces', values: ['1 Piece', '2 Piece', '3 Piece'] },
  { key: 'designWork', label: 'Design Work', values: ['Printed', 'Embroidered', 'Chikankari', 'Graphic', 'Digital Print', 'Minimal', 'Tailored'] },
]

export const DEFAULT_FILTERS = {
  stitch: '',
  season: '',
  fabric: '',
  pieces: '',
  designWork: '',
}

export const filterDefinitions = FILTER_OPTIONS
export const filterOptions = FILTER_OPTIONS
export const defaultFilters = DEFAULT_FILTERS
