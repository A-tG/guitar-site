const enum ItemType
{
    scales
}

export class ItemVM
{
    private readonly _id
    private _type = ko.observable(ItemType.scales)

    get type()
    {
        return this._type()
    }
    set type(val)
    {
        this._type(val)
    }

    get Id()
    {
        return this._id
    }

    constructor(id: number)
    {
        this._id = id
    }
}

ko.components.register(
    "item", {
        viewModel: ItemVM,
        template: document.querySelector("#item-tmpl")?.innerHTML
    }
)