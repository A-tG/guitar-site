<script setup lang="ts">
import SvgIconCommon from '../common/SvgIconCommon.vue';
import ScalesItem from './guitar/Scales/ScalesItem.vue';
import type { IState } from './guitar/Scales/types/IState';
import { mdiClose, mdiStar, mdiMenu } from "@mdi/js";

defineProps<{
    onCloseButton: () => void,
    state: IState
}>()
</script>

<template>
    <li class="item-block norm-bg1">
        <div class="item-content">
            <ScalesItem :state="state"></ScalesItem>
        </div>
        <div class="item-controls">
            <SvgIconCommon :size="36" :path="mdiClose" title="Close" @click="onCloseButton"></SvgIconCommon>
            <SvgIconCommon :size="36" :path="mdiMenu" title="Open item's menu" v-if="false"></SvgIconCommon>
            <SvgIconCommon :size="36" :path="mdiStar" title="Set current options as default" @click="state.saveDefaults"></SvgIconCommon>
        </div>
    </li>
</template>