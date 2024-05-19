import { isArraysEqual } from "@/utils/array"

export const defaultScaleId: ScaleID = 'maj'
export const stepsRelativeToMajor = ['1', 'b2/b9', '2/9', 'b3/#9', '3', '4/11', 'b5/#11', '5', '#5/b13', '6/13', 'b7/#13', '7'] as const
export type ScaleID = 'maj' | 'min' | 'harm_min' | 'chrom' | 'dor' | 'phr' | 'phr_dom' | 'lyd' | 'mix' | 'locr' | 'mel_min' | 'alt_dom' | 'bl_min_hex' | 'bl_pent' | 'bl' | 'maj_pent' | 'sus_pent' | 'phr_pent' | 'mix_pent' | 'aeol_pent' | 'maj_beb' | 'min_beb' | 'dom_beb' | 'wton' | 'whton' | 'hwton' | 'ac' |
    'ion' | 'aeol' | 'span_mod' | 'sup_locr' | 'dim_wton' | 'alt_sc' | 'dor_pent' | 'min_pent' | 'dor_beb' | 'dim' | 'dom_dim' | 'symm_dim' | 'bart'

const intervalsList: Record<ScaleID, number[]> = {
    'maj': [2, 2, 1, 2, 2, 2, 1],
    'min': [2, 1, 2, 2, 1, 2, 2],
    'harm_min': [2, 1, 2, 2, 1, 3, 1],
    'chrom': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    'dor': [2, 1, 2, 2, 2, 1, 2],
    'phr': [1, 2, 2, 2, 1, 2, 2],
    'phr_dom': [1, 3, 1, 2, 1, 2, 2],
    'lyd': [2, 2, 2, 1, 2, 2, 1],
    'mix': [2, 2, 1, 2, 2, 1, 2],
    'locr': [1, 2, 2, 1, 2, 2, 2],
    'mel_min': [2, 1, 2, 2, 2, 2, 1],
    'alt_dom': [1, 2, 1, 2, 2, 2, 2],
    'bl_min_hex': [3, 2, 1, 1, 3, 2],
    'bl_pent': [3, 2, 1, 4, 2],
    'bl': [3, 2, 1, 1, 3, 1, 1],
    'maj_pent': [2, 2, 3, 2, 3],
    'sus_pent': [2, 3, 2, 3, 2],
    'phr_pent': [3, 2, 3, 2, 2],
    'mix_pent': [2, 3, 2, 2, 3],
    'aeol_pent': [3, 2, 2, 3, 2],
    'maj_beb': [2, 2, 1, 2, 1, 1, 2, 1],
    'min_beb': [2, 1, 1, 1, 2, 2, 1, 2],
    'dom_beb': [2, 2, 1, 2, 2, 1, 1, 1],
    'wton': [2, 2, 2, 2, 2, 2],
    'whton': [2, 1, 2, 1, 2, 1, 2, 1],
    'hwton': [1, 2, 1, 2, 1, 2, 1, 2],
    'ac': [2, 2, 2, 1, 2, 1, 2],
    ion: [],
    aeol: [],
    span_mod: [],
    sup_locr: [],
    dim_wton: [],
    alt_sc: [],
    dor_pent: [],
    min_pent: [],
    dor_beb: [],
    dim: [],
    dom_dim: [],
    symm_dim: [],
    bart: []
}

checkForDuplicates()

const uniqueIntervalsIDs: ScaleID[] = []
for (const p in intervalsList)
{
    const id = p as ScaleID
    if (intervalsList[id].length == 0) continue
    
    uniqueIntervalsIDs.push(id)
}

intervalsList.ion = intervalsList.maj
intervalsList.aeol = intervalsList.min
intervalsList.span_mod = intervalsList.phr

intervalsList.sup_locr = intervalsList.alt_dom
intervalsList.dim_wton = intervalsList.alt_dom
intervalsList.alt_sc = intervalsList.alt_dom

intervalsList.dor_pent = intervalsList.sus_pent
intervalsList.min_pent = intervalsList.aeol_pent
intervalsList.dor_beb = intervalsList.min_beb
intervalsList.dim = intervalsList.whton

intervalsList.dom_dim = intervalsList.hwton
intervalsList.symm_dim = intervalsList.hwton

intervalsList.bart = intervalsList.ac

export function getIntervals(scaleName: ScaleID): ReadonlyArray<typeof intervalsList["maj"][0]>
{
    if (!intervalsList[scaleName]) throw new Error(`${scaleName} scale does not exist`)

    return intervalsList[scaleName]
}

export function getScalesIds()
{
    return Object.keys(intervalsList) as ReadonlyArray<ScaleID>
}

export function getUniqueScalesIds()
{
    return uniqueIntervalsIDs as ReadonlyArray<ScaleID>
}

function checkForDuplicates()
{
    const checked: number[][] = []
    for (const p in intervalsList)
    {
        const id = p as ScaleID
        const intervals = intervalsList[id]
        if (intervals.length == 0) continue
        
        if (checked.some((el) => isArraysEqual(el, intervals)))
        {
            console.warn(`Scale ${id} have duplicates`)
            continue
        }
        checked.push(intervals)
    }
}