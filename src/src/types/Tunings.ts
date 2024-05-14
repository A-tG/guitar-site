import { Note } from "./Note";

export type TuningID = 'std_e' | 'std_e_bass' | 'std_e_bass6' | 'drop_d6' | 'drop_a7' | 'drop_e8'
export const defaultTuningId: TuningID = 'std_e'

const Tunings = new Map<TuningID, Note[]>([
    ['std_e', [
        Note.E, 
        Note.B, 
        Note.G, 
        Note.D, 
        Note.A, 
        Note.E, 
        Note.B, 
        Note.Fsharp, 
        Note.Csharp, 
        Note.Gsharp, 
        Note.Dsharp, 
        Note.Asharp
    ]]
])

const std = Tunings.get("std_e")!
const stdBass = std.slice(2, 7)
Tunings.set("std_e_bass", stdBass)
let notes = stdBass.slice()
notes.splice(0, 0, Note.C)
Tunings.set("std_e_bass6", notes)

notes = std.slice()
notes.splice(5, 1, Note.D)
Tunings.set("drop_d6", notes)

notes = std.slice()
notes.splice(6, 1, Note.A)
Tunings.set("drop_a7", notes)

notes = std.slice()
notes.splice(7, 1, Note.E)
Tunings.set("drop_e8", notes)

export function getTuningNotes(name: TuningID)
{
    if (!Tunings.has(name)) throw new Error(`${name} tuning does not exist`)

    return Tunings.get(name)?.slice()!
}

export function getTuningsIds()
{
    return Array.from(Tunings.keys())
}

export function getStringTuning(strNumber: number, name: TuningID)
{
    if (strNumber < 0) throw new RangeError(`${strNumber} string number have to be greater than 0`)

    const tuning = getTuningNotes(name)
    return tuning[strNumber % tuning.length]
}