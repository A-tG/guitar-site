<script setup lang="ts">
import { Note, getHigherNote, getNotesList } from "@/types/Note";
import Neck from "../Neck.vue"
import { inject, reactive, ref, watch } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { defaultScaleId, getIntervals, getScalesIds, stepsRelativeToMajor } from "@/types/Scales";
import ScaleNoteInterval from "./ScaleNoteInterval.vue";
import { sumArrElements } from "@/utils/array";


const relToMajList = stepsRelativeToMajor

const isFlat = inject(isFlatNotationKey)

const isTriadMode = ref(false)
const root = ref(Note.C)
const notesToggleList = reactive(Array(12).fill(true))

const selectedScale = ref(defaultScaleId)
const intervals = ref(getIntervals(selectedScale.value))
const notesToShow = ref<Note[]>([])
notesToShow.value = getNotesToShow()
watch(selectedScale, (val) => {
    intervals.value = getIntervals(val)

    notesToShow.value = getNotesToShow()
})
watch(root, () => notesToShow.value = getNotesToShow())


const textCommonClass = "norm-clr fnt f18"
const scales = getScalesIds().sort()

function getScaleNote(noteNumber: number)
{
    if (noteNumber == 0) return root.value

    return getHigherNote(root.value, sumArrElements(intervals.value, noteNumber))
}

function getRelToMaj(noteNumber: number)
{
    if (noteNumber == 0) return relToMajList[noteNumber]

    return relToMajList[sumArrElements(intervals.value, noteNumber)]
}

function getNotesToShow()
{
    const notes = [root.value]
    let lastN = notes[0]
    for (const int of intervals.value)
    {
        lastN = getHigherNote(lastN, int)
        notes.push(lastN)
    }
    return notes
}
</script>

<template>
    <Neck v-model:rootNote="root" v-model:notesToShow="notesToShow"></Neck>
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
                    v-model:isActive="notesToggleList[i]" :number="i + 1" :interval="int" :relToMaj="getRelToMaj(i)">
                </ScaleNoteInterval>
                <ScaleNoteInterval v-model:isActive="notesToggleList[0]" :noteName="getNoteName(root, isFlat)"
                    :number="1" :relToMaj="'1'">
                </ScaleNoteInterval>
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