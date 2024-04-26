import { OptionStorage } from "../utils/LocalStorage"

type callback = (val: number) => void

export abstract class SliderVmBase
{
    readonly min: number
    readonly max: number

    private _val: KnockoutObservable<number>
    private _storage?: OptionStorage

    get value()
    {
        return this._val()
    }
    set value(val)
    {
        val = +val
        if (!val) return

        if (val < this.min)
        {
            val = this.min
        }
        if (val > this.max)
        {
            val = this.max
        }
        this._val(val)
        this._onValueChange?.call(null, val)
        this._storage?.saveNumber(val)
    }

    constructor(min: number, max: number, defaultVal: number, cb: callback, optionStorage: OptionStorage, )
    {
        this.min = min
        this.max = max
        this._val = ko.observable(min)
        this.value = defaultVal
        this._storage = optionStorage
        const val = this._storage?.loadNumber()
        this._onValueChange = cb
        if (!val) return

        this.value = val
    }

    increase(val: number)
    {
        this.value++
    }
    decrease(val: number)
    {
        this.value--
    }

    private _onValueChange?: callback
}
