import { MetronomeVM } from "./metronome/MetronomeVM"
import { CommonSettingsVM } from "./settings/CommonSettings.VM"
import { ItemVM } from "./items/ItemVM"

const MaxItems = 5

export class MainVM
{
    readonly settings
    readonly metronome
    readonly _items = ko.observableArray<ItemVM>()

    get Items()
    {
        return this._items()
    }

    get isAddBtnVisible()
    {
        return this.Items.length < MaxItems
    }

    constructor(settings: CommonSettingsVM, metronome: MetronomeVM)
    {
        this.settings = settings
        this.metronome = metronome

        this.addItem()
    }

    addItem()
    {
        if (!this.isAddBtnVisible) return

        this._items.push(new ItemVM(this.getIdForItem()))
    }

    removeItem(id: Number)
    {
        this._items.remove((item) => item.Id == id)
    }

    private getIdForItem()
    {
        let i = 0
        for (let item of this._items())
        {
            if (item.Id != i) break

            i++
        }
        return i
    }
}
