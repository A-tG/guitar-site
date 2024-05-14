<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import MetronomeIcon from "./MetronomeIcon.vue"
import { OptionStorage } from "@/utils/LocalStorage"
import TimeSignature from "./TimeSignature.vue";
import { MetronomeM } from "@/metronome/MetronomeM";
import Volume from "./Volume.vue";
import Tempo from "./Tempo.vue";
import { AudioCtxTimeProvider } from "@/animation/AnimationQ";
import { Scheduler } from "@/metronome/Scheduler";
import { CanvasPointerAnimaion } from "@/metronome/CanvasPointerAnimation";

const clickTypes: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"]

const isEnabled = ref(false)
const isPlaying = ref(false)
const clickType = ref(clickTypes[1])
const canvas = ref<HTMLCanvasElement>()

const state = new MetronomeM
state.isPlaying = isPlaying.value
state.metronomeClickType = clickType.value

const s = new OptionStorage("metronome.clickType")

watch(isPlaying, (val) => state.isPlaying = val)
watch(clickType, (val) => {
    if (!clickTypes.includes(val)) return

    state.metronomeClickType = val
    save()
})

function init()
{
    let worker, aCtx, sched
    try 
    {
        worker = new Worker(
            new URL("@/workers/metronome", import.meta.url),
            { type: 'module' }
        )

        aCtx = new AudioContext
        const cnv = canvas.value!
        const anim = new CanvasPointerAnimaion(
            new AudioCtxTimeProvider(aCtx), cnv!,
            // using :class in template is not fast enough
            (b) => cnv.classList.toggle('metr-accent-clr', b.number == 0))
        sched = new Scheduler(state, aCtx, worker, anim)
        state.scheduler = sched
        state.audio = sched.audioSystem

        isEnabled.value = true
    }
    catch (error) 
    {
        console.error("Error initializing metronome systems\n", error)
    }
}

function save()
{
    s.saveStr(clickType.value)
}
function load()
{
    const val = s.loadStr() as OscillatorType
    if (!val) return

    clickType.value = val
}

load()
onMounted(init)
</script>

<template>
    <ul class="metr-block">
        <li v-if="!isEnabled" class="metr-disabled fnt f24 f-bold neg-bg neg-clr">
            <span>unable to initialize the metronome</span>
        </li>

        <li class="metr-icon metr-el">
            <MetronomeIcon></MetronomeIcon>
        </li>

        <li class="metr-beat-vis-block metr-el norm-bg3">
            <canvas id="metr-pointer-block" class="norm-clr fnt f26" width="40" height="40" ref="canvas"></canvas>
        </li>

        <li class="play-btn metr-el el-clr hov-el-clr tr-al mi-outlined md-46" title="Toggle metronome playing"
            :class="{ 'mi-pause-circle': isPlaying, 'mi-play-circle': !isPlaying }" @click="isPlaying = !isPlaying">
        </li>

        <li class="metr-el">
            <div class="norm-clr fnt f18">Click type</div>
            <div class="beat-type-sel-block">
                <select class="signature-sel el-clr norm-bg3 fnt f14" v-model="clickType">
                    <option v-for="o in clickTypes" :value="o">{{ o }}</option>
                </select>
            </div>
        </li>

        <li class="volume-block metr-el nonselect-txt">
            <Volume :metronomeState="state"></Volume>
        </li>

        <li class="tempo-block metr-el nonselect-txt">
            <Tempo :metronomeState="state"></Tempo>
        </li>

        <li class="metr-el">
            <TimeSignature :metronomeState="state"></TimeSignature>
        </li>
    </ul>
</template>