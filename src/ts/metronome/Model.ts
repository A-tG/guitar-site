import { isPowerOfTwo, lerp } from "../utils/math"
import { AudioSystem } from "./AudioSystem"
import { Scheduler } from "./Scheduler"
import { State } from "./State"
import { AudioMaxDb, AudioMinDb } from "./constants"

export class MetronomeM implements State
{
    private _volume = 0
    private _tempo = 120
    private _isPlaying = false
    private _beatDur = 4
    private _beatsPer = 4
    private _clickType: OscillatorType = "square"

    private _sched!: Scheduler
    private _audio!: AudioSystem

    set scheduler(val: Scheduler)
    {
        this._sched ??= val
    }

    set audio(val: AudioSystem)
    {
        this._audio ??= val
        if (this._audio) this._audio.gain = this.volume
    }

    get volume()
    {
        return this._volume
    }
    set volume(val)
    {
        if (val < 0)
        {
            val = 0
        }
        this._volume = 0

        const a = this._audio
        if (a) a.gain = val
    }

    set volumePercentageLog(val: number)
    {
        if (val < 1)
        {
            this.volume = 0
            return
        }

        this.volume = MetronomeM.getLogFrom(val / 100)
    }

    get tempo()
    {
        return this._tempo
    }
    set tempo(val)
    {
        if (val < 0)
        {
            val = 0
        }
        this._tempo = val
        this._sched?.onRateChange()
    }

    get isPlaying()
    {
        return this._isPlaying
    }
    set isPlaying(val)
    {
        this._isPlaying = val
        const s = this._sched
        if (s) s.isPlaying = val
    }

    get beatDurationValue()
    {
        return this._beatDur
    }
    set beatDurationValue(val)
    {
        if (val && !isPowerOfTwo(val)) return

        this._beatDur = val
    }

    get beatsPerMeasure()
    {
        return this._beatsPer
    }
    set beatsPerMeasure(val)
    {
        this._beatsPer = val
    }

    get metronomeClickType()
    {
        return this._clickType
    }
    set metronomeClickType(val)
    {
        this._clickType = val

        const a = this._audio
        if (a) a.clickType = val
    }

    constructor(sched?: Scheduler, audio?: AudioSystem)
    {
        if (sched) this.scheduler = sched
        if (audio) this.audio = audio
    }

    private static getLogFrom(val: number)
    {
        const db = lerp(AudioMinDb, AudioMaxDb, val)
        return Math.pow(10, db / 20)
    }
}