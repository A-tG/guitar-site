<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from "@mdi/js";

defineProps<{
    title: string,
    onCloseButton: () => void
}>()
</script>

<template>
    <div class="wrap" @click.self="onCloseButton">
        <div class="norm-bg1 block">
            <div class="controls">
                <span class="norm-clr fnt f-bold f18">{{ title }}</span>
                <div class="el-clr hov-el-clr tr-al" title="Close settings" @click="onCloseButton">
                    <SvgIcon type="mdi" :size="28" :path="mdiClose"></SvgIcon>
                </div>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrap {
    display: flex;
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: contrast(.9) blur(1.5px);
    overflow: auto;
}
.block {
    margin: auto;
    display: flex;
    flex-direction: column;
    margin: auto;
    text-align: center;
}
.content {
    margin: 15px;
    margin-top: 0;
}
.content>*:nth-child(3n + 1) {
    justify-self: left;
}
.controls {
    display: flex;
    justify-content: center;
    align-items: center;
}
.controls {
    padding-left: 10px;
}
.controls>*:first-child {
    flex: 1;
}
.controls>*:last-child {
    margin-left: auto;
}
</style>