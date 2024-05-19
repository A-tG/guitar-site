import { Note, noteToString, stringToNote } from "@/types/Note";
import { defaultTuningId, getTuningsIds, type TuningID } from "@/types/Tunings";

export class TuningState
{
    private _id = defaultTuningId
    private _hs = 0
    private _tunings: Note[] = []

    get id()
    {
        return this._id
    }
    set id(val)
    {
        this._id = val
    }

    get HS()
    {
        return this._hs
    }
    set HS(val)
    {
        if ((val < -12) || (val > 12)) return

        this._hs = val 
    }

    get tunings()
    {
        return this._tunings
    }
    set tunings(val)
    {
        this._tunings = val
    }

    static fromArr(arr: any[])
    {
        const s = new TuningState

        const id = arr[0] as TuningID
        if (getTuningsIds().includes(id))
        {
            s.id = id
        } else
        {
            console.warn('Unkown tuning id: ' + id)
        }

        const hs = +arr[1]
        if (Number.isInteger(hs))
        {
            s.HS = hs
        } else
        {
            console.warn('Half-steps invalid value: ' + hs)
        }

        if (id == 'custom')
        {
            const tunings = arr[2] as Array<string>
            if (Array.isArray(tunings) && (tunings.length > 1))
            {
                s.tunings = tunings.map((el) => stringToNote(el))
            } else
            {
                console.warn('Invalid strings tunings: ' + tunings)
            }
        }

        return s
    }

    toJSON()
    {
        const arr: Array<any> = [
            this.id,
            this.HS
        ]
        if (this.id == "custom")
        {
            arr.push(this.tunings.map((el) => noteToString(el)))
        }
        return arr
    }
}