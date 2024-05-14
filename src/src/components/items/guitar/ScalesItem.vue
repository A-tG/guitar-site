<script setup lang="ts">
import { Note, getNotesList } from "@/types/Note";
import Neck from "./Neck.vue"
import { inject, ref } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { defaultScaleId, getScalesIds } from "@/types/Scales";

const isFlat = inject(isFlatNotationKey)

const selectedScale = ref(defaultScaleId)
const isTriadMode = ref(false)
const root = ref(Note.C)

const textCommonClass = "norm-clr fnt f18"
const scales = getScalesIds().sort()
</script>

<template>
    <Neck></Neck>
    <div class="scale-block">
        <div class="scale-options">
            <span :class="textCommonClass">Root</span>
            <ul class="root-notes">
                <li class="fnt f18 el-clr hov-el-clr tr-al" v-for="n, i in getNotesList()" @click="root = n"
                    :class="root == i ? 'selected selected-text' : 'norm-bg2'">
                    {{ getNoteName(n, isFlat) }}
                </li>
            </ul>

            <span :class="textCommonClass">Numbered</span>
            <ul class="scale-notes-block">
                <li class="scale-note el-clr hov-el-clr norm-bg2">
                    <span class="fnt f18 norm-clr">1</span>
                    <span class="fnt f12 norm-clr">1</span>
                    <span class="fnt f18 tr-al">{{ getNoteName(root, isFlat) }}</span>
                    <div></div>
                </li>

                <li class="scale-note el-clr hov-el-clr norm-bg2">
                    <span class="fnt f18 norm-clr">1</span>
                    <span class="fnt f12 norm-clr">1</span>
                    <span class="fnt f18 tr-al">{{ getNoteName(root, isFlat) }}</span>
                    <div></div>
                </li>
            </ul>

            <span :class="textCommonClass">Relative to Major</span>

            <span :class="textCommonClass">Notes</span>

            <span :class="textCommonClass">Semitones</span>
        </div>

        <div class="scale-sel-block">
            <span :class="textCommonClass">Scale</span>
            <select class="fnt f18 capitalized el-clr norm-bg3" v-model="selectedScale">
                <option v-for="s in scales">{{ s }}</option>
            </select>
            <span :class="textCommonClass">Triads mode</span>
            <i class="el-clr hov-el-clr mi-filled md-24 tr-al"
                :class="isTriadMode ? 'mi-check-box' : 'mi-check-box-outline-blank'"
                @click="isTriadMode = !isTriadMode"></i>
        </div>
    </div>
</template>