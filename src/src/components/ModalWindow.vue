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