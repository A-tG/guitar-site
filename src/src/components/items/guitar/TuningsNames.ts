import { getTuningsIds, type TuningID } from "@/types/Tunings";
import { ref, type Ref } from "vue";

const names = new Map<TuningID, Ref<string>>([
    ['std_e', ref('standard e')],
    ['std_e_bass', ref('bass standard e')],
    ['std_e_bass6', ref('bass standard e 6')],
    ['drop_d6', ref('drop d')],
    ['drop_a7', ref('drop a 7')],
    ['drop_e8', ref('drop e 8')]
])

export function getTuningName(id: TuningID)
{
    return names.get(id) ?? ref('unknown')
}

function checkNames()
{
    const tunings = getTuningsIds()
    if (names.size != tunings.length)
    {
        console.warn('Tunings ids and names arrays length mismatch')
        return
    }
    for (let [k] of names)
    {
        if (tunings.includes(k)) continue

        console.warn(`Missing ID '${k}' in tunings`)
    }
}

checkNames()