type AnimCallback = (duration: number) => void
export type beginCallback = () => void

export interface Animation 
{ 
    animCalllback: AnimCallback
    startCallback: beginCallback
    time: number
    duration: number
    isStarted?: boolean
}

export interface ITimeProvider
{
    get time(): number
}

export class AudioCtxTimeProvider implements ITimeProvider
{
    _ctx: AudioContext

    constructor(ctx: AudioContext)
    {
        this._ctx = ctx
    }

    get time(): number
    {
        return this._ctx.currentTime
    }
}

export class AnimationQ
{
    private _timeProvider
    private _q: Array<Animation> = []
    private _handle = 0
    private _maxQlen = 16 
    private _isPlaying = false

    private get currentTime()
    {
        return this._timeProvider.time
    }

    constructor(ctx: ITimeProvider)
    {
        this._timeProvider = ctx
    }

    start()
    {
        this._isPlaying = true
        this._handle = requestAnimationFrame(this.update.bind(this))
    }

    stop()
    {
        this._isPlaying = false
        cancelAnimationFrame(this._handle)
        this.clear()
    }

    push(anim: Animation)
    {
        if (this._q.length >= this._maxQlen) return
        this._q.push(anim)
    }

    clear()
    {
        this._q = []
        if (this._isPlaying)
        {
            cancelAnimationFrame(this._handle)
            this.start()
        }
    }

    private update()
    {
        this.process()
        this._handle = requestAnimationFrame(this.update.bind(this))
    }

    private process()
    {
        if (this._q.length == 0) return

        let animation, startTime, targetTime, currentTime, isCurrentAnim, isTooSoon
        // shifting queue
        do
        {
            animation = this._q[0]

            startTime = animation.time
            targetTime = startTime + animation.duration
            currentTime = this.currentTime

            isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime)
            isTooSoon = currentTime < startTime
            if (!isTooSoon && !isCurrentAnim)
            {
                this._q.shift()
            }
        } while (!isCurrentAnim && !isTooSoon && (this._q.length > 0))
            
        if (!isCurrentAnim) return

        AnimationQ.callBegin(animation)
        let progress = AnimationQ.getAnimationProgress(currentTime, startTime, targetTime)
        if (animation.animCalllback)
        {
            animation.animCalllback(progress)
        }
    }

    static callBegin(animation: Animation)
    {
        if (!animation.startCallback || animation.isStarted) return

        animation.isStarted = true
        animation.startCallback()
    }

    static getAnimationProgress(time: number, startTime: number, targetTime: number)
    {
        return (time - startTime) / (targetTime - startTime)
    }
}
