<script setup lang="ts">
const props = defineProps<{
    title: string,
    onCloseButton: () => void
}>()
</script>

<template>
    <div class="modal-block-wrap" @click.self="onCloseButton">
        <div class="norm-bg1 modal-block">
            <div class="modal-block-controls">
                <span class="norm-clr fnt f-bold f18">{{ title }}</span>
                <i class="el-clr hov-el-clr tr-al mi-outlined md-28 mi-close" title="Close settings"
                    @click="onCloseButton"></i>
            </div>
            <div class="modal-block-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style>
.modal-block-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: contrast(.9) blur(2px);
}
.modal-block {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    text-align: center;
}
.modal-block-content {
    margin: 15px;
    margin-top: 0;
}
.modal-block-content>*:nth-child(3n + 1) {
    justify-self: left;
}
</style>