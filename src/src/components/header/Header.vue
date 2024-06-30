<script setup lang="ts">
import SiteIcon from "./SiteIcon.vue"
import HeadSeparator from "./HeadSeparator.vue"
import Metronome from "./metronome/Metronome.vue"
import Settings from "@/components/settings/Settings.vue"
</script>

<template>
    <header class="head-block norm-bg1">
        <ul class="head-block-content">
            <li>
                <a class="norm-clr fnt f24" href="?" title="Artistic Guitar">
                    <SiteIcon></SiteIcon>
                    <span class="head-subitem">A-tGuitar</span>
                </a>
            </li>
            <HeadSeparator></HeadSeparator>
            <li>
                <a class="el-clr fnt f24 hov-el-clr tr-al" href="https://taplink.cc/atgdev" title="Donate">Donate</a>
            </li>
            <HeadSeparator></HeadSeparator>
            <li>
                <Metronome></Metronome>
            </li>
            <HeadSeparator></HeadSeparator>
            <Settings></Settings>
        </ul>
    </header>
</template>

<style scoped>
.head-block {
    width: 100%;
    min-height: 50px;
}

.head-block-content {
    text-align: center;
}
.head-block-content > * {
    padding: 0 8px;
    vertical-align: middle;
    display: inline-block;
}

.head-block a {
    text-decoration: none;
}

.head-subitem {
    vertical-align: middle;
}

.head-separator {
    padding: 0;
    width: 2px;
    height: 30px;
}

@media screen and (max-width: 1200px) {
    .head-block-content>* {
        display: block;
        padding-bottom: 6px;
        padding-top: 6px;
    }

    .head-separator {
        width: 100%;
        height: 2px;
        padding: 0;
    }
}
</style>