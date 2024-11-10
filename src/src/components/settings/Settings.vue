<script setup lang="ts">
import { ref } from 'vue';
import NotationSwitcher from './NotationSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import ModalWindow from '../ModalWindow.vue';
import InactiveNoteOpacity from './InactiveNoteOpacity.vue';
import { mdiCog } from "@mdi/js";
import SvgIconCommon from '../common/SvgIconCommon.vue';

const commonClasses = 'norm-clr fnt f18'

const isShown = ref(false)
</script>

<template>
    <li class="open-btn" title="Open settings">
        <SvgIconCommon :size="36" :path="mdiCog" @click="isShown = !isShown"></SvgIconCommon>
    </li>

    <SafeTeleport to="#modal" :disabled="!isShown">
        <ModalWindow title="Settings" v-show="isShown" :onCloseButton="() => isShown = false">
            <div class="content">
                <span class="title" :class="commonClasses">Theme</span>
                <ThemeSwitcher></ThemeSwitcher>
                <div class="separator norm-bg2"></div>
                <span class="title" :class="commonClasses">Notation</span>
                <NotationSwitcher></NotationSwitcher>
                <div class="separator norm-bg2"></div>
                <span class="whole-row" :class="commonClasses">Scales</span>
                <div class="whole-row">
                    <span class="title" :class="commonClasses">Inactive note opacity</span>
                    <InactiveNoteOpacity></InactiveNoteOpacity>
                </div>
            </div>
        </ModalWindow>
    </SafeTeleport>
</template>

<style scoped>
.whole-row > .title {
    display: block;
}
.content {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 8px;
}
.whole-row {
    grid-column: 1 / -1;
}
.content .title {
    justify-self: left;
    text-align: start;
}
.separator {
    grid-column: 1 / -1;
    height: 2px;
    width: 100%;
}
.open-btn {
    vertical-align: middle;
    display: inline-block;
}
</style>