import { getInterval, getScalesIdNames } from "../types/Scales"

export class ScalesVM
{
    private _scaleId
    private _intervals

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

    constructor()
    {
        const names = getScalesIdNames()
        this.scalesIds = ko.observableArray(names)

        const name = names[0]
        this._scaleId = ko.observable(name)
        this._intervals = ko.observableArray(getInterval(name) as number[])
        this._intervals.extend({ rateLimit: 16 })
    }
}