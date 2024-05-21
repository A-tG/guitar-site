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
    <li class="scale-note el-clr hov-el-clr norm-bg2" title="Toggle scale note display" @click="isActive = !isActive">
        <span class="fnt f18 norm-clr">{{ number }}</span>
        <span class="fnt f12 norm-clr">{{ relToMaj }}</span>
        <span class="fnt f18 tr-al" :class="isActive ? '' : 'transparent'">{{ noteName }}</span>
        <div class="vert-line middle-gray-bg"></div>
    </li>
    <li class="semitone-block f14 middle-gray-border" v-if="interval"
        :style="`width: ${intervalsWidth[interval - 1] * baseWidth}px`">
        <span class="fnt norm-clr">{{ interval }}</span>
    </li>
</template>

<style scoped>
.scale-note {
    width: 40px;
    border-radius: 2px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}
.scale-note>* {
    flex: 1;
    align-content: center;
}
.scale-note .transparent {
    opacity: .5;
}
.semitone-block {
    display: flex;
    justify-content: center;
    align-items: end;
    border-bottom-width: 2px;
    border-bottom-style: solid;
}
.vert-line {
    height: 100%;
    width: 2px;
}
</style>