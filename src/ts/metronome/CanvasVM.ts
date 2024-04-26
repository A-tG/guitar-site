export class CanvasVM
{
    private _isAccent = ko.observable(false)

    get isAccent()
    {
        return this._isAccent()
    }
    set isAccent(val)
    {
        this._isAccent(val)
    }
}