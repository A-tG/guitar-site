export declare var ko: KnockoutStatic
import "./ko/clickCurrent"
import { AudioCtxTimeProvider } from "./animation/AnimationQ"
import { CanvasPointerAnimaion } from "./metronome/CanvasPointerAnimation"
import { MetronomeVM } from "./metronome/MetronomeVM"
import { Scheduler } from "./metronome/Scheduler"
import { MetronomeM } from "./metronome/Model"
import { CommonSettingsVM } from "./settings/CommonSettings.VM"
import { OptionStorage } from "./utils/LocalStorage"
import { CanvasVM } from "./metronome/CanvasVM"
import { MainVM } from "./MainVM"

const MetrPointerCanvasID = "metr-pointer-block"

const metrModel = new MetronomeM
const cnvVM = new CanvasVM
let work, aCtx, sched
try 
{
    work = new Worker(
        /* webpackChunkName: "work-mtr" */
        // @ts-ignore
        new URL("./workers/metronome.ts", import.meta.url)
    )
    
    aCtx = new AudioContext
    const cnvEl = document.querySelector('#' + MetrPointerCanvasID) as HTMLCanvasElement
    const cnvAnim = new CanvasPointerAnimaion(new AudioCtxTimeProvider(aCtx), cnvEl, cnvVM)

    sched = new Scheduler(metrModel, aCtx, work, cnvAnim)
    metrModel.scheduler = sched
    metrModel.audio = sched.audioSystem
} 
catch (error) 
{
    console.log("Error initializing metronome systems\n", error)
}

const metr = new MetronomeVM(cnvVM, new OptionStorage("metronome.clickType"), metrModel, work, aCtx)
const commonSettings = new CommonSettingsVM
const vm = new MainVM(commonSettings, metr)
ko.applyBindings(vm)