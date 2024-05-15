export const defaultScaleId = 'major'

const Intervals = new Map([
    ['major', [2, 2, 1, 2, 2, 2, 1]],
    ['minor', [2, 1, 2, 2, 1, 2, 2]],
    ['harmonic_min', [2, 1, 2, 2, 1, 3, 1]],
    ['chromatic', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    ['dorian', [2, 1, 2, 2, 2, 1, 2]],
    ['phrygian', [1, 2, 2, 2, 1, 2, 2]],
    ['phrygian_dom', [1, 3, 1, 2, 1, 2, 2]],
    ['lydian', [2, 2, 2, 1, 2, 2, 1]],
    ['myxolydian', [2, 2, 1, 2, 2, 1, 2]],
    ['locrian', [1, 2, 2, 1, 2, 2, 2]],
    ['melodic_min', [2, 1, 2, 2, 2, 2, 1]],
    ['alt_dom', [1, 2, 1, 2, 2, 2, 2]],
    ['blues_min_hex', [3, 2, 1, 1, 3, 2]],
    ['blues_pent', [3, 2, 1, 4, 2]],
    ['blues', [3, 2, 1, 1, 3, 1, 1]],
    ['major_pent', [2, 2, 3, 2, 3]],
    ['suspended_pent', [2, 3, 2, 3, 2]],
    ['phrygian_pent', [3, 2, 3, 2, 2]],
    ['myxolydian_pent', [2, 3, 2, 2, 3]],
    ['aeolian_pent', [3, 2, 2, 3, 2]],
    ['major_beb', [2, 2, 1, 2, 1, 1, 2, 1]],
    ['minor_beb', [2, 1, 1, 1, 2, 2, 1, 2]],
    ['dom_beb', [2, 2, 1, 2, 2, 1, 1, 1]],
    ['whole_tone', [2, 2, 2, 2, 2, 2]],
    ['whole_half_tone', [2, 1, 2, 1, 2, 1, 2, 1]],
    ['half_whole_tone', [1, 2, 1, 2, 1, 2, 1, 2]],
    ['acoustic', [2, 2, 2, 1, 2, 1, 2]],
    ['bartok', [2, 2, 2, 1, 2, 1, 2]]
])

Intervals.set('ionian', Intervals.get('major')!)
Intervals.set('aeolian', Intervals.get('minor')!)
Intervals.set('spanish_mod', Intervals.get('phrygian')!)

const altScale = Intervals.get('alt_dom')!
Intervals.set('sup_locrian', altScale)
Intervals.set('dim_whole_tone', altScale)
Intervals.set('alt_scale', altScale)

Intervals.set('dorian_pent', Intervals.get('suspended_pent')!)
Intervals.set('minor_pent', Intervals.get('aeolian_pent')!)
Intervals.set('dorian_beb', Intervals.get('minor_beb')!)
Intervals.set('dim', Intervals.get('whole_half_tone')!)

const halfWhole = Intervals.get('half_whole_tone')!
Intervals.set('dom_dim', halfWhole)
Intervals.set('symm_dim', halfWhole)

Intervals.set('bartok', Intervals.get('acoustic')!)

export function getIntervals(scaleName: string): ReadonlyArray<number>
{
    if (!Intervals.has(scaleName)) throw new Error(`${scaleName} scale does not exist`)

    return Intervals.get(scaleName)!
}

export function getScalesIds()
{
    return Array.from(Intervals.keys())
}