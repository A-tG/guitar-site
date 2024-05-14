<script setup lang="ts">
import { provide, ref } from "vue"
import Footer from "./components/Footer.vue"
import Header from "./components/header/Header.vue"
import { ColorTheme, themes } from "./types/ColorTheme";
import ItemsContainer from "./components/items/ItemsContainer.vue";
import { isFlatNotationKey, themeNameKey } from "./components/keys";
import { TeleportTarget } from "vue-safe-teleport";

const themeName = ref(themes.get(ColorTheme.night)!)
provide(themeNameKey, themeName)
provide(isFlatNotationKey, ref(false))
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
