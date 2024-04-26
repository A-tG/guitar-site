export class OptionStorage
{
    private readonly _name: string

    constructor(name: string)
    {
        this._name = name
    }

    saveNumber(val: number)
    {
        window.localStorage.setItem(this._name, val.toString())
    }
    loadNumber(): number | undefined
    {
        const val = window.localStorage.getItem(this._name)
        return val ? +val : undefined
    }

    saveBool(val: boolean)
    {
        window.localStorage.setItem(this._name, (+val).toString())
    }
    loadBool(): boolean | undefined
    {
        let val = window.localStorage.getItem(this._name)
        return (val == undefined) ? undefined : !!+val
    }

    saveStr(val: string)
    {
        window.localStorage.setItem(this._name, val)
    }
    loadStr(): string | undefined
    {
        let val = window.localStorage.getItem(this._name)
        return val ? val : undefined
    }
}
