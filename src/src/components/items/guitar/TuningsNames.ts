import { type TuningID } from "@/types/Tunings";
import { ref, type Ref } from "vue";

const names: Record<TuningID, Ref<string>> = {
    'std_e': ref('standard e'),
    'std_e_bass': ref('bass standard e'),
    'std_e_bass6': ref('bass standard e 6'),
    'drop_d6': ref('drop d'),
    'drop_a7': ref('drop a 7'),
    'drop_e8': ref('drop e 8')
}

export function getTuningName(id: TuningID)
{
    return names[id] ?? ref('unknown')
}