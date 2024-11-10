<script setup lang="ts">
import { mdiClose } from "@mdi/js";
import SvgIconCommon from './common/SvgIconCommon.vue';

defineProps<{
    title: string,
    onCloseButton: () => void
}>()
</script>

<template>
    <div class="wrap" @click.self="onCloseButton">
        <div class="norm-bg1 block">
            <div class="controls norm-bg2">
                <span class="norm-clr fnt f-bold f18">{{ title }}</span>
                <div class="close-btn-block el-clr hov-el-clr tr-al" title="Close settings" @click="onCloseButton">
                    <SvgIconCommon :size="28" :path="mdiClose"></SvgIconCommon>
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
.controls {
    display: flex;
    justify-content: center;
    align-items: center;
}
.controls {
    padding-left: 10px;
    margin-bottom: 5px;
}
.controls>*:first-child {
    flex: 1;
}
.controls>*:last-child {
    margin-left: auto;
}
.close-btn-block {
    display: flex;
}
</style>