<script setup lang="ts">
import { Note, getHigherNote, getNotesList } from "@/types/Note";
import Neck from "../Neck.vue"
import { inject, ref, watch } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { defaultScaleId, getIntervals, getScalesIds } from "@/types/Scales";
import ScaleNoteInterval from "./ScaleNoteInterval.vue";
import { SumArrElements } from "@/utils/array";

const isFlat = inject(isFlatNotationKey)

const selectedScale = ref(defaultScaleId)
const intervals = ref(getIntervals(selectedScale.value))
watch(selectedScale, (val) => {
    intervals.value = getIntervals(val)
})

const isTriadMode = ref(false)
const root = ref(Note.C)

const textCommonClass = "norm-clr fnt f18"
const scales = getScalesIds().sort()

function getScaleNote(noteNumber: number)
{
    if (noteNumber == 0) return root.value

    return getHigherNote(root.value, SumArrElements(intervals.value, noteNumber))
}
</script>

<template>
    <Neck v-model:rootNote="root"></Neck>
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
                <ScaleNoteInterval v-for="int, i in intervals" :noteName="getNoteName(getScaleNote(i), isFlat)"
                    :number="i + 1" :interval="int"></ScaleNoteInterval>
            </ul>

            <span :class="textCommonClass">Relative</span>
            <span :class="textCommonClass">Notes</span>
            <span :class="textCommonClass">Semitones</span>
        </div>

        <div class="scale-sel-block">
            <div class="scale-sel-title" @click="isTriadMode = !isTriadMode">
                <span :class="textCommonClass">Scale</span>
                <div class="el-clr hov-el-clr ">
                    <span :class="textCommonClass">Triads mode</span>
                    <i class="mi-filled md-24 tr-al"
                        :class="isTriadMode ? 'mi-check-box' : 'mi-check-box-outline-blank'"></i>
                </div>
            </div>
            <select class="fnt f18 capitalized el-clr norm-bg3" v-model="selectedScale">
                <option v-for="s in scales">{{ s }}</option>
            </select>
        </div>
    </div>
</template>