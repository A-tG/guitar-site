<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
defineProps<{
    path: string,
    size?: number
}>()
</script>

<template>
    <SvgIcon class="el-clr hov-el-clr tr-al" type="mdi" :size="size ?? 22" :path="path"></SvgIcon>
</template>