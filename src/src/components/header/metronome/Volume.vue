<script setup lang="ts">
import type { State } from '@/metronome/State';
import { OptionStorage } from '@/utils/LocalStorage';
import { ref, watch } from 'vue';

const min = 0
const max = 100
const def = 50

const props = defineProps<{
    metronomeState: State
}>()

const s = new OptionStorage("metronome.volume")

const volume = ref(def)
const isHover = ref(false)
const isFocused = ref(false)

const state = props.metronomeState
state.volumePercentageLog = volume.value

function setVolume(val: number)
{
    val = val < min ? min :
        val > max ? max :
            val
    state.volumePercentageLog = val
    volume.value = val
    s.saveNumber(val)
}

watch(volume, (val) => setVolume(val))

function load()
{
    const val = s.loadNumber()
    if (!val && val !== 0) return

    setVolume(val)
}

load()
</script>

<template>
    <div @mouseover="isHover = true" @mouseleave="isHover = false">
        <div class="metr-option-head">
            <span class="fnt f14 weak-clr">{{ min }}%</span>
            <div class="fnt f18 norm-clr">
                <span class="vol-number" v-show="isHover || isFocused">{{ volume }}</span>
                <label for="metr-vol" :class="{ invis: isHover || isFocused }">Volume</label>
            </div>
            <span class="fnt f14 weak-clr">{{ max }}%</span>
        </div>
        <input id="metr-vol" class="volume-range" type="range" :min="min" :max="max" step="1" @focus="isFocused = true"
            @blur="isFocused = false" v-model="volume">
    </div>
</template>