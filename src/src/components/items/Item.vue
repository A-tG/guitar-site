<script setup lang="ts">
import ScalesItem from './guitar/Scales/ScalesItem.vue';

const props = defineProps<{
    onCloseButton: () => void
}>()
</script>

<template>
    <li class="item-block norm-bg1">
        <div class="item-content">
            <ScalesItem></ScalesItem>
        </div>
        <div class="item-controls">
            <div class="el-clr hov-el-clr mi-outlined md-36 mi-close tr-al" title="Close" @click="onCloseButton"></div>
            <div class="el-clr hov-el-clr mi-filled md-36 mi-menu tr-al" title="Open item's menu" v-if="false"></div>
            <div class="el-clr hov-el-clr mi-outlined mi-star md-36 tr-al" title="Set current options as default"></div>
        </div>
    </li>
</template>