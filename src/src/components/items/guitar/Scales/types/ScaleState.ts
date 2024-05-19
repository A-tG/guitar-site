import { Note, MinNote, MaxNote, isNote } from "@/types/Note"
import { defaultScaleId, getScalesIds } from "@/types/Scales"
import { getTuningsIds } from "@/types/Tunings"

export class ScaleState
{
    private _root = Note.C
    private _id = defaultScaleId

    get root()
    {
        return this._root
    }
    set root(val)
    {
        if ((val < MinNote) || (val > MaxNote)) return

        this._root = val
    }

    get id()
    {
        return this._id
    }
    set id(val)
    {
        if (!getScalesIds().includes(val)) return

        this._id = val
    }

    static fromArr(arr: any[])
    {
        const s = new ScaleState

        const root = +arr[0]
        if (isNote(root))
        {
            s.root = root
        } else
        {
            console.warn('Unkown root note: ' + root)
        }

        const id = arr[1]
        if (getTuningsIds().includes(id))
        {
            s.id = id
        } else
        {
            console.warn('Unkown scale id: ' + id)
        }

        return s
    }

    toJSON()
    {
        return [this.root, this.id]
    }
}