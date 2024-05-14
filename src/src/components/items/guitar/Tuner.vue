<script setup lang="ts">
import LeftArrow from '@/components/common/LeftArrow.vue';
import RightArrow from '@/components/common/RightArrow.vue';
import { isFlatNotationKey } from '@/components/keys';
import { Note, getHigherNote, getLowerNote, getNoteName, getNotesList } from '@/types/Note';
import { inject, ref } from 'vue';

const note = defineModel("note", { required: true })
const isFlat = inject(isFlatNotationKey)

const selectedNote = ref(note.value as Note)
const notes = getNotesList()

function lower()
{
    selectedNote.value = getLowerNote(selectedNote.value)
}
function higher()
{
    selectedNote.value = getHigherNote(selectedNote.value)
}
</script>

<template>
    <li class="str-tuner">
        <LeftArrow title="Tune lower" @click="lower"></LeftArrow>
        <select class="str-tuner-sel fnt f16 capitalized el-clr norm-bg3" v-model="selectedNote">
            <option v-for="n in notes" :value="n">{{ getNoteName(n, isFlat) }}</option>
        </select>
        <RightArrow title="Tune higher" @click="higher"></RightArrow>
    </li>
</template>