<script setup lang="ts">
import { provide, ref } from "vue"
import Footer from "./components/Footer.vue"
import Header from "./components/header/Header.vue"
import { ColorTheme, themesNames } from "./types/ColorTheme";
import ItemsContainer from "./components/items/ItemsContainer.vue";
import { inactiveNoteOpacityKey, isFlatNotationKey, themeNameKey } from "./components/keys";
import { TeleportTarget } from "vue-safe-teleport";

const themeName = ref(themesNames.get(ColorTheme.night)!)
provide(themeNameKey, themeName)
provide(isFlatNotationKey, ref(false))

const inactiveNoteOpacity = ref(0.7)
provide(inactiveNoteOpacityKey, inactiveNoteOpacity)
</script>

<template>
    <div id="content" class="bg-block" :class="themeName">
        <TeleportTarget id="modal"></TeleportTarget>
        <div class="content-block norm-bg2">
            <Header></Header>
            <ItemsContainer></ItemsContainer>
            <Footer></Footer>
        </div>
    </div>
</template>

<style>
.inactive-note {
    opacity: v-bind('inactiveNoteOpacity');
}
</style>