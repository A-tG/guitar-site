import { getIntervals, getScalesIds, getUniqueScalesIds, type ScaleID } from "@/types/Scales"
import { isArraysEqual } from "@/utils/array"
import { ref, type Ref } from "vue"

const pent = "pentatonic"

const names: Record<ScaleID, Ref<string>> = {
    'maj': ref('major'),
    'min': ref('minor'),
    'harm_min': ref('harmonic minor'),
    'chrom': ref('chromatic'),
    'dor': ref('dorian'),
    'phr': ref('phrygian'),
    'phr_dom': ref('phrygian dominant'),
    'lyd': ref('lydian'),
    'mix': ref('myxolydian'),
    'locr': ref('locrian'),
    'mel_min': ref('melodic minor'),
    'alt_dom': ref('altered dominant'),
    'bl_min_hex': ref('blues minor hexatonic'),
    'bl_pent': ref('blues ' + pent),
    'bl': ref('blues'),
    'maj_pent': ref('major ' + pent),
    'sus_pent': ref('suspenden ' + pent),
    'phr_pent': ref('phrygian ' + pent),
    'mix_pent': ref('myxolydian ' + pent),
    'aeol_pent': ref('aeolian ' + pent),
    'maj_beb': ref('major bebop'),
    'min_beb': ref('minor bebop'),
    'dom_beb': ref('dominant bebop'),
    'wton': ref('whole tone'),
    'whton': ref('whole-half tone'),
    'hwton': ref('half-whole tone'),
    'ac': ref('acoustic'),
    'ion': ref('ionian'),
    'aeol': ref('aeolian'),
    'span_mod': ref('spanish mode'),
    'sup_locr': ref('super locrian'),
    'dim_wton': ref('diminished whole tone'),
    'alt_sc': ref('altered scale'),
    'dor_pent': ref('dorian ' + pent),
    'min_pent': ref('minor ' + pent),
    'dor_beb': ref('dorian bebop'),
    'dim': ref('diminished'),
    'dom_dim': ref('dominant diminished'),
    'symm_dim': ref('symmetrical diminished'),
    'bart': ref('bartok')
}

const concatNames = new Map<ScaleID, Ref<string>>()

const separator = '/'

function concatScalesNames()
{
    for (const k of Object.keys(names))
    {
        const id = k as ScaleID
        const el = names[id] 
        concatNames.set(id, ref(el.value + getConcatName(id)))
    }
}

function getConcatName(id: ScaleID)
{
    let res = ""
    const intervals = getIntervals(id)
    const ids = getScalesIds()
    for (const k of ids)
    {
        if (k == id) continue

        if (!isArraysEqual(intervals, getIntervals(k))) continue

        res += separator + names[k].value
    }
    return res
}

concatScalesNames()

const sortedConcat = new Map([...concatNames]
    .sort((a, b) => a[1].value.localeCompare(b[1].value)))
let concNameToID = new Map(Array.from(sortedConcat, p => [p[1].value, p[0]]))

const concatIDs: readonly ScaleID[] = Array.from(sortedConcat.keys())
const concatUniqIDs: readonly ScaleID[]  = concatIDs.filter((id) => getUniqueScalesIds().includes(id))

export function getConcatScaleName(id: ScaleID)
{
    return concatNames.get(id)!
}
export function getSortedConcatNamesIDs()
{
    return concatIDs
}
export function getSortedConcatNamesUniqIDs()
{
    return concatUniqIDs
}
export function getIdFromName(name: string)
{
    return concNameToID.get(name.toLowerCase())
}