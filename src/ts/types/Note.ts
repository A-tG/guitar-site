import { range } from "../utils/range"

export const enum Note
{
    C = 0,
    Csharp,
    D,
    Dsharp,
    E,
    F,
    Fsharp,
    G,
    Gsharp,
    A,
    Asharp,
    B
}

const NumberOfNotes = 12

export function getNotesList()
{
    return range(0, NumberOfNotes - 1, 1) as Note[]
}

export function getHigherNote(n: Note, semitones = 1): Note
{
    if (!semitones) return n

    return semitones > 0 ? (n + semitones) % NumberOfNotes : getLowerNote(n, -semitones)
}

export function getLowerNote(n: Note, semitones = 1): Note
{
    if (!semitones) return n
    
    return semitones > 0 ?
        (n -= semitones) >= 0 ? n : NumberOfNotes + (n % NumberOfNotes) - 1 :
        getHigherNote(n, -semitones)
}