import { Note, MinNote, MaxNote, isNote } from "@/types/Note"
import { defaultScaleId, getUniqueScalesIds } from "@/types/Scales"

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
        if (!getUniqueScalesIds().includes(val)) return

        this._id = val
    }

    static fromArr(arr: any[])
    {
        const s = new ScaleState
        if (!arr) return s

        const root = +arr[0]
        if (isNote(root))
        {
            s.root = root
        } else
        {
            console.warn('Unkown root note: ' + root)
        }

        const id = arr[1]
        if (getUniqueScalesIds().includes(id))
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