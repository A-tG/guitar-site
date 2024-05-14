import { AudioSystem as MetrAudio} from './AudioSystem'
import type { Beat } from './Beat'
import { type Message, MessageType } from '../workers/metronome'
import { DefaultTickrate } from './constants'
import { CanvasPointerAnimaion } from './CanvasPointerAnimation'
import type { State } from './State'

export class Scheduler
{
    private _state
    private _worker
    private _audio
    private _animation
    private _q: Beat[] = []
    private _nextBeatNumber = 0
    private _lookAheadNumber = 1
    private _ticksPerSecond = DefaultTickrate
    private _isPlaying = false

    set isPlaying(val: boolean)
    {
        if (this._isPlaying == val) return

        this._isPlaying = val
        val ? this.start() : this.stop()
    }

    get audioSystem()
    {
        return this._audio
    }

    constructor(state: State, audioCtx: AudioContext, worker: Worker, anim: CanvasPointerAnimaion)
    {
        this._state = state
        this._worker = worker
        this._audio = new MetrAudio(audioCtx)
        this._animation = anim
        this._worker.onmessage = this.onWorkerMessage.bind(this)
        this.getWorkerTickrate()
    }

    scheduleBeats()
    {
        while (this._q.length > 1)
        {
            let beat = this._q.shift() as Beat
            this._audio.scheduleBeat(beat)
            this._animation.scheduleBeatVisual(beat, this.getDurBetweenBeats())
        }
    }

    addBeatsToQ (num: number)
    {
        let delay = this.getDurBetweenBeats()
        let lastBeatTime = this._q[this._q.length - 1].audioTime
        if ((this._audio.time + delay * num) >= lastBeatTime)
        {
            for (let i = this._q.length; i < num; i++)
            {
                this._nextBeatNumber = (this._nextBeatNumber + 1) % this._state.beatsPerMeasure
                const beat: Beat = {
                    audioTime: lastBeatTime + delay,
                    number: this._nextBeatNumber,
                    maxDur: delay / 2
                }
                this._q.push(beat)
                lastBeatTime = this._q[this._q.length - 1].audioTime
            }
            this.scheduleBeats()
        }
    }

    beatsSchedulerTick()
    {
        if (this._q.length > 0)
        {
            let tickTime = 1 / this._ticksPerSecond
            let lookAheadNumber = Math.ceil((tickTime * 2) / this.getDurBetweenBeats()) + 1
            this._lookAheadNumber = lookAheadNumber
            this.addBeatsToQ(lookAheadNumber)
        } else
        {
            const beat: Beat = { 
                audioTime: this._audio.time, 
                number: this._nextBeatNumber, 
                maxDur: this.getDurBetweenBeats() / 2 
            }
            this._q.push(beat)
        }
    }

    beatsSchedulerStart()
    {
        this.clearQ()
        this._nextBeatNumber = 0
    }

    clearQ()
    {
        this._q = []
    }

    getDurBetweenBeats()
    {
        return (240 / this._state.beatDurationValue) / this._state.tempo
    }

    onRateChange()
    {
        if (!this._state.isPlaying) return 
        this._audio.clearAudioQ()
        if (this.getDurBetweenBeats() * this._lookAheadNumber > 0.5)
        {
            this.clearQ()
            this._animation.animationQ.clear()
        }
    }

    getWorkerTickrate()
    {
        this._worker.postMessage([MessageType.tickrate])
    }

    private start()
    {
        this.beatsSchedulerStart()
        this._animation.play()
        this._worker.postMessage([MessageType.startTicking])
    }

    private stop()
    {
        this._audio.clearAudioQ()
        this._animation.stop()
        const msg = [MessageType.stopTicking]
        this._worker.postMessage(msg)
    }

    private onWorkerMessage(e: MessageEvent)
    {
        let msg = e.data as Message
        switch (msg?.[0])
        {
            case MessageType.tick:
                this.beatsSchedulerTick()
                break
            case MessageType.tickrate:
                const rate = msg?.[1]
                if (rate) this._ticksPerSecond = rate
                break
            default:
                break
        }
    }
}
