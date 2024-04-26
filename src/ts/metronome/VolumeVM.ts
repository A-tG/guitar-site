import { SliderVmBase } from "./SliderVM"

export class VolumeVM extends SliderVmBase
{
    private _isHover = ko.observable(false)
    private _isFocus = ko.observable(false)

    get isHover()
    {
        return this._isHover()
    }
    set isHover(val)
    {
        this._isHover(val)
    }

    get isFocus()
    {
        return this._isFocus()
    }
    set isFocus(val)
    {
        this._isFocus(val)
    }

    enableHover()
    {
        this.isHover = true
    }
    disableHover()
    {
        this.isHover = false
    }

    enableFocus()
    {
        this.isFocus = true
    }
    disableFocus()
    {
        this.isFocus = false
    }
}
