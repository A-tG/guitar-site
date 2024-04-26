import { OptionStorage } from "../utils/LocalStorage"
import { NotationSwitcherVM } from "./NotationSwitcherVM"
import { ThemeSwitcherVM } from "./ThemeSwitcherVM"

export class CommonSettingsVM
{
    readonly themeSwitcher = new ThemeSwitcherVM(new OptionStorage("colorTheme"))
    readonly notationSwitcher = new NotationSwitcherVM(new OptionStorage("isFlatNotation"))
    private _isShown = ko.observable(false)

    get isShown()
    {
        return this._isShown()
    }
    set isShown(val)
    {
        this._isShown(val)
    }
    
    toggleOpen(): boolean
    {
        this.isShown = !this.isShown
        return true
    }

    close()
    {
        if (!this.isShown) return
        
        this.isShown = false
    }
}
