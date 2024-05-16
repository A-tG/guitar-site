<script setup lang="ts">
import { Note, getHigherNote, getNotesList } from "@/types/Note";
import Neck from "../Neck.vue"
import { inject, reactive, ref, watch } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { defaultScaleId, getIntervals, stepsRelativeToMajor } from "@/types/Scales";
import ScaleNoteInterval from "./ScaleNoteInterval.vue";
import { sumArrElements } from "@/utils/array";
import { getConcatScaleName, getSortedConcatNamesIDs } from "./ScalesNames";
import { NoteDisplayMode } from "../NoteDisplayMode";


const relToMajList = stepsRelativeToMajor

const isFlat = inject(isFlatNotationKey)

const isTriadMode = ref(false)
const root = ref(Note.C)
const notesToggleList = reactive(Array(12).fill(true))
watch (notesToggleList, () => updateNotesDispModes())

const selectedScale = ref(defaultScaleId)
const intervals = ref(getIntervals(selectedScale.value))
const notesDisplayModes = reactive(new Map(
    getNotesList().map(v => [v, NoteDisplayMode.Disabled]))
)
updateNotesDispModes()
watch(selectedScale, (val) => {
    intervals.value = getIntervals(val)

    updateNotesDispModes()
})
watch(root, () => updateNotesDispModes())

const textCommonClass1 = "norm-clr fnt f16"
const textCommonClass2 = "norm-clr fnt f18"

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

function updateNotesDispModes()
{
    notesDisplayModes.forEach((_, k, list) => list.set(k, NoteDisplayMode.Disabled))
    let lastNote = root.value
    let i = 0
    for (const int of intervals.value)
    {
        const mode = notesToggleList[i++] ?
            lastNote == root.value ? NoteDisplayMode.Highlight : NoteDisplayMode.Normal :
            NoteDisplayMode.Inactve
        notesDisplayModes.set(lastNote, mode)

        lastNote = getHigherNote(lastNote, int)
    }
}
</script>

<template>
    <Neck :notesDisplayModes="notesDisplayModes"></Neck>
    <div class="scale-block">
        <div class="scale-options">
            <span :class="textCommonClass1">Root</span>
            <ul class="root-notes">
                <li class="fnt f18 el-clr hov-el-clr tr-al" v-for="n, i in getNotesList()" @click="root = n"
                    :class="root == i ? 'selected selected-text' : 'norm-bg2'">
                    {{ getNoteName(n, isFlat) }}
                </li>
            </ul>

            <span :class="textCommonClass1">Numbered</span>
            <ul class="scale-notes-block">
                <ScaleNoteInterval v-for="int, i in intervals" :noteName="getNoteName(getScaleNote(i), isFlat)"
                    v-model:isActive="notesToggleList[i]" :number="i + 1" :interval="int" :relToMaj="getRelToMaj(i)">
                </ScaleNoteInterval>
                <ScaleNoteInterval v-model:isActive="notesToggleList[0]" :noteName="getNoteName(root, isFlat)"
                    :number="1" :relToMaj="'1'">
                </ScaleNoteInterval>
            </ul>

            <span :class="textCommonClass1">Relative</span>
            <span :class="textCommonClass1">Notes</span>
            <span :class="textCommonClass1">Semitones</span>
        </div>

        <div class="scale-sel-block">
            <div class="scale-sel-title" @click="isTriadMode = !isTriadMode">
                <span :class="textCommonClass2">Scale</span>
                <div class="el-clr hov-el-clr ">
                    <span :class="textCommonClass2">Triads mode</span>
                    <i class="mi-filled md-24 tr-al"
                        :class="isTriadMode ? 'mi-check-box' : 'mi-check-box-outline-blank'"></i>
                </div>
            </div>
            <select class="fnt f18 capitalized el-clr norm-bg3" v-model="selectedScale">
                <option v-for="s in getSortedConcatNamesIDs()" :value="s">{{ getConcatScaleName(s).value }}</option>
            </select>
        </div>
    </div>
</template>