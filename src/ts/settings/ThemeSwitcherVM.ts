import { OptionStorage } from "../utils/LocalStorage"
import { ArrayUtils } from "../utils/array"

enum ColorTheme
{
    day = 1,
    night
}

const themes = new Map([
    [ColorTheme.day, "day"],
    [ColorTheme.night, "night"]
])

// to access in html data binding
declare global
{
    interface Window
    {
        ColorTheme: typeof ColorTheme
    }
}
window.ColorTheme = ColorTheme

export class ThemeSwitcherVM
{
    private _theme = ko.observable(ColorTheme.night)
    private _name = ko.observable(themes.get(this.theme))
    private _storage?: OptionStorage

    get theme()
    {
        return this._theme()
    }
    set theme(t)
    {
        this._theme(t)
        this.name = themes.get(t)
        this._storage?.saveNumber(this.theme)
    }

    get name()
    {
        return this._name()
    }
    set name(val)
    {
        this._name(val)
    }

    constructor(optionStorage: OptionStorage)
    {
        this._storage = optionStorage
        const val = this._storage?.loadNumber()
        if (!val) return

        this.theme = val
    }

    next()
    {
        const val = ArrayUtils.nextKey(themes, this.theme)
        if (!val) return

        this.theme = val
    }

    toDay()
    {
        this.theme = ColorTheme.day
    }

    toNight()
    {
        this.theme = ColorTheme.night
    }
}
