<script setup lang="ts">
import { Note, getHigherNote, getNotesList } from "@/types/Note";
import Neck from "../Neck.vue"
import { inject, reactive, ref, watch } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { defaultScaleId, getIntervals, stepsRelativeToMajor } from "@/types/Scales";
import ScaleNoteInterval from "./ScaleNoteInterval.vue";
import { copyValues, sumArrElements } from "@/utils/array";
import { getConcatScaleName, getSortedConcatNamesIDs } from "./ScalesNames";
import { NoteDisplayMode } from "../NoteDisplayMode";

const relToMajList = stepsRelativeToMajor
const textCommonClass1 = "norm-clr fnt f16"
const textCommonClass2 = "norm-clr fnt f18"

const isFlat = inject(isFlatNotationKey)

const isTriadMode = ref(false)
const root = ref(Note.C)

const notesToggleList = reactive(Array(12).fill(true) as boolean[])
const triadsToggleList = reactive(Array(12).fill(false) as boolean[])
triadsToggleList.forEach((_, i, arr) => {
    if ((i === 0) || (i === 2) || (i === 4))
    {
        arr[i] = true
    }
})
const currentToggleList = reactive(notesToggleList.slice())

const selectedScale = ref(defaultScaleId)
const intervals = ref(getIntervals(selectedScale.value))
const notesDisplayModes = reactive(new Map(
    getNotesList().map(v => [v, NoteDisplayMode.Disabled]))
)
const notesExtraNames = reactive(new Map<Note, string>)

watch(isTriadMode, (val) =>
{
    updateNotesExtraNames()
    if (val)
    {
        copyValues(currentToggleList, notesToggleList)
        copyValues(triadsToggleList, currentToggleList)
        return
    }
    copyValues(currentToggleList, triadsToggleList)
    copyValues(notesToggleList, currentToggleList)
})
watch(currentToggleList, () => updateNotesDispModes())
watch(selectedScale, (val) => {
    intervals.value = getIntervals(val)

    updateNotesDispModes()
    updateNotesExtraNames()
})
watch(root, () => { 
    updateNotesDispModes()
    updateNotesExtraNames()
})

updateNotesDispModes()
updateNotesExtraNames()

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
        const mode = currentToggleList[i++] ?
            lastNote == root.value ? NoteDisplayMode.Highlight : NoteDisplayMode.Normal :
            NoteDisplayMode.Inactve
        notesDisplayModes.set(lastNote, mode)

        lastNote = getHigherNote(lastNote, int)
    }
}

function updateNotesExtraNames()
{
    notesExtraNames.clear()
    let note = root.value
    for (let i = 0; i < intervals.value.length; i++)
    {
        notesExtraNames.set(note, isTriadMode.value ? (i + 1).toString() : '')
        note = getHigherNote(note, intervals.value[i])
    }
}
</script>

<template>
    <Neck :notesDisplayModes="notesDisplayModes" :extraNoteNames="notesExtraNames"></Neck>
    <div class="scale-block">
        <div class="scale-options">
            <span :class="textCommonClass1">Root</span>
            <ul class="root-notes">
                <li class="fnt f18 el-clr hov-el-clr tr-al" v-for="n, i in getNotesList()" @click="root = n"
                    :class="root == i ? 'selected selected-text' : 'norm-bg2'">
                    {{ getNoteName(n, isFlat) }}
                </li>
            </ul>
            <span :class="textCommonClass1">Relative</span>
            <span :class="textCommonClass1">Notes</span>
            <span :class="textCommonClass1">Semitones</span>

            <span :class="textCommonClass1">Numbered</span>
            <ul class="scale-notes-block">
                <ScaleNoteInterval v-for="int, i in intervals" :noteName="getNoteName(getScaleNote(i), isFlat)"
                    v-model:isActive="currentToggleList[i]" :number="i + 1" :interval="int" :relToMaj="getRelToMaj(i)">
                </ScaleNoteInterval>
                <ScaleNoteInterval v-model:isActive="currentToggleList[0]" :noteName="getNoteName(root, isFlat)"
                    :number="1" :relToMaj="'1'">
                </ScaleNoteInterval>
            </ul>
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