<script setup lang="ts">
import { ColorTheme, isColorTheme, themesNames } from '@/types/ColorTheme';
import { OptionStorage } from '@/utils/LocalStorage';
import { inject, ref, watch } from 'vue';
import { themeNameKey } from '../keys';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiWhiteBalanceSunny, mdiWeatherNight } from "@mdi/js";

const matchMediaStr = '(prefers-color-scheme: light)'

const s = new OptionStorage("colorTheme")
const theme = ref(ColorTheme.night)
const themeName = inject(themeNameKey)!

const isAutoThemeSupported = !!window.matchMedia

watch(theme, (val)=> {
    if (!isAutoThemeSupported && (val == ColorTheme.auto))
    {
        val = ColorTheme.night
    }
    themeName.value = getThemeName(val)
    s.saveNumber(val)
})


function getThemeName(theme: ColorTheme)
{
    if (isAutoThemeSupported && (theme === ColorTheme.auto))
    {
        const isLight = window.matchMedia(matchMediaStr).matches ?? false
        const t = isLight ? ColorTheme.day : ColorTheme.night
        theme = t
    }
    return themesNames.get(theme)!
}

function load()
{
    const val = s.loadNumber()!
    if (isNaN(val)) return

    if (!isColorTheme(val)) return

    theme.value = val
}

if (isAutoThemeSupported)
{
    window.matchMedia(matchMediaStr).addEventListener('change', (e) => {
        const t = e.matches ? ColorTheme.day : ColorTheme.night
        themeName.value = getThemeName(t)
    })
}

load()
</script>

<template>
    <ul class="block">
        <li class="el-clr hov-el-clr tr-al" title="Switch to night theme" @click="theme = ColorTheme.night"
            v-show="theme != ColorTheme.night">
            <SvgIcon type="mdi" :size="36" :path="mdiWeatherNight"></SvgIcon>
        </li>
        <li class="el-clr hov-el-clr tr-al" title="Switch to day theme" @click="theme = ColorTheme.day"
            v-show="theme != ColorTheme.day">
            <SvgIcon type="mdi" :size="36" :path="mdiWhiteBalanceSunny"></SvgIcon>
        </li>
        <li class="el-clr hov-el-clr tr-al" title="Switch to automatic theme" @click="theme = ColorTheme.auto"
            v-show="(theme != ColorTheme.auto) && isAutoThemeSupported">
            <i class="fnt f-bold f36 icon">A</i>
        </li>
    </ul>
</template>

<style scoped>
.block {
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon {
    height: 1em;
    width: 1em;
    font-style: normal;
    display: block;
    line-height: 1;
}
.block > * {
    margin: 0 4px;
}
</style>