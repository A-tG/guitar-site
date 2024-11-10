<script setup lang="ts">
import { OptionStorage } from '@/utils/LocalStorage';
import { computed, inject, watch} from 'vue';
import { isFlatNotationKey } from '../keys';
import { mdiMusicAccidentalSharp, mdiMusicAccidentalFlat } from "@mdi/js";
import SvgIconCommon from '../common/SvgIconCommon.vue';

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
    <SvgIconCommon :size="36" :path="mdiMusicAccidentalSharp" title="Switch to sharp notation"
        @click="isFlat = false" v-show="isFlat"></SvgIconCommon>
    <SvgIconCommon :size="36" :path="mdiMusicAccidentalFlat" title="Switch to flat notation"
        @click="isFlat = true" v-show="!isFlat"></SvgIconCommon>
</template>