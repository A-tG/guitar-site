<script setup lang="ts">
import MinusBtn from '@/components/common/MinusBtn.vue';
import PlusBtn from '@/components/common/PlusBtn.vue';
import type { State } from '@/metronome/State';
import { OptionStorage } from '@/utils/LocalStorage';
import { ArrayUtils } from '@/utils/array';
import { range } from '@/utils/range';
import { ref, watch } from 'vue';

const props = defineProps<{
    metronomeState: State
}>()

const sLen = new OptionStorage("metronome.signature.beatLength")
const sBeats = new OptionStorage("metronome.signature.beatsPerMeasure")

const beats = range(1, 16, 1)
const beatLengths = [1, 2, 4, 8, 16, 32]

const beatsPerMeasure = ref(4)
const beatLen = ref(beatLengths[2])

const state = props.metronomeState
state.beatsPerMeasure = beatsPerMeasure.value
state.beatDurationValue = beatLen.value

watch(beatsPerMeasure, (val) => {
    if (!beats.includes(val)) return

    state.beatsPerMeasure = val
    sBeats.saveNumber(val)
})
watch(beatLen, (val) => {
    if (!beatLengths.includes(val)) return

    state.beatDurationValue = val
    sLen.saveNumber(val)
})

function beatsPrev()
{
    let val = ArrayUtils.previousValue(beats, beatsPerMeasure.value)
    if (!val) return

    beatsPerMeasure.value = val
}
function beatsNext()
{
    let val = ArrayUtils.nextValue(beats, beatsPerMeasure.value)
    if (!val) return

    beatsPerMeasure.value = val
}

function lenPrev()
{
    let val = ArrayUtils.previousValue(beatLengths, beatLen.value)
    if (!val) return

    beatLen.value = val
}
function lenNext()
{
    let val = ArrayUtils.nextValue(beatLengths, beatLen.value)
    if (!val) return

    beatLen.value = val
}

function load()
{
    let val = sBeats.loadNumber()
    if (val)
    {
        beatsPerMeasure.value = val
    }
    if (val = sLen.loadNumber())
    {
        beatLen.value = val
    }
}

load()
</script>

<template>
    <ul>
        <li class="metr-el">
            <span class="norm-clr fnt f18">Signature</span>
        </li>

        <li class="metr-el">
            <div class="signature-option-block flex">
                <MinusBtn title="Reduce beats number" @click="beatsPrev"></MinusBtn>
                <select aria-label="Metronome beats per measure" class="signature-sel el-clr norm-bg3 fnt f16"
                    v-model="beatsPerMeasure">
                    <option v-for="o in beats" :value="o">{{ o }}</option>
                </select>
                <PlusBtn title="Increase beats number" @click="beatsNext"></PlusBtn>
            </div>

            <div class="signature-option-block flex">
                <MinusBtn title="Increase beat (note) value" @click="lenPrev"></MinusBtn>
                <select aria-label="Metronome beat length" class="signature-sel el-clr norm-bg3 fnt f16"
                    v-model="beatLen">
                    <option v-for="o in beatLengths" :value="o">{{ o }}</option>
                </select>
                <PlusBtn title="Reduce beat (note) value" @click="lenNext"></PlusBtn>
            </div>
        </li>
    </ul>
</template>

<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>