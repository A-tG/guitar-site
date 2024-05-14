<script setup lang="ts">

const baseWidth = 10
const intervalsWidth = [1, 3.5, 5.5, 7, 9, 11, 13, 15]

defineProps <{
    number: number,
    relToMaj: string,
    noteName: string,
    interval?: number
}>()
const isActive = defineModel<boolean>('isActive', { required: true })
</script>

<template>
    <li class="scale-note el-clr hov-el-clr norm-bg2" @click="isActive = !isActive">
        <span class="fnt f18 norm-clr">{{ number }}</span>
        <span class="fnt f12 norm-clr">{{ relToMaj }}</span>
        <span class="fnt f18 tr-al" :class="isActive ? '' : 'transparent'">{{ noteName }}</span>
        <div></div>
    </li>
    <li class="semitone-block f14" v-if="interval" :style="`width: ${intervalsWidth[interval - 1] * baseWidth}px`">
        <span class="fnt norm-clr">{{ interval }}</span>
    </li>
</template>