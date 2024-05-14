<script setup lang="ts">
import { ColorTheme, themes } from '@/types/ColorTheme';
import { OptionStorage } from '@/utils/LocalStorage';
import { ArrayUtils } from '@/utils/array';
import { inject, ref, watch } from 'vue';
import { themeNameKey } from '../keys';

const s = new OptionStorage("colorTheme")
const theme = ref(ColorTheme.night)
const themeName = inject(themeNameKey)!

watch(theme, (val)=> {
    themeName.value = themes.get(val)!
    s.saveNumber(theme.value)
})

function next()
{
    const val = ArrayUtils.nextKey(themes, theme.value)
    if (!val) return

    theme.value = val
}

function load()
{
    const val = s.loadNumber()
    if (!val) return

    theme.value = val
}

load()
</script>

<template>
    <ul class="themes-block">
        <li class="el-clr hov-el-clr tr-al" title="Switch to night theme" 
            @click="theme = ColorTheme.night" v-if="theme != ColorTheme.night">
            <i class="mi-filled md-36 mi-dark-mode"></i>
        </li>
        <li class="el-clr hov-el-clr tr-al" title="Switch to day theme" 
            @click="theme = ColorTheme.day" v-if="theme != ColorTheme.day">
            <i class="mi-filled md-36 mi-light-mode"></i>
        </li>
    </ul>
</template>