<script setup lang="ts">
import { OptionStorage } from '@/utils/LocalStorage';
import { computed, inject, watch} from 'vue';
import { isFlatNotationKey } from '../keys';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMusicAccidentalSharp, mdiMusicAccidentalFlat } from "@mdi/js";

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
    <div class="el-clr hov-el-clr tr-al" title="Switch to sharp notation"
        @click="isFlat = false" v-if="isFlat">
        <SvgIcon type="mdi" :size="36" :path="mdiMusicAccidentalSharp"></SvgIcon>
    </div>
    <div class="el-clr hov-el-clr tr-al" title="Switch to flat notation"
        @click="isFlat = true" v-if="!isFlat">
        <SvgIcon type="mdi" :size="36" :path="mdiMusicAccidentalFlat"></SvgIcon>
    </div>
</template>