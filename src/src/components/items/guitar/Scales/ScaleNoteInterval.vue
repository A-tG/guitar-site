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
    <li class="note el-clr hov-el-clr norm-bg2" title="Toggle scale note display" @click="isActive = !isActive">
        <span class="fnt f18 norm-clr nonselect-txt">{{ number }}</span>
        <span class="fnt f12 norm-clr nonselect-txt">{{ relToMaj }}</span>
        <span class="fnt f18 tr-al nonselect-txt" :class="isActive ? '' : 'transparent'">{{ noteName }}</span>
        <div class="vert-line middle-gray-bg"></div>
    </li>
    <li class="semitone-block f14 middle-gray-border" v-if="interval"
        :style="`width: ${intervalsWidth[interval - 1] * baseWidth}px`">
        <span class="fnt norm-clr nonselect-txt">{{ interval }}</span>
    </li>
</template>

<style scoped>
.note {
    width: 40px;
    border-radius: 2px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}
.note>* {
    flex: 1;
    align-content: center;
}
.note .transparent {
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