import { Note } from "../types/Note"
import { getIntervals, getScalesIdNames } from "../types/Scales"

export class ScalesVM
{
    private _scaleId
    private _intervals
    private _root = ko.observable(Note.C)

    readonly scalesIds

    get ScaleId()
    {
        return this._scaleId()
    }
    set ScaleId(val)
    {
        this._scaleId(val)
    }

    get Intervals()
    {
        return this._intervals()
    }
    set Intervals(val)
    {
        this._intervals.removeAll()
        for (const v of val)
        {
            this._intervals.push(v)
        }
    }

    get Root()
    {
        return this._root()
    }
    set Root(val)
    {
        this._root(val)
    }

    constructor()
    {
        const names = getScalesIdNames()
        this.scalesIds = ko.observableArray(names)

        const name = names[0]
        this._scaleId = ko.observable(name)
        this._intervals = ko.observableArray(getIntervals(name) as number[])
        this._intervals.extend({ rateLimit: 16 })
    }
}