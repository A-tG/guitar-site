<script setup lang="ts">
import { inject, reactive, ref, watch, type Ref } from 'vue';
import Tuner from './Tuner.vue';
import { getStringTuning, getTuningNotes, getTuningsIds, type TuningID } from '@/types/Tunings';
import { Note, getLowerNote, getHigherNote as highN, getNoteName as noteN } from '@/types/Note';
import { getFretWidth } from '@/types/Frets';
import { isFlatNotationKey } from '@/components/keys';
import { SafeTeleport } from 'vue-safe-teleport';
import ModalWindow from '@/components/ModalWindow.vue';
import Tuning from './Tuning.vue';
import LeftArrow from '@/components/common/LeftArrow.vue';
import RightArrow from '@/components/common/RightArrow.vue';
import { NoteDisplayMode } from './NoteDisplayMode';
import { clearArr, copyValues, isArraysEqual } from '@/utils/array';
import type { ScalesItemState } from './Scales/types/ScalesItemState';

const customId: TuningID = 'custom'
const minStringsNumber = 3
const maxStringsNumber = 18
const fretsNumber = 24
const scaleLen = 25.5 * 25.4 // inches to mm
const stringsHeights = [1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]

let isCustomTuning = false

const props = defineProps<{
    state: ScalesItemState,
    notesDisplayModes: Map<Note, NoteDisplayMode>,
    extraNoteNames?: Map<Note, string>
}>()
const state = props.state
const notesDispModes = props.notesDisplayModes
const extraNames = props.extraNoteNames

const isFlat = inject(isFlatNotationKey)!
const box = ref(state.box)
const currentTuningId = ref(state.tuning.id)
const HS = ref(state.tuning.HS)

let customTuningNotes: Note[] = []
if (currentTuningId.value == 'custom')
{
    isCustomTuning = true
    customTuningNotes = state.tuning.tunings
} else
{
    customTuningNotes = getTuningNotes(currentTuningId.value).slice()
    state.tuning.tunings = customTuningNotes
}
const stringsTunings = reactive<Ref<Note>[]>([])
const isLH = ref(state.isLH)
const isTuningMenuShown = ref(false)


watch(stringsTunings, (val) => state.stringsNumber = val.length)
watch(HS, (val) => state.tuning.HS = val)
watch(box, (val) => state.box = val)
watch(currentTuningId, (val) => {
    state.tuning.id = val

    if (val == customId) 
    {
        isCustomTuning = true
        state.tuning.tunings = customTuningNotes
        return
    }

    isCustomTuning = false
    state.tuning.tunings = customTuningNotes
    const len = stringsTunings.length
    const notes = getTuningNotes(val)
    const nLen = notes.length
    for (let i = 0; i < len; i++)
    {
        stringsTunings[i % len].value = notes[i % nLen]
    }
    clearArr(customTuningNotes)
    copyValues(notes, customTuningNotes)
})

function removeString()
{
    const len = stringsTunings.length
    if (len <= minStringsNumber) return

    stringsTunings.pop()
}
function addString()
{
    const len = stringsTunings.length
    if (len >= maxStringsNumber) return

    let n: Note
    if (isCustomTuning)
    {
        let l = customTuningNotes.length
        if (len >= l)
        {
            customTuningNotes.push(getLowerNote(customTuningNotes[l - 1], 5))
            n = customTuningNotes[l]
        } else
        {
            n = customTuningNotes[len]
        }
    } else
    {
        n = getStringTuning(len, currentTuningId.value)
    }
    const refN = ref(n)
    watch(refN, (val) => {
        customTuningNotes[len] = val
        updateTuningId()
    })
    stringsTunings.push(refN)
}

function isAddFretDot(fretNumber: number)
{
    return (fretNumber > 0) && (fretNumber <= 9) || 
        (fretNumber > 13) && (fretNumber < 23) ? (fretNumber & 1) === 1 : false
}
function isDoubleDot(fretNumber: number)
{
    return fretNumber == 12 || fretNumber == 24
}

function getStringStyle(stringIndex: number)
{
    const lastI = stringsHeights.length - 1
    return `height: ${stringsHeights[stringIndex >= lastI ? lastI : stringIndex]}px`
}
function getFretVerStyle(fretNumber: number)
{
    return 'flex:' + getFretWidth(scaleLen, fretNumber)
}

function getNoteClass(n: Note, fret: number, stringNumber: number)
{
    let result = ''
    const mode = notesDispModes.get(n)!
    if ((mode & NoteDisplayMode.Inactve) === NoteDisplayMode.Inactve || 
        !isInBox(fret, stringNumber))
    {
        result += 'inactive-note'
    } else if ((mode & NoteDisplayMode.Highlight) === NoteDisplayMode.Highlight)
    {
        result += 'highlight-note'
    }
    if (!isShowNote(n))
    {
        result += 'invis'
    }
    return result
}

function isShowNote(n: Note)
{
    return (notesDispModes.get(n)! & NoteDisplayMode.Disabled) !== NoteDisplayMode.Disabled
}

function getNoteName(note: Note, offset: number)
{
    const n = highN(note, offset)
    const name = extraNames?.get(n)
    if (name)
    {
        return name
    }
    return noteN(n, isFlat?.value)
}

function updateTuningId()
{
    for (const id of getTuningsIds())
    {
        if (isArraysEqual(getTuningNotes(id), customTuningNotes))
        {
            currentTuningId.value = id
            return
        }
    }
    currentTuningId.value = customId
}

function toggleBox(numb: number)
{
    box.value = numb === box.value ? -1 : numb 
}

function isInBox(fret: number, stringNumber: number)
{
    if (box.value < 0) return true

    if (fret < box.value) return false

    return fret <= (box.value + getBoxSizeForString(stringNumber))
}

function getBoxSizeForString(stringNumber: number)
{
    // for last string get same box size as for previous string
    if (stringNumber == 0) return getBoxSizeForString(1)

    const higherString = stringNumber - 1
    const noteOnHigherString = highN(stringsTunings[higherString].value, box.value)
    let boxSize = 0
    for (boxSize; true; boxSize++)
    {
        if (noteOnHigherString == highN(stringsTunings[stringNumber].value, box.value + boxSize)) break
    }
    return boxSize == 0 ? 1 : boxSize - 1
}

const stringsNUmb = state.stringsNumber
for (let i = 0; i < stringsNUmb; i++)
{
    addString()
}
</script>

<template>
    <div class="neck-block" :class="{ lh: isLH }">
        <div class="lh-rh-toggle-block">
            <span class="fnt f18 norm-clr" title="Switch fretboard for lefthanded" @click="isLH = true">
                Left handed</span>
            <div class="tgl-checkbox hov-parent norm-bg3" title="Switch fretboard" @click="isLH = !isLH">
                <div class="tgl-checkbox-slider el-bg hov-child-clr tr-al"
                    :class="{ 'slider-r': !isLH, 'slider-l': isLH }"></div>
            </div>
            <span class="fnt f18 norm-clr" title="Switch fretboard for righthanded" @click="isLH = false">
                Right handed</span>
        </div>

        <div class="strings-btns-block">
            <i class="el-clr hov-el-clr mi-filled md-24 mi-menu tr-al tunings-menu-btn"
                @click="isTuningMenuShown = !isTuningMenuShown"></i>
            <div class="el-clr hov-el-clr mi-filled md-24 mi-remove-circle-outline tr-al" @click="removeString"></div>
            <span class="strings-numb norm-clr fnt f14 f-bold">{{ stringsTunings.length }}</span>
            <div class="el-clr hov-el-clr mi-filled md-24 mi-add-circle-outline tr-al" @click="addString"></div>
        </div>

        <div>
        </div>

        <div v-show="false">
            <SafeTeleport to="#modal" :disabled="!isTuningMenuShown">
                <ModalWindow title="Tuning" :onCloseButton="() => isTuningMenuShown = false">
                    <ul class="tuners-block">
                        <Tuner v-for="(_, i) in stringsTunings" v-model:note="stringsTunings[i]">
                        </Tuner>
                    </ul>
                    <Tuning v-model:tuningId="currentTuningId" v-model:HS="HS"></Tuning>
                </ModalWindow>
            </SafeTeleport>
        </div>

        <div class="tuners-block-wrap">
            <ul class="tuners-block">
                <Tuner v-for="(_, i) in stringsTunings" v-model:note="stringsTunings[i]">
                </Tuner>
            </ul>
        </div>
        <div class="fretboard frets-width-cont">
            <div class="fret-null">
                <div class="fret-hor" v-for="(s, i) in stringsTunings">
                    <div class="note fnt f16 norm-note" :class="getNoteClass(highN(s.value, HS), 0, i)">
                        {{ getNoteName(s.value, HS)}}
                    </div>
                </div>
            </div>
            <div class="fret-ver fretboard-bg" v-for="f in fretsNumber" :style="getFretVerStyle(f)">
                <div class="fret-inlay neg-bg" v-if="isAddFretDot(f)"></div>
                <div class="fret-inlay inlay-top neg-bg" v-if="isDoubleDot(f)"></div>
                <div class="fret-inlay inlay-bottom neg-bg" v-if="isDoubleDot(f)"></div>
                <div class=" fret-hor fretboard-bg" v-for="(s, i) in stringsTunings">
                    <div class="string" :style="getStringStyle(i)"></div>
                    <div class="note fnt f16 norm-note" :class="getNoteClass(highN(s.value, f + HS), f, i)">
                        {{ getNoteName(s.value, f + HS) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="tuning-btn-block">
            <i class="el-clr hov-el-clr mi-filled md-24 mi-menu tr-al"
                @click="isTuningMenuShown = !isTuningMenuShown"></i>
            <LeftArrow @click="HS--"></LeftArrow>
            <span class="halfsteps-numb norm-clr fnt f14 f-bold">{{ HS }}</span>
            <RightArrow @click="HS++"></RightArrow>
        </div>

        <div class="frets-numbers frets-width-cont">
            <div class="el-clr hov-el-clr" v-for="i in fretsNumber + 1" @click="toggleBox(i - 1)"
                :class="box !== i - 1 ? 'norm-bg2': ''" 
                :style="i > 1 ? getFretVerStyle(i - 1) : ''">
                <div class="fret-dot-cont">
                    <div class="fret-dot neg-bg" v-if="isAddFretDot(i - 1) || isDoubleDot(i - 1)"></div>
                    <div class="fret-dot neg-bg" v-if="isDoubleDot(i - 1)"></div>
                </div>
                <span class="fnt f-bold f14 tr-al">{{ i - 1 }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fret-inlay {
    flex: 0;
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    -moz-border-radius: 18px;
    -webkit-border-radius: 18px;
    border-radius: 18px;
}
.inlay-top {
    top: 25%;
}
.inlay-bottom {
    top: 75%;
}
</style>