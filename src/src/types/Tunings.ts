import { Note } from "./Note";

export type TuningID = 'std_e' | 'std_e_bass' | 'std_e_bass6' | 'drop_d6' | 'drop_a7' | 'drop_e8' | 'custom'
export const DefaultTuningId: TuningID = 'std_e'

const tunings: Record<TuningID, Note[]> = {
    custom: [],
    'std_e': [
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
    ],
    std_e_bass: [],
    std_e_bass6: [],
    drop_d6: [],
    drop_a7: [],
    drop_e8: []
}

const std = tunings.std_e
const stdBass = std.slice(2, 7)
tunings.std_e_bass = stdBass

let notes = stdBass.slice()
notes.splice(0, 0, Note.C)
tunings.std_e_bass6 = notes

notes = std.slice()
notes.splice(5, 1, Note.D)
tunings.drop_d6 = notes

notes = std.slice()
notes.splice(6, 1, Note.A)
tunings.drop_a7 = notes

notes = std.slice()
notes.splice(7, 1, Note.E)
tunings.drop_e8 = notes

export function getTuningNotes(name: TuningID)
{
    if (!tunings[name]) throw new Error(`${name} tuning does not exist`)

    return tunings[name]
}

export function getTuningsIds()
{
    return Object.keys(tunings) as ReadonlyArray<TuningID>
}

export function getStringTuning(strNumber: number, name: TuningID)
{
    if (strNumber < 0) throw new RangeError(`${strNumber} string number have to be greater than 0`)

    const tuning = getTuningNotes(name)
    return tuning[strNumber % tuning.length]
}