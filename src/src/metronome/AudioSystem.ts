import type { Beat } from "./Beat"

function getFreq(originFreq: number, notesAway: number)
{
    return originFreq * Math.pow(2, notesAway / 12)
}

const aNote = 440
const NormalClickFreq = getFreq(aNote, -3)
const AccentClickFreq = getFreq(aNote, 4)
//const LowpassFilterFreq = 6000
//const FilterGain = -12

export class AudioSystem
{
    // audio nodes:  
    // oscilator (click) -> dummyNode (for removing scheduled clicks) -> rampNode (fadeOut for click) -> 
    //     gainNode (volume) -> !!!EQ lowpass (to reduce possible ear fatigue)!!! -> destination
    // !!! EQ is removed because it can get in unstable state because of automation (setTargetAtTime in rampNode)
    private _ctx
    private _clickOscType: OscillatorType = "square"
    private _firstClickDur = this.getDurationForFreq(AccentClickFreq, 0.05)
    private _secondClickDur = this.getDurationForFreq(NormalClickFreq, 0.05)
    private _dummyNode?: GainNode
    private _rampNode?: GainNode
    private _gainNode!: GainNode
    //private _eqNode!: BiquadFilterNode
    private _oscNodes = new Map<number, OscillatorNode>()

    get clickType()
    {
        return this._clickOscType
    }
    set clickType(val)
    {
        this._clickOscType = val
        for (let [k, v] of this._oscNodes)
        {
            v.type = val
        }
    }

    get time()
    {
        return this._ctx.currentTime
    }

    get gain()
    {
        return this._gainNode.gain.value
    }
    set gain(val)
    {
        this._gainNode.gain.value = val
    }

    constructor(ctx: AudioContext)
    {
        this._ctx = ctx

        //this.initEqNode()
        this.initGainNode()
        this.initRampNode()
        this.initDummyNode()
    }

    scheduleBeat(beat: Beat)
    {
        const osc = this._ctx.createOscillator()
        osc.type = this._clickOscType
        let freq = NormalClickFreq
        let duration = this._secondClickDur
        if (beat.number == 0)
        {
            freq = AccentClickFreq
            duration = this._firstClickDur
        }
        if (duration > beat.maxDur)
        {
            duration = this.getDurationForFreq(freq, beat.maxDur)
        }
        osc.frequency.value = freq

        osc.connect(this._dummyNode as AudioNode)
        osc.start(beat.audioTime)
        osc.stop(beat.audioTime + duration)
        this.rampAudio(beat.audioTime, duration)
        
        console.log(this._oscNodes.size)
        const id = beat.audioTime
        this._oscNodes.set(id, osc)
        osc.onended = () => {
            osc.disconnect()
            this._oscNodes.delete(id)
        }
    }

    clearAudioQ()
    {
        this._rampNode?.disconnect()
        this._dummyNode?.disconnect()
        this._rampNode = undefined
        this._dummyNode = undefined
        this._oscNodes.clear()
        this.initRampNode()
        this.initDummyNode()
    }

    private getDurationForFreq(freq: number, closeDuration: number)
    {
        let desiredDuration = closeDuration
        let cycleDuration = 1 / freq
        let completedCycles = Math.floor(desiredDuration / cycleDuration)
        return completedCycles * cycleDuration
    }

    private rampAudio(time: number, soundDur: number)
    {
        if (!this._rampNode) return

        let transitionDur = AudioSystem.getTransitionDuration(soundDur)
        this._rampNode?.gain.setTargetAtTime(0, time + transitionDur, soundDur * 0.1)
        transitionDur = soundDur + soundDur * 0.25
        this._rampNode?.gain.setTargetAtTime(1, time + transitionDur, Number.MIN_VALUE)
    }

    private static getTransitionDuration(time: number)
    {
        let dur = time * 0.03
        if (time < 0.015)
        {
            dur = time * 0.15
        }
        else if (time < 0.03)
        {
            dur = time * 0.08
        }
        return dur
    }

    private initRampNode()
    {
        const n = this._ctx.createGain()
        n.connect(this._gainNode as AudioNode)
        this._rampNode = n
    }

    private initGainNode()
    {
        const n = this._ctx.createGain()
        //n.connect(this._eqNode as AudioNode)
        n.connect(this._ctx.destination)
        this._gainNode = n
    }

    /*private initEqNode()
    {
        const n = this._ctx.createBiquadFilter()
        n.type = "highshelf"
        n.gain.value = FilterGain
        n.frequency.value = LowpassFilterFreq
        n.connect(this._ctx.destination)

        this._eqNode = n
    }*/

    private initDummyNode()
    {
        this._dummyNode = this._ctx.createGain()
        this._dummyNode.connect(this._rampNode as AudioNode)
    }
}