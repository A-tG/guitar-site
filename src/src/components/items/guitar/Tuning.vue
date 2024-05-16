<script setup lang="ts">
import { watch } from 'vue';
import { getTuningsIds } from '@/types/Tunings';
import LeftArrow from '@/components/common/LeftArrow.vue';
import RightArrow from '@/components/common/RightArrow.vue';
import { getTuningName } from './TuningsNames';

const tuningId = defineModel<string>("tuningId", { required: true })
const HS = defineModel<number>("HS", { required: true })

const maxHS = 11

watch(HS, (val) => {
    val = val < -maxHS ? -maxHS :
        val > maxHS ? maxHS : val

    HS.value = val
})
</script>

<template>
    <div class="tuning-sel-block">
        <div>
            <div>
                <span class="norm-clr fnt f18">Tuning</span>
            </div>
            <select class="fnt f18 capitalized el-clr norm-bg3" v-model="tuningId">
                <option v-for="t in getTuningsIds()" :value="t"> {{ getTuningName(t).value }}</option>
                <option value="custom">Custom</option>
            </select>
        </div>
        <div class="halfsteps-block">
            <span class="norm-clr fnt f18">Half-steps</span>
            <LeftArrow @click="HS--"></LeftArrow>
            <select class="fnt f14 capitalized el-clr norm-bg3" v-model="HS">
                <option v-for="i in (maxHS * 2) + 1" :value="i - maxHS - 1">
                    {{ i - maxHS - 1 }}
                </option>
            </select>
            <RightArrow @click="HS++"></RightArrow>
        </div>
    </div>
</template>