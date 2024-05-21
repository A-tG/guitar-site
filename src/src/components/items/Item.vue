<script setup lang="ts">
import ScalesItem from './guitar/Scales/ScalesItem.vue';
import type { IState } from './guitar/Scales/types/IState';
import SvgIcon from '@jamescoyle/vue-icon';
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
            <div class="el-clr hov-el-clr tr-al" title="Close" @click="onCloseButton">
                <SvgIcon type="mdi" :size="36" :path="mdiClose"></SvgIcon>
            </div>
            <div class="el-clr hov-el-clr tr-al" title="Open item's menu" v-if="false">
                <SvgIcon type="mdi" :size="36" :path="mdiMenu"></SvgIcon>
            </div>
            <div class="el-clr hov-el-clr tr-al" title="Set current options as default" @click="state.saveDefaults">
                <SvgIcon type="mdi" :size="36" :path="mdiStar"></SvgIcon>
            </div>
        </div>
    </li>
</template>