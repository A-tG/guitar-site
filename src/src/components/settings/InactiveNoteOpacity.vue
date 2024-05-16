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

<template style="display: flex">
    <div>
        <input id="in-n-opacity" type="range" step="0.01" :min="min" :max="max" v-model="opacity">
        <span class="norm-clr fnt f18">{{ Math.floor(opacity * 100) }}%</span>
    </div>
</template>

<style scoped>
span {
    width: 4ch;
    text-align: end;
}
div {
    display: flex;
}
input {
    flex: 1;
}
</style>