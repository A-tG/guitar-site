import { range } from "../utils/range"
import { SliderVmBase } from "./SliderVM"

export class TempoVM extends SliderVmBase
{
    readonly tempoList = range(this.min, this.max, 5)
}
