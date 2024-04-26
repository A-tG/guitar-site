import { OptionStorage } from "../utils/LocalStorage"
import { CanvasVM } from "./CanvasVM"
import { State } from "./State"
import { TempoVM } from "./TempoVM"
import { TimeSignatureVM } from "./TimeSignatureVM"
import { VolumeVM } from "./VolumeVM"

export class MetronomeVM
{
    readonly volume
    readonly tempo
    readonly signature
    readonly canvas
    
    private _isPlaying = ko.observable(false)
    private _isEnabled = ko.observable(false)
    private readonly _clickTypes: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"]
    private _clickType = ko.observable(this._clickTypes[1])
    private _state
    private _optionStorage?: OptionStorage
    
    readonly clickTypes = ko.observableArray(this._clickTypes)

    get isPlaying()
    {
        return this._isPlaying()
    }
    set isPlaying(val)
    {
        this._isPlaying(val)
        this._state.isPlaying = val
    }

    get isEnabled()
    {
        return this._isEnabled()
    }
    set isEnabled(val)
    {
        this._isEnabled(val)
    }

    get clickType()
    {
        return this._clickType()
    }
    set clickType(val)
    {
        if (!this._clickTypes.includes(val)) return

        this._clickType(val)
        this._state.metronomeClickType = val
        this.save()
    }

    constructor(cnv: CanvasVM, optionStorage: OptionStorage, state: State, worker?: Worker, ctx?: AudioContext)
    {
        this.canvas = cnv
        this.isEnabled = !!(worker && ctx)
        
        this._optionStorage = optionStorage
        this._state = state

        let cb = (val: number) => state.volumePercentageLog = val
        this.volume = new VolumeVM(0, 100, 50, cb, new OptionStorage("metronome.volume"))
        cb = (val: number) => state.tempo = val
        this.tempo = new TempoVM(40, 320, 120, cb, new OptionStorage("metronome.tempo"))
        
        this.signature = new TimeSignatureVM(
            state,
            new OptionStorage("metronome.signature.beatLength"),
            new OptionStorage("metronome.signature.beatsPerMeasure"))
        this.load()
    }

    togglePlay()
    {
        this.isPlaying = !this.isPlaying
    }

    save()
    {
        this._optionStorage?.saveStr(this.clickType)
    }
    load()
    {
        const val = this._optionStorage?.loadStr() as OscillatorType
        if (!val) return

        this.clickType = val
    }
}
