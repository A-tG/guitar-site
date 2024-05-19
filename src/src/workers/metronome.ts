import { DefaultTickrate } from "../metronome/constants"

export const enum MessageType
{
    startTicking = 1,
    stopTicking,
    tickrate,
    tick
}

export type Message = [MessageType, any]

class Ticker
{
    private _tickIntervalID = 0
    private _ticksPerSecond = DefaultTickrate

    private tick()
    {
        const msg = [MessageType.tick]
        postMessage(msg)
    }

    private start()
    {
        this._tickIntervalID = setInterval(this.tick, 1000 / this._ticksPerSecond)
    }

    private stop()
    {
        clearInterval(this._tickIntervalID)
    }

    private postTickrate()
    {
        const msg: Message = [MessageType.tickrate, this._ticksPerSecond]
        postMessage(msg)
    }

    onmessage(e: MessageEvent)
    {
        const msg = e.data as Message
        const type = msg[0] as MessageType

        switch (type) {
            case MessageType.startTicking:
                this.start()
                break
            case MessageType.stopTicking:
                this.stop()
                break
            case MessageType.tickrate:
                this.postTickrate()
                break
            default:
                break
        }
    }
}

const metronomeTicker = new Ticker
onmessage = metronomeTicker.onmessage.bind(metronomeTicker)