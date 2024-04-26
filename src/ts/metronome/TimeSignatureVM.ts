import { OptionStorage } from "../utils/LocalStorage"
import { ArrayUtils } from "../utils/array"
import { range } from "../utils/range"
import { State } from "./State"

export class TimeSignatureVM
{
    private readonly _beats = range(1, 16, 1)
    private _beatsPerMeasure = ko.observable(this._beats[3])
    
    private readonly _beatLengths = [1, 2, 4, 8, 16, 32]
    private _beatLen = ko.observable(this._beatLengths[2])

    readonly beats = ko.observableArray(this._beats)
    readonly beatLengths = ko.observableArray(this._beatLengths)

    private _storageBeatLen?: OptionStorage
    private _storageBeatPer?: OptionStorage

    private _state

    get beatsPerMeasure()
    {
        return this._beatsPerMeasure()
    }
    set beatsPerMeasure(val)
    {
        if (!this._beats.includes(val)) return

        this._beatsPerMeasure(val)
        this._state.beatsPerMeasure = val
        this._storageBeatPer?.saveNumber(val)
    }

    get beatLength()
    {
        return this._beatLen()
    }
    set beatLength(val)
    {
        if (!this._beatLengths.includes(val)) return

        this._beatLen(val)
        this._state.beatDurationValue = val
        this._storageBeatLen?.saveNumber(val)
    }

    constructor(state: State, optionBeatLength: OptionStorage, optionBeatPerMeasure: OptionStorage)
    {
        this._storageBeatLen = optionBeatLength
        this._storageBeatPer = optionBeatPerMeasure

        this._state = state
        this.load()
    }

    beatsPrev()
    {
        let val = ArrayUtils.previousValue(this._beats, this.beatsPerMeasure)
        if (!val) return

        this.beatsPerMeasure = val
    }
    beatsNext()
    {
        let val = ArrayUtils.nextValue(this._beats, this.beatsPerMeasure)
        if (!val) return

        this.beatsPerMeasure = val
    }

    lenPrev()
    {
        let val = ArrayUtils.previousValue(this._beatLengths, this.beatLength)
        if (!val) return

        this.beatLength = val
    }
    lenNext()
    {
        let val = ArrayUtils.nextValue(this._beatLengths, this.beatLength)
        if (!val) return

        this.beatLength = val
    }

    load()
    {
        let val = this._storageBeatPer?.loadNumber()
        if (val)
        {
            this.beatsPerMeasure = val
        }
        if (val = this._storageBeatLen?.loadNumber())
        {
            this.beatLength = val
        }
    }
}
