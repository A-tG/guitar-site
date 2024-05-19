import { range } from "../utils/range"

export const MinNote = 0
export const MaxNote = 11

export enum Note
{
    // !!!! if C = MinNote insteaod of C = 0, every enum become undefined !!!!
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
export const NumberOfNotes = 12

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
        (n -= semitones) >= 0 ? n : NumberOfNotes + (n % NumberOfNotes):
        getHigherNote(n, -semitones)
}

export function isNote(val: any)
{
    return Number.isInteger(val) && (val >= MinNote) && (val <= MaxNote)
}

const NotesNames = [
    ['C'],
    ['C#', 'Db'],
    ['D'],
    ['D#', 'Eb'],
    ['E'],
    ['F'],
    ['F#', 'Gb'],
    ['G'],
    ['G#', 'Ab'],
    ['A'],
    ['A#', 'Bb'],
    ['B']
] as const

export function getNoteName(n: Note, isFlatNotation = false)
{
    const namesPair = NotesNames[n]
    const len = namesPair.length
    return isFlatNotation ? namesPair[len - 1] : namesPair[0]
}

export function noteToString(n: Note)
{
    return getNoteName(n, true)
}

export function stringToNote(str: string)
{
    let n = Note.C
    for (let i = 0; i < NumberOfNotes; i++)
    {   
        const name = getNoteName(i as Note, true).toLowerCase()
        if (name == str.toLowerCase())
        {
            n = i as Note
            break
        }
    }
    return n
}