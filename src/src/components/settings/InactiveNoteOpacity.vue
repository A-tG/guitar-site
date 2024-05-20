<script setup lang="ts">
import { inject, watch } from 'vue';
import { inactiveNoteOpacityKey } from '../keys';
import { OptionStorage } from '@/utils/LocalStorage';

const min = 0
const max = 1

const o = new OptionStorage("inactiveNoteOpacity")

const opacity = inject(inactiveNoteOpacityKey)!
watch(opacity, (val) => {
    val = val < min ? min :
        val > max ? max : val
    opacity.value = val
    o.saveNumber(val)
})

function load()
{
    let val = o.loadNumber()
    if (!val && val !== 0) return

    opacity.value = val
}

load()
</script>

<template style="display: flex">
    <div class="block">
        <input id="in-n-opacity" class="input" type="range" step="0.01" :min="min" :max="max" v-model="opacity">
        <span class="text norm-clr fnt f18">{{ Math.floor(opacity * 100) }}%</span>
    </div>
</template>

<style scoped>
.text {
    width: 4ch;
    text-align: end;
}
.block {
    display: flex;
}
.input {
    flex: 1;
}
</style>