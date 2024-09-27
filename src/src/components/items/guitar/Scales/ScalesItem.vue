<script setup lang="ts">
import { Note, getHigherNote, getNotesList } from "@/types/Note";
import Neck from "../Neck.vue"
import { inject, reactive, ref, watch, type Ref } from "vue";
import { isFlatNotationKey } from "@/components/keys";
import { getNoteName } from '@/types/Note';
import { getIntervals, stepsRelativeToMajor } from "@/types/Scales";
import ScaleNoteInterval from "./ScaleNoteInterval.vue";
import { copyValues, sumArrElements } from "@/utils/array";
import { getConcatScaleName, getIdFromName, getSortedConcatNamesUniqIDs } from "./ScalesNames";
import { NoteDisplayMode } from "../NoteDisplayMode";
import type { ScalesItemState } from "./types/ScalesItemState";
import type { IState } from "./types/IState";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMagnify, mdiBackspace } from "@mdi/js";

const relToMajList = stepsRelativeToMajor
const textCommonClass1 = "norm-clr fnt f16"
const textCommonClass2 = "norm-clr fnt f18"

const isFlat = inject(isFlatNotationKey)
const props = defineProps<{
    state: IState
}>()
const state = props.state as ScalesItemState

const isTriadMode = ref(state.isTriads)
const root = ref(state.scale.root)

const notesToggleList = state.notesPattern
const triadsToggleList = state.triadsPattern
const currentToggleList = reactive(isTriadMode.value ? state.triadsPattern.slice() : state.notesPattern.slice())

const selectedScale = ref(state.scale.id)
const intervals = ref(getIntervals(selectedScale.value))
const notesDisplayModes = reactive(new Map(
    getNotesList().map(v => [v, NoteDisplayMode.Disabled]))
)
const notesExtraNames = reactive(new Map<Note, string>)
watch(isTriadMode, (val) =>
{
    state.isTriads = val
    
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
watch(currentToggleList, (val) => {
    if (isTriadMode.value)
    {
        copyValues(val, triadsToggleList)
    } else
    {
        copyValues(val, notesToggleList)
    }
    updateNotesDispModes()
})
watch(selectedScale, (val) => {
    if (!val) return

    state.scale.id = val
    intervals.value = getIntervals(val)
    updateNotesDispModes()
    updateNotesExtraNames()
})
watch(root, (val) => {
    state.scale.root = val

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

const filter = ref("")
watch(filter, (val) => {
    if (val.length == 0) return

    const res = getIdFromName(val)
    if (!res) return

    selectedScale.value = res
    filter.value = ''
})
</script>

<template>
    <Neck :notesDisplayModes="notesDisplayModes" :extraNoteNames="notesExtraNames" :state="state"></Neck>
    <div class="root-cont">
        <div class="options">
            <span :class="textCommonClass1">Root</span>
            <div class="flex">
                <div>
                    <ul class="root-notes">
                        <li class="fnt f18 el-clr hov-el-clr tr-al" title="Select root note" v-for="n, i in getNotesList()" @click="root = n"
                            :class="root == i ? 'selected selected-text' : 'norm-bg2'">
                            {{ getNoteName(n, isFlat) }}
                        </li>
                    </ul>
                </div>
                <div class="el-clr hov-el-clr triad-mode-cont" @click="isTriadMode = !isTriadMode">
                    <span :class="textCommonClass1">Triads</span>
                    <SvgIcon class="tr-al" type="mdi" :size="22"
                        :path="isTriadMode ? mdiCheckboxMarked : mdiCheckboxBlankOutline"></SvgIcon>
                </div>
            </div>
            <span :class="textCommonClass1">Numbered</span>
            <span :class="textCommonClass1">Relative</span>
            <span :class="textCommonClass1">Notes</span>
            <span :class="textCommonClass1">Semitones</span>
            <ul class="scale-notes-block">
                <ScaleNoteInterval v-for="int, i in intervals" :noteName="getNoteName(getScaleNote(i), isFlat)"
                    v-model:isActive="currentToggleList[i]" :number="i + 1" :interval="int" :relToMaj="getRelToMaj(i)">
                </ScaleNoteInterval>
                <ScaleNoteInterval v-model:isActive="currentToggleList[0]" :noteName="getNoteName(root, isFlat)"
                    :number="1" :relToMaj="'1'">
                </ScaleNoteInterval>
            </ul>
        </div>

        <div class="sel-block">
            <div class="sel-title">
                <span :class="textCommonClass2">Scale</span>
                <datalist :id="$.uid.toString()">
                    <option v-for="s in getSortedConcatNamesUniqIDs()">{{ getConcatScaleName(s).value }}</option>
                </datalist>
                <div class="filter-cont norm-bg3" :class="textCommonClass2">
                    <SvgIcon class="tr-al filter-btn norm-clr" type="mdi" :size="22" :path="mdiMagnify"></SvgIcon>
                    <input aria-label="Filter scales" class="filter-inp f18 norm-clr" type="text" 
                        v-model.trim="filter" :list="$.uid.toString()">
                    <SvgIcon class="tr-al filter-btn el-clr hov-el-clr" type="mdi" :size="22"
                        :path="mdiBackspace" @click="filter = ''" :class="{ invis: filter.length == 0}"></SvgIcon>
                </div>
            </div>
            <select aria-label="Select scale" class="fnt f18 capitalized el-clr norm-bg3" v-model="selectedScale">
                <option v-for="s in getSortedConcatNamesUniqIDs()" :value="s"
                    v-show="(filter.length == 0) || (getConcatScaleName(s).value.includes(filter))">
                        {{ getConcatScaleName(s).value }}
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.root-cont {
    white-space: nowrap;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: start;
    padding-top: 20px;
    gap: 20px;
}

.flex {
    display: flex;
    vertical-align: middle;
}

.triad-mode-cont {
    margin-left: 12px;
    display: flex;
    align-items: center;
}

.filter-cont {
    flex: 1;
    margin: 0 15px;
    display: flex;
}
.filter-btn {
    margin-right: 5px;
}
.filter-inp {
    background: none;
    border: 0;
    flex: 1;
}

.options {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
}
.options {
    column-gap: 5px
}
.options > * {
    text-align: left;
}
.options > *:nth-child(-n + 2) {
    margin-bottom: 15px;
}

.sel-block {
    display: flex;
    flex-direction: column;
}
.sel-block > * {
    text-align: left;
}

.sel-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}
.sel-title * {
    vertical-align: middle;
}

.root-notes {
    display: flex;
    gap: 12px;
}
.root-notes > * {
    text-align: center;
    width: 2ch;
    padding: 3px;
    border-radius: 4px;
}

.scale-notes-block {
    display: flex;
    height: 100%;
    grid-row: 2 / span 5;
    grid-column: 2;
}

.scale-notes-block .selected {
    background: none;
}
</style>