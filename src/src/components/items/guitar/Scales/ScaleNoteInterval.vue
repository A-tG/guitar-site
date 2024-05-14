<script setup lang="ts">
import { ref, toRef } from 'vue';

const baseWidth = 10
const intervalsWidth = [1, 3.5, 5.5, 7, 9, 11, 13, 15]

const props = defineProps <{
    number: number,
    noteName: string,
    interval: number
}>()
const noteName = toRef(() => props.noteName)
const interval = toRef(() => props.interval)
const active = ref(true)
</script>

<template>
    <li class="scale-note el-clr hov-el-clr norm-bg2" @click="active = !active">
        <span class="fnt f18 norm-clr">{{ number }}</span>
        <span class="fnt f12 norm-clr">1</span>
        <span class="fnt f18 tr-al" :class="active ? '' : 'transparent'">{{ noteName }}</span>
        <div></div>
    </li>
    <li class="semitone-block f14" :style="`width: ${intervalsWidth[interval - 1] * baseWidth}px`">
        <span class="fnt norm-clr">{{ interval }}</span>
    </li>
</template>