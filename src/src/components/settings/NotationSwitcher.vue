<script setup lang="ts">
import { OptionStorage } from '@/utils/LocalStorage';
import { computed, inject, watch} from 'vue';
import { isFlatNotationKey } from '../keys';

const isFlat = inject(isFlatNotationKey)!

const s = new OptionStorage("isFlatNotation")
const titleText = computed(() => `Switch to ${isFlat.value ? 'sharp' : 'flat'} notation`)

watch(isFlat, () => save())

function save()
{
    s.saveBool(isFlat.value as boolean)
}
function load()
{
    const val = s.loadBool()
    if (!val) return

    isFlat.value = val
}

load()
</script>

<template>
    <i class="mi-outlined md-36 fnt-el fnt el-clr hov-el-clr tr-al" :title="titleText" @click="isFlat = !isFlat"
        :class="{ 'i-note-flat': !isFlat, 'i-note-sharp': isFlat }"></i>
</template>