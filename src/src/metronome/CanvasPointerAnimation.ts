import type { Ref } from "vue"
import { AnimationQ, type Animation as MetrAnim, type ITimeProvider} from "../animation/AnimationQ"
import type { Beat } from "./Beat"

export class CanvasPointerAnimaion
{
    readonly animationQ

    private _cnv
    private _ctx
    private _onFirstBeat
    private _beatNumber = 0
    private _cnvScaleCoeff = 2

    private _fontFamily = ""
    private _fontSize = 0
    private _strokeColor = ""

    constructor(provider: ITimeProvider, canvasBlock: HTMLCanvasElement, onFirstBeat: (b: Beat) => void)
    {
        this.animationQ = new AnimationQ(provider)
        this._cnv = canvasBlock
        this._onFirstBeat = onFirstBeat
        this._ctx = this._cnv.getContext('2d')

        this.initCanvasScale()
        this.initFont()
    }

    scheduleBeatVisual(beat: Beat, duration: number)
    {
        let beginFunc = () =>
        {
            this._onFirstBeat(beat)
            this.initStrokeColor()
            this._beatNumber = beat.number
        }
        const animation: MetrAnim =
        { 
            animCalllback: this.animate.bind(this), 
            time: beat.audioTime, 
            duration: duration,
            startCallback: beginFunc.bind(this)
        }
        this.animationQ.push(animation)
    }

    animate(progress: number)
    {
        let angle = 2 * Math.PI * progress
        this.clearCnv()
        this.drawArc(angle)
        this.drawBeatNumber()
    }

    clearCnv()
    {
        this._ctx?.save()
        this._ctx?.setTransform(1, 0, 0, 1, 0, 0)
        this._ctx?.clearRect(0, 0, this._cnv.width, this._cnv.height)
        this._ctx?.restore()
    }

    private drawArc(endAngle: number)
    {
        if (!this._ctx) return

        this._ctx.lineWidth = 6 * this._cnvScaleCoeff
        this._ctx.strokeStyle = this._strokeColor
        this._ctx.beginPath()

        let x = this._cnv.width * 0.5
        let y = this._cnv.height * 0.5
        let r = Math.min(x, y) - this._ctx.lineWidth * 0.5
        let rOffset = 0.5 * Math.PI
        let startAngle = 0 - rOffset
        endAngle -= rOffset

        this._ctx.arc(x, y, r, startAngle, endAngle)
        this._ctx.stroke()
    }

    private drawBeatNumber()
    {
        if (!this._ctx) return

        this._ctx.fillStyle = this._strokeColor
        const x = this._cnv.width * 0.5
        const y = this._cnv.height * 0.5 + this._fontSize * 0.37
        const text = (this._beatNumber + 1).toString()
        this._ctx.fillText(text, x, y)
    }

    stop()
    {
        this.animationQ.stop()
        this.clearCnv()
    }

    play()
    {
        this.animationQ.start()
    }

    private initStrokeColor()
    {
        if (!this._cnv) return

        this._strokeColor = getComputedStyle(this._cnv).color
    }

    private initFont()
    {
        if (!this._ctx || !this._cnv) return

        this._fontFamily = getComputedStyle(this._cnv).fontFamily
        const fontSizeNumber = parseInt(getComputedStyle(this._cnv).fontSize)

        this._fontSize = (fontSizeNumber * this._cnvScaleCoeff)
        this._ctx.font = this._fontSize + "px " + this._fontFamily
        this._ctx.textAlign = "center"
    }

    private initCanvasScale()
    {
        const w = this._cnv?.getAttribute("width")
        const h = this._cnv?.getAttribute("height")
        const width = +(w ?? 0) * this._cnvScaleCoeff
        const height = +(h ?? 0) * this._cnvScaleCoeff
        this._cnv?.setAttribute("width", width.toString())
        this._cnv?.setAttribute("height", height.toString())
    }
}
