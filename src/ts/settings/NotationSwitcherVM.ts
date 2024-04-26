import { OptionStorage } from "../utils/LocalStorage"

export class NotationSwitcherVM
{
    private _isFlat = ko.observable(false)
    private _storage?: OptionStorage

    get isFlat()
    {
        return this._isFlat()
    }
    set isFlat(val)
    {
        this._isFlat(val)
        this.save()
    }

    get isSharp()
    {
        return !this.isFlat
    }
    set isSharp(val)
    {
        this.isFlat = !val
    }

    constructor(optionStorage: OptionStorage)
    {
        this._storage = optionStorage
        this.load()
    }

    change()
    {
        this.isFlat = !this.isFlat
    }

    save()
    {
        this._storage?.saveBool(this.isFlat)
    }
    load()
    {
        const val = this._storage?.loadBool()
        if (!val) return

        this.isFlat = val
    }
}
