<script setup lang="ts">
import LeftArrow from '@/components/common/LeftArrow.vue';
import RightArrow from '@/components/common/RightArrow.vue';
import type { State } from '@/metronome/State';
import { OptionStorage } from '@/utils/LocalStorage';
import { range } from '@/utils/range';
import { ref, watch } from 'vue';

const min = 40
const max = 320
const def = 120
const tempoList = range(min, max, 5)

const props = defineProps<{
    metronomeState: State
}>()

const tempo = ref(def)

const state = props.metronomeState
state.tempo = tempo.value
const s = new OptionStorage("metronome.tempo")

watch(tempo, (val) => setTempo(val))

function setTempo(val: number)
{
    val = val < min ? min :
        val > max ? max :
            val

    state.tempo = val
    tempo.value = val
    s.saveNumber(val)
}

function load()
{
    const val = s.loadNumber()
    if (!val) return

    setTempo(val)   
}

load()
</script>

<template>
    <div class="metr-el">
        <div class="metr-option-head">
            <span class="fnt f14 weak-clr">{{ min }}</span>
            <label for="metr-tempo" class="fnt f18 norm-clr">Tempo</label>
            <LeftArrow title="Reduce tempo" @click="tempo--"></LeftArrow>
            <input class="tempo-input el-clr norm-bg3 fnt f14" type="number" list="tempos" step="1" :min="min"
                :max="max" v-model="tempo">
            <RightArrow title="Increase tempo" @click="tempo++"></RightArrow>
            <datalist id="tempos">
                <option v-for="o in tempoList" :value="o">{{ o }}</option>
            </datalist>
            <span class="fnt f14 weak-clr">{{ max }}</span>
        </div>
        <input id="metr-tempo" class="tempo-range" type="range" step="1" :min="min" :max="max" v-model="tempo">
    </div>
</template>