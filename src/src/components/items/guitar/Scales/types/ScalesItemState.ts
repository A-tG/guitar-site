import { fromInt, toInt } from "@/types/BItArr"
import { NumberOfNotes } from "@/types/Note"
import { ScaleState } from "./ScaleState"
import { TuningState } from "./TuningState"
import type { IState } from "./IState"
import { OptionStorage } from "@/utils/LocalStorage"

type ItemType = 'scales'

export class ScalesItemState implements IState
{
    private readonly _id: number
    private readonly _type: ItemType = 'scales'

    private _scale = new ScaleState
    private _tuning = new TuningState
    private _stringsNumber = 6
    private _isTriads = false
    private _notesPattern: boolean[] = Array(12).fill(true)
    private _triadsPattern: boolean[] = [true, false, true, false, true].concat(Array(NumberOfNotes - 5).fill(false))
    private _box = -1
    private _isLH = false

    private readonly _o = new OptionStorage('scalesItem.default')

    get id()
    {
        return this._id
    }

    get type()
    {
        return this._type
    }

    get scale()
    {
        return this._scale
    }
    private set scale(val)
    {
        this._scale = val
    }

    get tuning()
    {
        return this._tuning
    }
    private set tuning(val)
    {
        this._tuning = val
    }

    get stringsNumber()
    {
        return this._stringsNumber
    }
    set stringsNumber(val)
    {
        if (!Number.isInteger(val)) return

        if ((val < 3) || (val > 18)) return

        this._stringsNumber = val
    }

    get isTriads()
    {
        return this._isTriads
    }
    set isTriads(val)
    {
        this._isTriads = val
    }

    get notesPattern()
    {
        return this._notesPattern
    }
    set notesPattern(val)
    {
        this._notesPattern = val
    }

    get triadsPattern()
    {
        return this._triadsPattern
    }
    set triadsPattern(val)
    {
        this._triadsPattern = val
    }

    get box()
    {
        return this._box
    }
    set box(val)
    {
        if (!Number.isInteger(val)) return

        if ((val < -1) || (val > 24)) return

        this._box = val
    }

    get isLH()
    {
        return this._isLH
    }
    set isLH(val)
    {
        this._isLH = val
    }

    constructor(id: number)
    {
        this._id = id
    }

    private toArr()
    {
        return [
            this.type,
            this.scale,
            this.tuning,
            +this.stringsNumber,
            +this.isTriads,
            toInt(this.notesPattern),
            toInt(this.triadsPattern),
            this.box,
            +this.isLH
        ]
    }

    deserialize(JSONstring: string)
    {
        var parsedArr = [];
        if (JSONstring)
        {
            try
            {
                parsedArr = JSON.parse(JSONstring)
            }
            catch (err)
            {
                console.error("Invalid JSON: " + JSONstring)
            }
        }
        this.scale = ScaleState.fromArr(parsedArr[1])
        this.tuning = TuningState.fromArr(parsedArr[2])
        this.stringsNumber = +parsedArr[3]
        this.isTriads = !!parsedArr[4]
        try { this.notesPattern = fromInt(+parsedArr[5], NumberOfNotes) } catch { }
        try { this.triadsPattern = fromInt(+parsedArr[6], NumberOfNotes) } catch { }
        this.box = +parsedArr[7]
        this.isLH = !!parsedArr[8]
    }

    loadDefaults()
    {
        const val = this._o.loadStr()
        if (!val) return

        this.deserialize(val)
    }
    saveDefaults()
    {
        this._o.saveStr(JSON.stringify(this))
    }

    toJSON()
    {
        return this.toArr()
    }
}