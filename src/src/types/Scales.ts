export const defaultScaleId: TuningID = 'maj'
export const stepsRelativeToMajor = ['1', 'b2/b9', '2/9', 'b3/#9', '3', '4/11', 'b5/#11', '5', '#5/b13', '6/13', 'b7/#13', '7'] as const
export type TuningID = 'maj' | 'min' | 'harm_min' | 'chrom' | 'dor' | 'phr' | 'phr_dom' | 'lyd' | 'mix' | 'locr' | 'mel_min' | 'alt_dom' | 'bl_min_hex' | 'bl_pent' | 'bl' | 'maj_pent' | 'sus_pent' | 'phr_pent' | 'mix_pent' | 'aeol_pent' | 'maj_beb' | 'min_beb' | 'dom_beb' | 'wton' | 'whton' | 'hwton' | 'ac' |
    'ion' | 'aeol' | 'span_mod' | 'sup_locr' | 'dim_wton' | 'alt_sc' | 'dor_pent' | 'min_pent' | 'dor_beb' | 'dim' | 'dom_dim' | 'symm_dim' | 'bart'

const Intervals = new Map<TuningID, number[]>([
    ['maj', [2, 2, 1, 2, 2, 2, 1]],
    ['min', [2, 1, 2, 2, 1, 2, 2]],
    ['harm_min', [2, 1, 2, 2, 1, 3, 1]],
    ['chrom', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    ['dor', [2, 1, 2, 2, 2, 1, 2]],
    ['phr', [1, 2, 2, 2, 1, 2, 2]],
    ['phr_dom', [1, 3, 1, 2, 1, 2, 2]],
    ['lyd', [2, 2, 2, 1, 2, 2, 1]],
    ['mix', [2, 2, 1, 2, 2, 1, 2]],
    ['locr', [1, 2, 2, 1, 2, 2, 2]],
    ['mel_min', [2, 1, 2, 2, 2, 2, 1]],
    ['alt_dom', [1, 2, 1, 2, 2, 2, 2]],
    ['bl_min_hex', [3, 2, 1, 1, 3, 2]],
    ['bl_pent', [3, 2, 1, 4, 2]],
    ['bl', [3, 2, 1, 1, 3, 1, 1]],
    ['maj_pent', [2, 2, 3, 2, 3]],
    ['sus_pent', [2, 3, 2, 3, 2]],
    ['phr_pent', [3, 2, 3, 2, 2]],
    ['mix_pent', [2, 3, 2, 2, 3]],
    ['aeol_pent', [3, 2, 2, 3, 2]],
    ['maj_beb', [2, 2, 1, 2, 1, 1, 2, 1]],
    ['min_beb', [2, 1, 1, 1, 2, 2, 1, 2]],
    ['dom_beb', [2, 2, 1, 2, 2, 1, 1, 1]],
    ['wton', [2, 2, 2, 2, 2, 2]],
    ['whton', [2, 1, 2, 1, 2, 1, 2, 1]],
    ['hwton', [1, 2, 1, 2, 1, 2, 1, 2]],
    ['ac', [2, 2, 2, 1, 2, 1, 2]]
])

Intervals.set('ion', Intervals.get('maj')!)
Intervals.set('aeol', Intervals.get('min')!)
Intervals.set('span_mod', Intervals.get('phr')!)

const altScale = Intervals.get('alt_dom')!
Intervals.set('sup_locr', altScale)
Intervals.set('dim_wton', altScale)
Intervals.set('alt_sc', altScale)

Intervals.set('dor_pent', Intervals.get('sus_pent')!)
Intervals.set('min_pent', Intervals.get('aeol_pent')!)
Intervals.set('dor_beb', Intervals.get('min_beb')!)
Intervals.set('dim', Intervals.get('whton')!)

const halfWhole = Intervals.get('hwton')!
Intervals.set('dom_dim', halfWhole)
Intervals.set('symm_dim', halfWhole)

Intervals.set('bart', Intervals.get('ac')!)

export function getIntervals(scaleName: string): ReadonlyArray<number>
{
    if (!Intervals.has(scaleName as TuningID)) throw new Error(`${scaleName} scale does not exist`)

    return Intervals.get(scaleName as TuningID)!
}

export function getScalesIds()
{
    return Array.from(Intervals.keys())
}