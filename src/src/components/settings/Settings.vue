<script setup lang="ts">
import { ref } from 'vue';
import NotationSwitcher from './NotationSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import ModalWindow from '../ModalWindow.vue';
import InactiveNoteOpacity from './InactiveNoteOpacity.vue';

const commonClasses = 'norm-clr fnt f18'

const isShown = ref(false)
</script>

<template>
    <li id="common-settings-wrap">
        <i class="el-clr hov-el-clr tr-al mi-filled md-36 mi-settings" title="Open settings"
            @click="isShown = !isShown">
        </i>
    </li>

    <SafeTeleport to="#modal" :disabled="!isShown">
        <ModalWindow title="Settings" v-show="isShown" :onCloseButton="() => isShown = false">
            <div class="settings-content">
                <span class="title" :class="commonClasses">Theme</span>
                <ThemeSwitcher></ThemeSwitcher>
                <div class="settings-separator norm-bg2"></div>
                <span class="title" :class="commonClasses">Notation</span>
                <NotationSwitcher></NotationSwitcher>
                <div class="settings-separator norm-bg2"></div>
                <div class="whole-row">
                    <div>
                        <span class="title" :class="commonClasses">Inactive note opacity</span>
                    </div>
                    <InactiveNoteOpacity></InactiveNoteOpacity>
                </div>
            </div>
        </ModalWindow>
    </SafeTeleport>
</template>