<script setup lang="ts">
import { inject, watch } from 'vue';
import { inactiveNoteOpacityKey } from '../keys';

const min = 0
const max = 1

const opacity = inject(inactiveNoteOpacityKey)!
watch(opacity, (val) => {
    val = val < min ? min :
        val > max ? max : val
    opacity.value = val
})
</script>

<template>
    <input id="in-n-opacity" class="tempo-range" type="range" step="0.01" :min="min" :max="max" v-model="opacity">
</template>